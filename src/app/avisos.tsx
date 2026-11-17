import { router, type Href } from 'expo-router';

import { ordenarAvisos, rutaDeAviso } from '@/features/avisos/avisos';
import { BandejaScreen } from '@/features/avisos/bandeja-screen';
import { useCuenta } from '@/features/cuenta/cuenta-provider';

/** "/avisos": bandeja de avisos de proveedores. Solo con sesión. */
export default function Avisos() {
  const { cuenta } = useCuenta();
  return (
    <BandejaScreen
      avisos={ordenarAvisos(cuenta.avisos)}
      alVolver={() => router.back()}
      alAbrir={(aviso) => router.push(rutaDeAviso(aviso) as Href)}
    />
  );
}
