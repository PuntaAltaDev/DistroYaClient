import { router } from 'expo-router';

import { ComercioScreen } from '@/features/comercio/comercio-screen';
import { useCuenta } from '@/features/cuenta/cuenta-provider';

/** "/comercio": editar el comercio desde Ajustes. Se guarda solo. */
export default function EditarComercio() {
  const { cuenta, actualizar } = useCuenta();
  return (
    <ComercioScreen
      comercio={cuenta.comercio}
      alVolver={() => router.back()}
      alGuardar={(comercio) => actualizar({ comercio })}
    />
  );
}
