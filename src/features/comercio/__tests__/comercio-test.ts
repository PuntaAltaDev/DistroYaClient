import type { Lugar } from '@/lib/places';

import {
  borradorDe,
  comercioDe,
  comercioGuardado,
  direccionCompleta,
  NOMBRE_MAX,
  validarComercio,
  type BorradorComercio,
} from '../comercio';

const lugar: Lugar = {
  placeId: 'abc',
  calle: 'Belgrano',
  numero: '1200',
  localidad: 'Punta Alta',
  provincia: 'Buenos Aires',
  codigoPostal: '8109',
  latitud: -38.88,
  longitud: -62.07,
};

const borrador = (cambios: Partial<BorradorComercio> = {}): BorradorComercio => ({
  ...borradorDe(),
  nombreComercio: 'Bar El Puerto',
  direccion: 'Belgrano 1200, Punta Alta',
  lugar,
  ...cambios,
});

describe('validarComercio', () => {
  it('acepta un comercio completo', () => {
    expect(validarComercio(borrador(), true)).toEqual({});
  });

  it('pide un nombre de 2 a 60 letras', () => {
    expect(validarComercio(borrador({ nombreComercio: ' B ' }), true).nombreComercio).toBe(
      'Escribí el nombre de tu comercio.',
    );
    expect(validarComercio(borrador({ nombreComercio: 'Bo' }), true)).toEqual({});
    expect(
      validarComercio(borrador({ nombreComercio: 'x'.repeat(NOMBRE_MAX + 1) }), true)
        .nombreComercio,
    ).toBe('Hasta 60 letras.');
  });

  it('con Google, la dirección tiene que salir de la lista', () => {
    expect(validarComercio(borrador({ lugar: undefined }), true).direccion).toBe(
      'Elegí una opción de la lista, así queda la localidad.',
    );
    expect(validarComercio(borrador({ lugar: { ...lugar, localidad: '' } }), true).direccion).toBe(
      'Esa dirección está incompleta. Elegí una con calle y localidad.',
    );
  });

  it('sin Google, alcanza con escribirla', () => {
    expect(validarComercio(borrador({ lugar: undefined }), false)).toEqual({});
    expect(validarComercio(borrador({ direccion: 'Bel', lugar: undefined }), false).direccion).toBe(
      'Escribí la calle y el número.',
    );
  });
});

describe('comercioDe', () => {
  it('deja el comercio prolijo y sin piso ni depto vacíos', () => {
    expect(
      comercioDe(borrador({ nombreComercio: '  Bar   El Puerto ', piso: ' ', depto: '' })),
    ).toEqual({ nombreComercio: 'Bar El Puerto', direccion: 'Belgrano 1200, Punta Alta', lugar });
  });

  it('guarda piso y depto si los tiene', () => {
    expect(comercioDe(borrador({ piso: '2', depto: 'B ' }))).toMatchObject({
      piso: '2',
      depto: 'B',
    });
  });

  it('vuelve al formulario igual que estaba', () => {
    const comercio = comercioDe(borrador({ piso: '2' }));
    expect(borradorDe(comercio)).toEqual(borrador({ piso: '2' }));
  });
});

describe('direccionCompleta', () => {
  const comercio = comercioDe(borrador());

  it('sin piso ni depto, es la dirección', () => {
    expect(direccionCompleta(comercio)).toBe('Belgrano 1200, Punta Alta');
  });

  it('mete el piso y el depto antes de la localidad', () => {
    expect(direccionCompleta({ ...comercio, piso: '2', depto: 'B' })).toBe(
      'Belgrano 1200, 2° B, Punta Alta',
    );
    expect(direccionCompleta({ ...comercio, depto: 'Local 3' })).toBe(
      'Belgrano 1200, Local 3, Punta Alta',
    );
  });

  it('escrita a mano, los agrega al final', () => {
    expect(direccionCompleta({ nombreComercio: 'Bar', direccion: 'Mitre 50', piso: '1' })).toBe(
      'Mitre 50, 1°',
    );
  });
});

describe('comercioGuardado', () => {
  it('sin comercio, no hay', () => {
    expect(comercioGuardado(undefined)).toBeUndefined();
    expect(comercioGuardado({ nombreComercio: 'Bar' })).toBeUndefined();
    expect(comercioGuardado({ nombreComercio: ' ', direccion: 'Mitre 50' })).toBeUndefined();
  });

  it('conserva uno válido', () => {
    const comercio = comercioDe(borrador({ piso: '2', depto: 'B' }));
    expect(comercioGuardado(comercio)).toEqual(comercio);
  });

  it('descarta las partes con otra forma', () => {
    expect(
      comercioGuardado({
        nombreComercio: 'Bar',
        direccion: 'Mitre 50',
        piso: 3,
        depto: '',
        lugar: { ...lugar, latitud: 'x' },
      }),
    ).toEqual({ nombreComercio: 'Bar', direccion: 'Mitre 50' });
  });
});
