import { planVigente, type Proveedor } from '@/features/proveedores/proveedor';

/** Para comparar textos: sin acentos, sin mayúsculas y sin espacios de más. */
export const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

export type Filtro = {
  /** Lo que escribió. Cada palabra tiene que aparecer en el nombre, un rubro o la localidad. */
  texto: string;
  /** Rubros elegidos. Alcanza con que el proveedor tenga uno. Vacío: todos. */
  rubros: readonly string[];
};

/**
 * El buscador: solo proveedores con plan vigente, que cumplan el texto y los rubros,
 * ordenados por nombre. Con la API, la búsqueda la hace el servidor y esto se reemplaza.
 */
export function buscar(proveedores: readonly Proveedor[], filtro: Filtro, ahora = new Date()) {
  const palabras = normalizar(filtro.texto).split(' ').filter(Boolean);
  const rubros = new Set(filtro.rubros.map(normalizar));

  return proveedores
    .filter((p) => planVigente(p, ahora))
    .filter((p) => rubros.size === 0 || p.rubros.some((r) => rubros.has(normalizar(r))))
    .filter((p) => {
      const donde = normalizar([p.razonSocial, p.localidad, ...p.rubros].join(' '));
      return palabras.every((palabra) => donde.includes(palabra));
    })
    .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es'));
}

/** Suma o saca un rubro de los elegidos. */
export const alternarRubro = (elegidos: readonly string[], rubro: string) =>
  elegidos.includes(rubro) ? elegidos.filter((r) => r !== rubro) : [...elegidos, rubro];
