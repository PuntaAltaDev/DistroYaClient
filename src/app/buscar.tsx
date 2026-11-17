import { router } from 'expo-router';

import { RUBROS } from '@/data/rubros';
import { useAbrirAvisoTocado } from '@/features/avisos/abrir-aviso-tocado';
import { contadorNuevos, sinLeer } from '@/features/avisos/avisos';
import { BuscadorScreen } from '@/features/buscador/buscador-screen';
import { useCuenta } from '@/features/cuenta/cuenta-provider';
import { useFavoritos } from '@/features/cuenta/use-favoritos';
import { useProveedores } from '@/features/proveedores/proveedores-provider';

/** "/buscar": inicio con sesión. Buscador por texto y rubros. */
export default function Buscar() {
  const { proveedores } = useProveedores();
  const { favoritoDe, alternar } = useFavoritos();
  const { cuenta } = useCuenta();
  const nuevos = sinLeer(cuenta.avisos, cuenta.leidos).length;
  useAbrirAvisoTocado();

  return (
    <BuscadorScreen
      proveedores={proveedores}
      rubros={RUBROS}
      alAbrir={(id) => router.push({ pathname: '/proveedor/[id]', params: { id } })}
      esFavorito={(id) => !!favoritoDe(id)}
      alFavorito={alternar}
      iconos={[
        { icono: 'favorito', etiqueta: 'Mis favoritos', onPress: () => router.push('/favoritos') },
        {
          icono: 'avisos',
          etiqueta: 'Avisos',
          onPress: () => router.push('/avisos'),
          contador: contadorNuevos(nuevos),
        },
        { icono: 'ajustes', etiqueta: 'Ajustes', onPress: () => router.push('/ajustes') },
      ]}
    />
  );
}
