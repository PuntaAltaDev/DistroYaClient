import { router } from 'expo-router';

import { RUBROS } from '@/data/rubros';
import { BuscadorScreen } from '@/features/buscador/buscador-screen';
import { useFavoritos } from '@/features/cuenta/use-favoritos';
import { useProveedores } from '@/features/proveedores/proveedores-provider';

/** "/buscar": inicio con sesión. Buscador por texto y rubros. */
export default function Buscar() {
  const { proveedores } = useProveedores();
  const { favoritoDe, alternar } = useFavoritos();

  return (
    <BuscadorScreen
      proveedores={proveedores}
      rubros={RUBROS}
      alAbrir={(id) => router.push({ pathname: '/proveedor/[id]', params: { id } })}
      esFavorito={(id) => !!favoritoDe(id)}
      alFavorito={alternar}
      iconos={[
        { icono: 'favorito', etiqueta: 'Mis favoritos', onPress: () => router.push('/favoritos') },
        { icono: 'ajustes', etiqueta: 'Ajustes', onPress: () => router.push('/ajustes') },
      ]}
    />
  );
}
