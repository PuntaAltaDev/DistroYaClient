import { router } from 'expo-router';

import { RUBROS } from '@/data/rubros';
import { BuscadorScreen } from '@/features/buscador/buscador-screen';
import { useProveedores } from '@/features/proveedores/proveedores-provider';

/** "/buscar": inicio con sesión. Buscador por texto y rubros. */
export default function Buscar() {
  const { proveedores } = useProveedores();
  return (
    <BuscadorScreen
      proveedores={proveedores}
      rubros={RUBROS}
      alAbrir={(id) => router.push({ pathname: '/proveedor/[id]', params: { id } })}
      alAjustes={() => router.push('/ajustes')}
    />
  );
}
