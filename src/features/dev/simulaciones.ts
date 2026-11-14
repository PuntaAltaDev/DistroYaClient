import { useCuenta } from '@/features/cuenta/cuenta-provider';
import { planVigente } from '@/features/proveedores/proveedor';
import { useProveedores } from '@/features/proveedores/proveedores-provider';

/** Lo que se puede simular: cada cosa reemplaza una respuesta del servidor o del administrador. */
export type Simulacion = { etiqueta: string; hacer: () => void | Promise<void> };

/** Las simulaciones que tienen sentido según en qué punto está la cuenta. */
export function useSimulaciones(): Simulacion[] {
  const { cuenta } = useCuenta();
  const { proveedores, vencerPlan, restaurar } = useProveedores();
  if (!cuenta.iniciada) return [];

  const lista: Simulacion[] = [];
  // El primero que se ve en el buscador sin filtros (orden alfabético).
  const primero = proveedores
    .filter((p) => planVigente(p))
    .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es'))[0];

  if (primero) {
    lista.push({
      etiqueta: `Vencer el plan de ${primero.razonSocial}`,
      hacer: () => vencerPlan(primero.id),
    });
  }
  lista.push({ etiqueta: 'Restaurar proveedores', hacer: restaurar });

  return lista;
}
