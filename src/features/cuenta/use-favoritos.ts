import {
  alternarFavorito,
  cambiarAvisos,
  favoritoDe,
  type Favorito,
} from '@/features/favoritos/favoritos';
import { pedirPermiso } from '@/lib/notificaciones';

import { useCuenta } from './cuenta-provider';

/** Los favoritos de la cuenta, con las acciones para marcarlos y prender o apagar sus avisos. */
export function useFavoritos() {
  const { cuenta, actualizar } = useCuenta();

  return {
    favoritos: cuenta.favoritos,
    favoritoDe: (id: string): Favorito | undefined => favoritoDe(cuenta.favoritos, id),
    alternar: (id: string) => {
      const primero = cuenta.favoritos.length === 0;
      actualizar((actual) => ({ favoritos: alternarFavorito(actual.favoritos, id) }));
      // El permiso del teléfono se pide una vez y en contexto: al marcar el primer favorito,
      // que es cuando los avisos empiezan a servir.
      if (primero) void pedirPermiso();
    },
    cambiarAvisos: (id: string, activos: boolean) =>
      actualizar((actual) => ({ favoritos: cambiarAvisos(actual.favoritos, id, activos) })),
  };
}
