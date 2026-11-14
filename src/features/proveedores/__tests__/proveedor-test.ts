import type { ProveedorApi } from '@/data/proveedores';

import {
  desdeApi,
  iniciales,
  linkTelefono,
  linkWhatsapp,
  numeroWhatsapp,
  planVigente,
} from '../proveedor';

const base: ProveedorApi = {
  id: 'p1',
  razonSocial: 'Distribuidora del Sur',
  rubros: ['Cervezas'],
  direccion: 'Av. Colón 1250',
  localidad: 'Bahía Blanca',
  provincia: 'Buenos Aires',
  whatsapp: '0291 15 412-3456',
  listaFecha: '2026-11-10T10:00:00.000Z',
  suscripcion: { planName: 'Mensual', startDate: '2026-11-01', endDate: '2026-12-01' },
};

describe('desdeApi', () => {
  it('pasa las fechas de texto a fechas', () => {
    const p = desdeApi(base);
    expect(p.listaFecha).toEqual(new Date('2026-11-10T10:00:00.000Z'));
    expect(p.suscripcion?.endDate).toEqual(new Date('2026-12-01'));
  });

  it('un plan con fechas dañadas queda como sin plan', () => {
    const p = desdeApi({ ...base, suscripcion: { planName: 'X', startDate: 'x', endDate: 'y' } });
    expect(p.suscripcion).toBeUndefined();
  });
});

describe('planVigente', () => {
  const p = desdeApi(base);
  it('vale desde que empieza hasta antes de que venza', () => {
    expect(planVigente(p, new Date('2026-10-31'))).toBe(false);
    expect(planVigente(p, new Date('2026-11-01'))).toBe(true);
    expect(planVigente(p, new Date('2026-11-30'))).toBe(true);
    expect(planVigente(p, new Date('2026-12-01'))).toBe(false);
  });

  it('sin plan, no está vigente', () => {
    expect(planVigente(desdeApi({ ...base, suscripcion: undefined }))).toBe(false);
  });
});

describe('numeroWhatsapp', () => {
  it.each([
    ['0291 15 412-3456', '5492914123456'],
    ['+54 9 2932 55-1020', '5492932551020'],
    ['+54 2932 55-1020', '5492932551020'],
    ['5492914998877', '5492914998877'],
    ['2932 40-7788', '5492932407788'],
    ['02921 15 66-3344', '5492921663344'],
    ['0054 9 291 412 3456', '5492914123456'],
  ])('%s → %s', (cargado, esperado) => {
    expect(numeroWhatsapp(cargado)).toBe(esperado);
  });
});

describe('links', () => {
  it('WhatsApp lleva el número y el mensaje codificado', () => {
    expect(linkWhatsapp({ whatsapp: '291 412 3456' }, 'Hola, ¿qué tal?')).toBe(
      'https://wa.me/5492914123456?text=Hola%2C%20%C2%BFqu%C3%A9%20tal%3F',
    );
  });

  it('teléfono deja solo los números y el "+"', () => {
    expect(linkTelefono('0291 452-1100')).toBe('tel:02914521100');
    expect(linkTelefono('+54 291 452-1100')).toBe('tel:+542914521100');
  });
});

describe('iniciales', () => {
  it('toma las palabras con mayúscula', () => {
    expect(iniciales('Distribuidora del Sur')).toBe('DS');
    expect(iniciales('Bodega Los Álamos')).toBe('BL');
    expect(iniciales('hielo polar')).toBe('HP');
  });
});
