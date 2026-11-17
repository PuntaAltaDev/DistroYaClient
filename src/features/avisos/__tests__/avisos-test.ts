import type { Favorito } from '@/features/favoritos/favoritos';

import {
  AVISOS_MAX,
  avisoListaNueva,
  avisosGuardados,
  contadorNuevos,
  debeRecibir,
  leidosGuardados,
  notificacionDe,
  ordenarAvisos,
  rutaDeAviso,
  sinLeer,
  sumarAviso,
  type AvisoCliente,
} from '../avisos';

const AHORA = new Date('2026-11-16T12:00:00.000Z');

const aviso = (datos: Partial<AvisoCliente> = {}): AvisoCliente => ({
  id: 'a1',
  proveedorId: 'p1',
  proveedorNombre: 'Distri Sur',
  tipo: 'aviso',
  titulo: 'Promo',
  texto: '10% menos',
  fecha: AHORA.toISOString(),
  ...datos,
});

const favorito = (avisosActivos: boolean): Favorito[] => [
  { proveedorId: 'p1', avisosActivos, desde: AHORA.toISOString() },
];

describe('debeRecibir', () => {
  it('los avisos del proveedor llegan aunque no sea favorito', () => {
    expect(debeRecibir(aviso(), [])).toBe(true);
    expect(debeRecibir(aviso(), favorito(true))).toBe(true);
  });

  it('las listas nuevas llegan solo de favoritos', () => {
    const lista = aviso({ tipo: 'lista-nueva' });
    expect(debeRecibir(lista, [])).toBe(false);
    expect(debeRecibir(lista, favorito(true))).toBe(true);
  });

  it('con los avisos de ese favorito apagados, no llega nada', () => {
    expect(debeRecibir(aviso(), favorito(false))).toBe(false);
    expect(debeRecibir(aviso({ tipo: 'lista-nueva' }), favorito(false))).toBe(false);
  });
});

describe('avisoListaNueva', () => {
  it('dice quién publicó y abre su perfil', () => {
    const a = avisoListaNueva({ id: 'p1', razonSocial: 'Distri Sur' }, AHORA);
    expect(a).toMatchObject({
      proveedorId: 'p1',
      tipo: 'lista-nueva',
      texto: 'Distri Sur publicó una lista nueva.',
      fecha: AHORA.toISOString(),
    });
    expect(rutaDeAviso(a)).toBe('/proveedor/p1');
  });
});

describe('bandeja', () => {
  it('suma primero, sin repetir y con un máximo', () => {
    const muchos = Array.from({ length: AVISOS_MAX }, (_, i) => aviso({ id: `v${i}` }));
    const lista = sumarAviso(muchos, aviso({ id: 'nuevo' }));
    expect(lista).toHaveLength(AVISOS_MAX);
    expect(lista[0].id).toBe('nuevo');
    expect(sumarAviso([aviso()], aviso({ titulo: 'Otro' }))).toEqual([aviso({ titulo: 'Otro' })]);
  });

  it('ordena del más nuevo al más viejo', () => {
    const viejo = aviso({ id: 'viejo', fecha: '2026-11-01T00:00:00.000Z' });
    const nuevo = aviso({ id: 'nuevo', fecha: '2026-11-15T00:00:00.000Z' });
    expect(ordenarAvisos([viejo, nuevo]).map((a) => a.id)).toEqual(['nuevo', 'viejo']);
  });

  it('descarta lo guardado dañado', () => {
    expect(avisosGuardados({})).toEqual([]);
    expect(avisosGuardados([aviso(), aviso({ tipo: 'otro' as 'aviso' }), { id: 1 }])).toEqual([
      aviso(),
    ]);
  });
});

describe('notificacionDe', () => {
  it('el proveedor arriba; abajo el título y el texto, o solo el texto de la lista nueva', () => {
    expect(notificacionDe(aviso())).toEqual({ titulo: 'Distri Sur', texto: 'Promo: 10% menos' });
    const lista = avisoListaNueva({ id: 'p1', razonSocial: 'Distri Sur' }, AHORA);
    expect(notificacionDe(lista).texto).toBe('Distri Sur publicó una lista nueva.');
  });
});

describe('leídos', () => {
  it('sin leer son los que no están en leídos', () => {
    const avisos = [aviso({ id: 'a1' }), aviso({ id: 'a2' })];
    expect(sinLeer(avisos, ['a1']).map((a) => a.id)).toEqual(['a2']);
    expect(sinLeer(avisos, ['a1', 'a2'])).toEqual([]);
  });

  it('el contador no muestra nada sin nuevos y corta en 9+', () => {
    expect(contadorNuevos(0)).toBe('');
    expect(contadorNuevos(3)).toBe('3');
    expect(contadorNuevos(12)).toBe('9+');
  });

  it('descarta los leídos dañados y repetidos', () => {
    expect(leidosGuardados('a1')).toEqual([]);
    expect(leidosGuardados(['a1', 'a1', 2, null, 'a2'])).toEqual(['a1', 'a2']);
  });
});
