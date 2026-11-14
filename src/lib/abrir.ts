import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

import { haptics } from './haptics';

/** Abre un link en otra app (WhatsApp, teléfono, email). Si no se puede, avisa en consola. */
export async function abrirLink(url: string) {
  haptics.tap();
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn(`No se pudo abrir ${url}`, error);
  }
}

/**
 * Abre un PDF en el navegador dentro de la app (en la web, en otra pestaña).
 * El navegador del teléfono ya sabe mostrarlo, así que no hace falta un visor propio.
 */
export async function abrirPdf(url: string) {
  haptics.tap();
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.warn(`No se pudo abrir ${url}`, error);
  }
}
