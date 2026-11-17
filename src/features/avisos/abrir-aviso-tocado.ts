import { router, type Href } from 'expo-router';
import { useEffect } from 'react';

import { alTocarAviso } from '@/lib/notificaciones';

/**
 * Al tocar una notificación del teléfono, abre la pantalla que trae (el perfil del proveedor).
 * Va en el buscador: solo escucha con sesión y el navegador ya listo, incluso si la notificación
 * abrió la app estando cerrada.
 */
export function useAbrirAvisoTocado() {
  useEffect(() => alTocarAviso((url) => router.push(url as Href)), []);
}
