import {
  LARGO_PISO_DEPTO,
  limpiarPisoDepto,
  PISO_DEPTO_INICIAL,
  tienePisoDepto,
} from '../direccion';

describe('piso y depto', () => {
  it('empiezan vacíos y cerrados', () => {
    expect(PISO_DEPTO_INICIAL).toEqual({ piso: '', depto: '' });
    expect(tienePisoDepto(PISO_DEPTO_INICIAL)).toBe(false);
  });

  it('se abren de entrada si ya hay piso o depto', () => {
    expect(tienePisoDepto({ piso: '3', depto: '' })).toBe(true);
    expect(tienePisoDepto({ piso: '', depto: 'B' })).toBe(true);
    expect(tienePisoDepto({ piso: '  ', depto: ' ' })).toBe(false);
  });

  it(`cortan en ${LARGO_PISO_DEPTO} caracteres y aceptan vacío`, () => {
    expect(limpiarPisoDepto('PB')).toBe('PB');
    expect(limpiarPisoDepto('')).toBe('');
    expect(limpiarPisoDepto('Planta baja A')).toBe('Planta baj');
  });
});
