import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notificaciones del teléfono (expo-notifications, SDK 58). Las locales funcionan sin servidor y
 * en Expo Go; hoy las usa el simulador para mostrar los avisos de proveedores. Los push (que manda
 * el servidor) necesitan una development build y el backend de Seba.
 * Nada de acá lanza errores: si falla, se avisa en consola y la app sigue.
 * En web no hay notificaciones: ver `notificaciones.web.ts`.
 */

export type EstadoPermiso = 'concedido' | 'denegado' | 'sin-preguntar';

/** Canal de Android para los avisos de proveedores. */
const CANAL = 'avisos';

let configuracion: Promise<void> | undefined;

/**
 * Prepara los avisos una sola vez. Lo llaman solas las funciones de abajo antes de hacer nada:
 * Android 13+ necesita el canal creado antes de pedir permiso o programar.
 */
function configurar() {
  configuracion ??= crearCanalYManejador();
  return configuracion;
}

async function crearCanalYManejador() {
  Notifications.setNotificationHandler({
    // Con la app abierta, el aviso también se muestra arriba.
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(CANAL, {
        name: 'Avisos de proveedores',
        importance: AndroidImportance.DEFAULT,
      });
    } catch (error) {
      console.warn('No se pudo crear el canal de avisos', error);
    }
  }
}

function leerPermiso(permiso: Notifications.NotificationPermissionsStatus): EstadoPermiso {
  // En iPhone, "provisional" (llegan en silencio al centro de notificaciones) también sirve.
  if (permiso.granted || permiso.ios?.status === IosAuthorizationStatus.PROVISIONAL)
    return 'concedido';
  return permiso.canAskAgain ? 'sin-preguntar' : 'denegado';
}

/** Muestra el pedido de permiso del sistema (si todavía se puede). Devuelve si quedó concedido. */
export async function pedirPermiso(): Promise<boolean> {
  try {
    await configurar();
    return leerPermiso(await Notifications.requestPermissionsAsync()) === 'concedido';
  } catch (error) {
    console.warn('No se pudo pedir el permiso de avisos', error);
    return false;
  }
}

export type Notificacion = {
  id: string;
  titulo: string;
  texto: string;
  /** Ruta de la app que se abre al tocarla. */
  url: string;
};

/** Muestra una notificación ya. Sin permiso, el sistema no la muestra (y no pasa nada). */
export async function mostrarNotificacion({ id, titulo, texto, url }: Notificacion) {
  try {
    await configurar();
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: { title: titulo, body: texto, data: { url } },
      // Sin fecha: se muestra ya. En Android va por el canal de avisos.
      trigger: Platform.OS === 'android' ? { channelId: CANAL } : null,
    });
  } catch (error) {
    console.warn(`No se pudo mostrar la notificación "${id}"`, error);
  }
}

function urlDe(respuesta: Notifications.NotificationResponse | null) {
  const url = respuesta?.notification.request.content.data?.url;
  return typeof url === 'string' ? url : undefined;
}

/**
 * Llama a `abrir` con la ruta del aviso que el usuario toca. También cubre el aviso que abrió la
 * app estando cerrada. Devuelve la función para dejar de escuchar.
 */
export function alTocarAviso(abrir: (url: string) => void) {
  try {
    const inicial = urlDe(Notifications.getLastNotificationResponse());
    if (inicial) {
      Notifications.clearLastNotificationResponse();
      abrir(inicial);
    }
    const suscripcion = Notifications.addNotificationResponseReceivedListener((respuesta) => {
      const url = urlDe(respuesta);
      if (!url) return;
      Notifications.clearLastNotificationResponse();
      abrir(url);
    });
    return () => suscripcion.remove();
  } catch (error) {
    console.warn('No se pudo escuchar los toques en los avisos', error);
    return () => {};
  }
}
