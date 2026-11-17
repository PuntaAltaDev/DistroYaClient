import type { Notificacion } from './notificaciones';

/**
 * En web no hay notificaciones del teléfono (expo-notifications es solo iOS y Android).
 * El permiso se da por concedido y mostrar solo deja una línea en la consola.
 */
export async function pedirPermiso(): Promise<boolean> {
  return true;
}

export async function mostrarNotificacion(notificacion: Notificacion) {
  console.info(`[web] Notificación: ${notificacion.titulo}: ${notificacion.texto}`);
}

export function alTocarAviso(_abrir: (url: string) => void) {
  return () => {};
}
