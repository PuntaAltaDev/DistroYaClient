/** Lo que se puede simular: cada cosa reemplaza una respuesta del servidor o del administrador. */
export type Simulacion = { etiqueta: string; hacer: () => void | Promise<void> };

/** Las simulaciones que tienen sentido según en qué punto está la cuenta. Todavía ninguna. */
export function useSimulaciones(): Simulacion[] {
  return [];
}
