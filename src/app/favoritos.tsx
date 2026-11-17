import { router } from 'expo-router';

import { useFavoritos } from '@/features/cuenta/use-favoritos';
import { favoritosVisibles } from '@/features/favoritos/favoritos';
import { FavoritosScreen } from '@/features/favoritos/favoritos-screen';
import { useProveedores } from '@/features/proveedores/proveedores-provider';

/** "/favoritos": Mis favoritos. Solo con sesión. */
export default function Favoritos() {
  const { proveedores } = useProveedores();
  const { favoritos, alternar } = useFavoritos();
  const { visibles, ocultos } = favoritosVisibles(favoritos, proveedores);

  return (
    <FavoritosScreen
      proveedores={visibles}
      ocultos={ocultos}
      alVolver={() => router.back()}
      alAbrir={(id) => router.push({ pathname: '/proveedor/[id]', params: { id } })}
      alQuitar={alternar}
    />
  );
}
