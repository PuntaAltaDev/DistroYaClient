import type { ProveedorApi } from '@/data/proveedores';

/** Plan del proveedor, con fechas. Mismos nombres que en el backend (PlanName, StartDate, EndDate). */
export type Suscripcion = { planName: string; startDate: Date; endDate: Date };

/** Un proveedor como lo usan las pantallas: igual que en la API, pero con fechas de verdad. */
export type Proveedor = Omit<ProveedorApi, 'listaFecha' | 'suscripcion'> & {
  listaFecha?: Date;
  suscripcion?: Suscripcion;
};

/** Pasa un texto ISO a fecha. Si falta o no es válido, devuelve nada. */
function fecha(texto: string | undefined): Date | undefined {
  if (!texto) return undefined;
  const d = new Date(texto);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Convierte lo que manda la API. Un plan con fechas dañadas queda como sin plan. */
export function desdeApi(p: ProveedorApi): Proveedor {
  const startDate = fecha(p.suscripcion?.startDate);
  const endDate = fecha(p.suscripcion?.endDate);
  return {
    ...p,
    listaFecha: fecha(p.listaFecha),
    suscripcion:
      p.suscripcion && startDate && endDate
        ? { planName: p.suscripcion.planName, startDate, endDate }
        : undefined,
  };
}

/**
 * Solo los proveedores con plan vigente aparecen en el buscador: ya empezó y todavía no venció.
 * Con la API, el servidor ya filtra; esto queda como resguardo.
 */
export function planVigente(p: Proveedor, ahora = new Date()) {
  const s = p.suscripcion;
  if (!s) return false;
  const t = ahora.getTime();
  return s.startDate.getTime() <= t && t < s.endDate.getTime();
}

/**
 * Número de WhatsApp en formato internacional argentino (549 + área + número), solo dígitos.
 * Acepta como lo carga la gente: con espacios, guiones, "+54", "0" de larga distancia o "15".
 * No sabe dónde termina la característica, así que el "15" solo se saca si va después del 0
 * de larga distancia y separado (ej.: "0291 15 412-3456"). Si queda raro, lo corrige el proveedor.
 */
export function numeroWhatsapp(texto: string): string {
  // Se marca el "15" separado que sigue a una característica que empieza con 0.
  const sin15 = texto.trim().replace(/^(\+?0\d{2,4})[\s-]+15[\s-]+/, '$1 ');
  let n = sin15.replace(/\D/g, '');
  if (n.startsWith('00')) n = n.slice(2);
  if (n.startsWith('549')) return n;
  if (n.startsWith('54')) return `549${n.slice(2)}`;
  if (n.startsWith('0')) n = n.slice(1);
  return `549${n}`;
}

/** Link que abre el chat de WhatsApp con el proveedor, con un mensaje ya escrito. */
export const linkWhatsapp = (p: Pick<Proveedor, 'whatsapp'>, mensaje: string) =>
  `https://wa.me/${numeroWhatsapp(p.whatsapp)}?text=${encodeURIComponent(mensaje)}`;

/** Mensaje con el que se abre el chat. */
export const mensajeWhatsapp = (p: Pick<Proveedor, 'razonSocial'>) =>
  `Hola ${p.razonSocial}, te encontré en DistroYa. Quería consultarte por tu lista de precios.`;

/** Link para llamar. Deja solo los números (y el "+" del principio, si está). */
export const linkTelefono = (telefono: string) =>
  `tel:${telefono.trim().startsWith('+') ? '+' : ''}${telefono.replace(/\D/g, '')}`;

/** "13/11/2026" */
export const fechaCorta = (d: Date) =>
  d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Iniciales para el lugar del logo: "Distribuidora del Sur" → "DS". */
export function iniciales(razonSocial: string) {
  // Solo las palabras con mayúscula: así "del", "de" o "y" no cuentan.
  const palabras = razonSocial.trim().split(/\s+/);
  const conMayuscula = palabras.filter((w) => /^\p{Lu}/u.test(w));
  return (conMayuscula.length ? conMayuscula : palabras)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
