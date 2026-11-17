import { router, type Href } from 'expo-router';

import { rutaDeAviso } from '@/features/avisos/avisos';
import { BandejaScreen } from '@/features/avisos/bandeja-screen';
import { useBandeja } from '@/features/cuenta/use-bandeja';

/** "/avisos": bandeja de avisos de proveedores. Solo con sesión. Al abrirla, todo queda leído. */
export default function Avisos() {
  const { avisos, nuevos } = useBandeja();
  return (
    <BandejaScreen
      avisos={avisos}
      nuevos={nuevos}
      alVolver={() => router.back()}
      alAbrir={(aviso) => router.push(rutaDeAviso(aviso) as Href)}
    />
  );
}
