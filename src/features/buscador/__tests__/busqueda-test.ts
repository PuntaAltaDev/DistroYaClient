import { desdeApi } from '@/features/proveedores/proveedor';
import type { ProveedorApi } from '@/data/proveedores';

import { alternarRubro, buscar, normalizar } from '../busqueda';

const AHORA = new Date('2026-11-14T12:00:00.000Z');
const vigente = { planName: 'Mensual', startDate: '2026-11-01', endDate: '2026-12-01' };

const proveedor = (datos: Partial<ProveedorApi> & { id: string }) =>
  desdeApi({
    razonSocial: datos.id,
    rubros: [],
    direccion: '',
    localidad: 'Bahía Blanca',
    provincia: 'Buenos Aires',
    whatsapp: '2911234567',
    suscripcion: vigente,
    ...datos,
  });

const LISTA = [
  proveedor({ id: 'Distribuidora del Sur', rubros: ['Cervezas', 'Gaseosas'] }),
  proveedor({ id: 'Bodega Los Álamos', rubros: ['Vinos'], localidad: 'Punta Alta' }),
  proveedor({ id: 'Hielo Polar', rubros: ['Hielo'] }),
  proveedor({
    id: 'Vencido',
    rubros: ['Cervezas'],
    suscripcion: { planName: 'Mensual', startDate: '2026-10-01', endDate: '2026-11-01' },
  }),
  proveedor({ id: 'Sin plan', rubros: ['Cervezas'], suscripcion: undefined }),
  proveedor({
    id: 'Futuro',
    rubros: ['Cervezas'],
    suscripcion: { planName: 'Mensual', startDate: '2026-11-20', endDate: '2026-12-20' },
  }),
];

const nombres = (texto: string, rubros: string[] = []) =>
  buscar(LISTA, { texto, rubros }, AHORA).map((p) => p.razonSocial);

describe('normalizar', () => {
  it('saca acentos, mayúsculas y espacios de más', () => {
    expect(normalizar('  Bahía   BLANCA ')).toBe('bahia blanca');
    expect(normalizar('Ñandú')).toBe('nandu');
  });
});

describe('buscar', () => {
  it('sin filtro, muestra solo los planes vigentes, ordenados por nombre', () => {
    expect(nombres('')).toEqual(['Bodega Los Álamos', 'Distribuidora del Sur', 'Hielo Polar']);
  });

  it('no muestra planes vencidos, sin plan o que todavía no empezaron', () => {
    expect(nombres('', ['Cervezas'])).toEqual(['Distribuidora del Sur']);
  });

  it('busca en el nombre, los rubros y la localidad, sin importar acentos', () => {
    expect(nombres('alamos')).toEqual(['Bodega Los Álamos']);
    expect(nombres('GASEOSAS')).toEqual(['Distribuidora del Sur']);
    expect(nombres('punta')).toEqual(['Bodega Los Álamos']);
  });

  it('cada palabra tiene que aparecer', () => {
    expect(nombres('hielo bahia')).toEqual(['Hielo Polar']);
    expect(nombres('hielo punta')).toEqual([]);
  });

  it('con varios rubros, alcanza con tener uno', () => {
    expect(nombres('', ['Vinos', 'Hielo'])).toEqual(['Bodega Los Álamos', 'Hielo Polar']);
  });

  it('el plan que vence justo ahora ya no aparece', () => {
    const justo = proveedor({
      id: 'Justo',
      suscripcion: { planName: 'Mensual', startDate: '2026-10-14', endDate: AHORA.toISOString() },
    });
    expect(buscar([justo], { texto: '', rubros: [] }, AHORA)).toEqual([]);
  });
});

describe('alternarRubro', () => {
  it('suma el rubro si no estaba y lo saca si estaba', () => {
    expect(alternarRubro(['Vinos'], 'Hielo')).toEqual(['Vinos', 'Hielo']);
    expect(alternarRubro(['Vinos', 'Hielo'], 'Vinos')).toEqual(['Hielo']);
  });
});
