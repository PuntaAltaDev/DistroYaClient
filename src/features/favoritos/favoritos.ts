import { planVigente, type Proveedor } from '@/features/proveedores/proveedor';

/**
 * Un proveedor que el cliente marcó como favorito. Misma forma que en Proveedores y la API.
 * `avisosActivos`: recibe sus avisos y sus listas nuevas (se puede apagar sin sacarlo de favoritos).
 */
export type Favorito = { proveedorId: string; avisosActivos: boolean; desde: string };

export const favoritoDe = (favoritos: readonly Favorito[], proveedorId: string) =>
  favoritos.find((f) => f.proveedorId === proveedorId);

export const esFavorito = (favoritos: readonly Favorito[], proveedorId: string) =>
  !!favoritoDe(favoritos, proveedorId);

/** Lo marca (primero, con avisos prendidos) o lo desmarca. */
export function alternarFavorito(
  favoritos: readonly Favorito[],
  proveedorId: string,
  ahora = new Date(),
): Favorito[] {
  if (esFavorito(favoritos, proveedorId)) {
    return favoritos.filter((f) => f.proveedorId !== proveedorId);
  }
  return [{ proveedorId, avisosActivos: true, desde: ahora.toISOString() }, ...favoritos];
}

/** Prende o apaga los avisos de un favorito. Si no es favorito, no cambia nada. */
export const cambiarAvisos = (
  favoritos: readonly Favorito[],
  proveedorId: string,
  avisosActivos: boolean,
): Favorito[] =>
  favoritos.map((f) => (f.proveedorId === proveedorId ? { ...f, avisosActivos } : f));

/**
 * "Mis favoritos": los proveedores con plan vigente, del último marcado al primero.
 * `ocultos` cuenta los que hoy no se ven (plan vencido o ya no están).
 */
export function favoritosVisibles(
  favoritos: readonly Favorito[],
  proveedores: readonly Proveedor[],
  ahora = new Date(),
) {
  const visibles = [...favoritos]
    .sort((a, b) => b.desde.localeCompare(a.desde))
    .map((f) => proveedores.find((p) => p.id === f.proveedorId))
    .filter((p): p is Proveedor => !!p && planVigente(p, ahora));
  return { visibles, ocultos: favoritos.length - visibles.length };
}

/** Lee lo guardado: descarta lo dañado y los repetidos. */
export function favoritosGuardados(valor: unknown): Favorito[] {
  if (!Array.isArray(valor)) return [];
  const vistos = new Set<string>();
  return valor.filter((f): f is Favorito => {
    const ok =
      typeof f?.proveedorId === 'string' &&
      typeof f.avisosActivos === 'boolean' &&
      typeof f.desde === 'string' &&
      !vistos.has(f.proveedorId);
    if (ok) vistos.add(f.proveedorId);
    return ok;
  });
}
