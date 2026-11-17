import { RegistroScreen } from '@/features/comercio/registro-screen';
import { useCuenta } from '@/features/cuenta/cuenta-provider';

/**
 * "/registro": el comercio, una sola vez. Solo con sesión y sin comercio. Al guardarlo, las rutas
 * protegidas llevan solas al buscador.
 */
export default function Registro() {
  const { actualizar } = useCuenta();
  return <RegistroScreen alTerminar={(comercio) => actualizar({ comercio })} />;
}
