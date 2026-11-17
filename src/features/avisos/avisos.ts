import { favoritoDe, type Favorito } from '@/features/favoritos/favoritos';

/**
 * Avisos que le llegan al cliente. Misma forma que en Proveedores y la API.
 * - `aviso`: título y texto que escribe el proveedor (a sus favoritos o a todos sus clientes).
 * - `lista-nueva`: automático cuando un favorito publica una lista.
 */
export type TipoAviso = 'aviso' | 'lista-nueva';

export type AvisoCliente = {
  id: string;
  proveedorId: string;
  proveedorNombre: string;
  tipo: TipoAviso;
  titulo: string;
  texto: string;
  /** ISO. */
  fecha: string;
};

/** Cuántos avisos se guardan en la bandeja. */
export const AVISOS_MAX = 50;

/**
 * Si el aviso le llega: nunca si apagó los avisos de ese favorito; las listas nuevas, solo de
 * favoritos; los avisos del proveedor, siempre (el proveedor eligió a quién mandarlos).
 * Con la API, el servidor ya filtra; esto queda para las pruebas sin servidor.
 */
export function debeRecibir(aviso: AvisoCliente, favoritos: readonly Favorito[]) {
  const favorito = favoritoDe(favoritos, aviso.proveedorId);
  if (favorito && !favorito.avisosActivos) return false;
  return aviso.tipo === 'aviso' || !!favorito;
}

/** El aviso automático de una lista nueva. */
export function avisoListaNueva(
  proveedor: { id: string; razonSocial: string },
  ahora = new Date(),
): AvisoCliente {
  return {
    id: `lista-${proveedor.id}-${ahora.getTime()}`,
    proveedorId: proveedor.id,
    proveedorNombre: proveedor.razonSocial,
    tipo: 'lista-nueva',
    titulo: 'Lista nueva',
    texto: `${proveedor.razonSocial} publicó una lista nueva.`,
    fecha: ahora.toISOString(),
  };
}

/** Suma un aviso a la bandeja: primero, sin repetir, y con un máximo. */
export const sumarAviso = (avisos: readonly AvisoCliente[], aviso: AvisoCliente) =>
  [aviso, ...avisos.filter((a) => a.id !== aviso.id)].slice(0, AVISOS_MAX);

/** Del más nuevo al más viejo. */
export const ordenarAvisos = (avisos: readonly AvisoCliente[]) =>
  [...avisos].sort((a, b) => b.fecha.localeCompare(a.fecha));

/** Ruta que abre el aviso: el perfil del proveedor. */
export const rutaDeAviso = (aviso: Pick<AvisoCliente, 'proveedorId'>) =>
  `/proveedor/${aviso.proveedorId}`;

/** Lo que muestra la notificación del teléfono. */
export function notificacionDe(aviso: AvisoCliente) {
  return {
    titulo: aviso.proveedorNombre,
    texto: aviso.tipo === 'aviso' ? `${aviso.titulo}: ${aviso.texto}` : aviso.texto,
  };
}

const TIPOS: readonly TipoAviso[] = ['aviso', 'lista-nueva'];
const CAMPOS = ['id', 'proveedorId', 'proveedorNombre', 'titulo', 'texto', 'fecha'] as const;

/** Lee lo guardado: descarta lo dañado. */
export function avisosGuardados(valor: unknown): AvisoCliente[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter(
      (a): a is AvisoCliente =>
        !!a && TIPOS.includes(a.tipo) && CAMPOS.every((c) => typeof a[c] === 'string'),
    )
    .slice(0, AVISOS_MAX);
}

/** Los avisos que todavía no vio (los que no están en `leidos`). */
export const sinLeer = (avisos: readonly AvisoCliente[], leidos: readonly string[]) =>
  avisos.filter((a) => !leidos.includes(a.id));

/** Lo que va sobre el ícono de avisos: nada sin nuevos, y "9+" con más de nueve. */
export const contadorNuevos = (cantidad: number) =>
  cantidad <= 0 ? '' : cantidad > 9 ? '9+' : String(cantidad);

/** Lee los ids leídos guardados: descarta lo dañado y los repetidos. */
export function leidosGuardados(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];
  return [...new Set(valor.filter((id): id is string => typeof id === 'string'))];
}
