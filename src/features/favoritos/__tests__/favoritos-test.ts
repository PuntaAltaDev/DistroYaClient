import type { ProveedorApi } from '@/data/proveedores';
import { desdeApi } from '@/features/proveedores/proveedor';

import {
  alternarFavorito,
  cambiarAvisos,
  esFavorito,
  favoritosGuardados,
  favoritosVisibles,
  type Favorito,
} from '../favoritos';

const AHORA = new Date('2026-11-16T12:00:00.000Z');

const proveedor = (id: string, endDate = '2026-12-01') =>
  desdeApi({
    id,
    razonSocial: id,
    rubros: [],
    direccion: '',
    localidad: '',
    provincia: '',
    whatsapp: '',
    suscripcion: { planName: 'Mensual', startDate: '2026-11-01', endDate },
  } satisfies ProveedorApi);

describe('alternarFavorito', () => {
  it('lo marca primero, con avisos prendidos y la fecha', () => {
    const favs = alternarFavorito([], 'p1', AHORA);
    expect(favs).toEqual([{ proveedorId: 'p1', avisosActivos: true, desde: AHORA.toISOString() }]);
    expect(alternarFavorito(favs, 'p2', AHORA).map((f) => f.proveedorId)).toEqual(['p2', 'p1']);
  });

  it('si ya era favorito, lo desmarca', () => {
    const favs = alternarFavorito([], 'p1', AHORA);
    expect(alternarFavorito(favs, 'p1')).toEqual([]);
    expect(esFavorito(favs, 'p1')).toBe(true);
    expect(esFavorito([], 'p1')).toBe(false);
  });
});

describe('cambiarAvisos', () => {
  it('apaga los avisos sin sacarlo de favoritos', () => {
    const favs = cambiarAvisos(alternarFavorito([], 'p1', AHORA), 'p1', false);
    expect(favs).toEqual([{ proveedorId: 'p1', avisosActivos: false, desde: AHORA.toISOString() }]);
  });
});

describe('favoritosVisibles', () => {
  it('muestra los de plan vigente, del último marcado al primero, y cuenta los ocultos', () => {
    const favs: Favorito[] = [
      { proveedorId: 'viejo', avisosActivos: true, desde: '2026-11-01T00:00:00.000Z' },
      { proveedorId: 'nuevo', avisosActivos: true, desde: '2026-11-10T00:00:00.000Z' },
      { proveedorId: 'vencido', avisosActivos: true, desde: '2026-11-05T00:00:00.000Z' },
      { proveedorId: 'borrado', avisosActivos: true, desde: '2026-11-06T00:00:00.000Z' },
    ];
    const lista = [proveedor('viejo'), proveedor('nuevo'), proveedor('vencido', '2026-11-10')];
    const { visibles, ocultos } = favoritosVisibles(favs, lista, AHORA);
    expect(visibles.map((p) => p.id)).toEqual(['nuevo', 'viejo']);
    expect(ocultos).toBe(2);
  });
});

describe('favoritosGuardados', () => {
  it('descarta lo dañado y los repetidos', () => {
    const bueno = { proveedorId: 'p1', avisosActivos: true, desde: 'x' };
    expect(favoritosGuardados('nada')).toEqual([]);
    expect(favoritosGuardados([bueno, { ...bueno }, { proveedorId: 2 }, null])).toEqual([bueno]);
  });
});
