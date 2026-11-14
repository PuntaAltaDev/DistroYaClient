import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { FichaScreen } from '@/features/ficha/ficha-screen';
import { linkTelefono, linkWhatsapp, mensajeWhatsapp } from '@/features/proveedores/proveedor';
import { useProveedor } from '@/features/proveedores/proveedores-provider';
import { abrirLink, abrirPdf } from '@/lib/abrir';

/** "/proveedor/[id]": ficha del proveedor. Si no existe o su plan no está vigente, vuelve al buscador. */
export default function Proveedor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const proveedor = useProveedor(id);
  if (!proveedor) return <Redirect href="/buscar" />;

  return (
    <FichaScreen
      proveedor={proveedor}
      alVolver={() => (router.canGoBack() ? router.back() : router.replace('/buscar'))}
      alVerLista={() => proveedor.listaUrl && abrirPdf(proveedor.listaUrl)}
      alWhatsapp={() => abrirLink(linkWhatsapp(proveedor, mensajeWhatsapp(proveedor)))}
      alLlamar={() => proveedor.telefono && abrirLink(linkTelefono(proveedor.telefono))}
    />
  );
}
