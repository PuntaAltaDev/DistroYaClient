import {
  avisoListaNueva,
  debeRecibir,
  notificacionDe,
  rutaDeAviso,
  sumarAviso,
  type AvisoCliente,
} from '@/features/avisos/avisos';
import { useCuenta } from '@/features/cuenta/cuenta-provider';
import { planVigente, type Proveedor } from '@/features/proveedores/proveedor';
import { useProveedores } from '@/features/proveedores/proveedores-provider';
import { mostrarNotificacion } from '@/lib/notificaciones';

/** Lo que se puede simular: cada cosa reemplaza una respuesta del servidor o del administrador. */
export type Simulacion = { etiqueta: string; hacer: () => void | Promise<void> };

/** Aviso de prueba, como lo escribe el proveedor en "Avisar a clientes". */
const avisoDePrueba = (p: Proveedor, ahora = new Date()): AvisoCliente => ({
  id: `aviso-${p.id}-${ahora.getTime()}`,
  proveedorId: p.id,
  proveedorNombre: p.razonSocial,
  tipo: 'aviso',
  titulo: 'Promo de la semana',
  texto: 'Hasta el viernes, 10% menos en todas las cajas.',
  fecha: ahora.toISOString(),
});

/** Las simulaciones que tienen sentido según en qué punto está la cuenta. */
export function useSimulaciones(): Simulacion[] {
  const { cuenta, actualizar } = useCuenta();
  const { proveedores, vencerPlan, restaurar } = useProveedores();
  if (!cuenta.iniciada) return [];

  const vigentes = proveedores
    .filter((p) => planVigente(p))
    .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es'));
  const deFavorito = (id: string) => cuenta.favoritos.some((f) => f.proveedorId === id);
  const favorito = vigentes.find((p) => deFavorito(p.id));

  /**
   * Hace lo que va a hacer el servidor: si le corresponde, el aviso entra a la bandeja y se
   * muestra como notificación del teléfono (que al tocarla abre el perfil).
   */
  const recibir = async (aviso: AvisoCliente) => {
    if (!debeRecibir(aviso, cuenta.favoritos)) {
      console.info(`No llega: tiene apagados los avisos de ${aviso.proveedorNombre}.`);
      return;
    }
    actualizar((actual) => ({ avisos: sumarAviso(actual.avisos, aviso) }));
    await mostrarNotificacion({ id: aviso.id, ...notificacionDe(aviso), url: rutaDeAviso(aviso) });
  };

  const lista: Simulacion[] = [];
  // De un favorito si hay; si no, del primero (los avisos pueden ir a todos los clientes).
  const quienAvisa = favorito ?? vigentes[0];
  if (quienAvisa) {
    lista.push({
      etiqueta: `Llega un aviso de ${quienAvisa.razonSocial}`,
      hacer: () => recibir(avisoDePrueba(quienAvisa)),
    });
  }
  if (favorito) {
    lista.push({
      etiqueta: `${favorito.razonSocial} (favorito) publicó una lista`,
      hacer: () => recibir(avisoListaNueva(favorito)),
    });
  }
  if (vigentes[0]) {
    const primero = vigentes[0];
    lista.push({
      etiqueta: `Vencer el plan de ${primero.razonSocial}`,
      hacer: () => vencerPlan(primero.id),
    });
  }
  lista.push({ etiqueta: 'Restaurar proveedores', hacer: restaurar });

  return lista;
}
