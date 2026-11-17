import { leer } from '@/lib/almacen';

import { cargarCuenta, CUENTA_INICIAL } from '../cuenta';

// En lugar del almacén del teléfono, cada prueba dice qué hay guardado.
jest.mock('@/lib/almacen', () => ({ leer: jest.fn(), guardar: jest.fn(), borrar: jest.fn() }));
const guardado = (valor: unknown) => jest.mocked(leer).mockResolvedValue(valor);

describe('cargarCuenta', () => {
  it('sin nada guardado, empieza de cero', async () => {
    guardado(null);
    expect(await cargarCuenta()).toEqual(CUENTA_INICIAL);
  });

  it('con datos dañados, empieza de cero', async () => {
    guardado({ iniciada: 'sí' });
    expect(await cargarCuenta()).toEqual(CUENTA_INICIAL);
  });

  it('conserva una sesión válida', async () => {
    const cuenta = {
      iniciada: true,
      metodo: 'email',
      email: 'bar@correo.com',
      terminos: { version: '2026-11-14', fecha: '2026-11-14T10:00:00.000Z' },
      comercio: { nombreComercio: 'Bar El Puerto', direccion: 'Mitre 50', piso: '2' },
      favoritos: [{ proveedorId: 'p1', avisosActivos: false, desde: '2026-11-15T10:00:00.000Z' }],
      avisos: [],
      leidos: ['a1'],
    };
    guardado(cuenta);
    expect(await cargarCuenta()).toEqual(cuenta);
  });

  it('descarta datos con otra forma', async () => {
    guardado({
      iniciada: true,
      metodo: 'facebook',
      email: 3,
      terminos: { version: 1 },
      comercio: { nombreComercio: 'Bar' },
      favoritos: 'todos',
      avisos: [{ id: 1 }],
      leidos: 'todos',
    });
    expect(await cargarCuenta()).toEqual({
      iniciada: true,
      metodo: undefined,
      email: undefined,
      terminos: undefined,
      comercio: undefined,
      favoritos: [],
      avisos: [],
      leidos: [],
    });
  });
});
