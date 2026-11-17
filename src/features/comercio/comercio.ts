import { PLACES_ACTIVO, type Lugar } from '@/lib/places';

/**
 * El comercio del cliente (restaurante, bar…). Lo completa una vez, después de entrar, para que
 * los proveedores sepan quién es y lo encuentren por nombre o localidad al mandar un aviso.
 * No lleva aprobación del Admin. Los nombres de los campos están acordados para la API de Seba.
 */
export type Comercio = {
  nombreComercio: string;
  /** "Belgrano 1200, Punta Alta": lo que quedó en el campo. */
  direccion: string;
  /** Solo si los tiene. */
  piso?: string;
  depto?: string;
  /** La dirección elegida de la lista de Google: localidad, provincia y coordenadas. */
  lugar?: Lugar;
};

/** Lo que se está escribiendo en el formulario: piso y depto vacíos en lugar de ausentes. */
export type BorradorComercio = {
  nombreComercio: string;
  direccion: string;
  piso: string;
  depto: string;
  lugar?: Lugar;
};

export type ErroresComercio = Partial<Record<'nombreComercio' | 'direccion', string>>;

export const NOMBRE_MIN = 2;
export const NOMBRE_MAX = 60;

/** El formulario arranca con lo que ya tiene (al editar) o vacío (en el registro). */
export function borradorDe(comercio?: Comercio): BorradorComercio {
  return {
    nombreComercio: comercio?.nombreComercio ?? '',
    direccion: comercio?.direccion ?? '',
    piso: comercio?.piso ?? '',
    depto: comercio?.depto ?? '',
    lugar: comercio?.lugar,
  };
}

/** Sin espacios de más al principio, al final ni repetidos en el medio. */
const prolijo = (texto: string) => texto.trim().replace(/\s+/g, ' ');

/**
 * Revisa el formulario. Devuelve los errores encontrados; vacío = todo bien.
 * Con las sugerencias de Google activas, la dirección tiene que salir de la lista: de ahí sale
 * la localidad. Sin clave de Google (una compu de desarrollo), alcanza con escribirla.
 */
export function validarComercio(
  borrador: BorradorComercio,
  placesActivo = PLACES_ACTIVO,
): ErroresComercio {
  const errores: ErroresComercio = {};

  const nombre = prolijo(borrador.nombreComercio).length;
  if (nombre < NOMBRE_MIN) errores.nombreComercio = 'Escribí el nombre de tu comercio.';
  else if (nombre > NOMBRE_MAX) errores.nombreComercio = `Hasta ${NOMBRE_MAX} letras.`;

  if (borrador.direccion.trim().length < 5) {
    errores.direccion = 'Escribí la calle y el número.';
  } else if (placesActivo && !borrador.lugar) {
    errores.direccion = 'Elegí una opción de la lista, así queda la localidad.';
  } else if (borrador.lugar && (!borrador.lugar.calle || !borrador.lugar.localidad)) {
    errores.direccion = 'Esa dirección está incompleta. Elegí una con calle y localidad.';
  }

  return errores;
}

/** El comercio listo para guardar: prolijo y sin piso ni depto si están vacíos. */
export function comercioDe(borrador: BorradorComercio): Comercio {
  const piso = borrador.piso.trim();
  const depto = borrador.depto.trim();
  return {
    nombreComercio: prolijo(borrador.nombreComercio),
    direccion: prolijo(borrador.direccion),
    ...(piso ? { piso } : {}),
    ...(depto ? { depto } : {}),
    ...(borrador.lugar ? { lugar: borrador.lugar } : {}),
  };
}

/** "Belgrano 1200, 2° B, Punta Alta": la dirección con piso y depto, para mostrar. */
export function direccionCompleta({ direccion, piso, depto, lugar }: Comercio) {
  const unidad = [piso && `${piso}°`, depto].filter(Boolean).join(' ');
  if (!unidad) return direccion;
  // La localidad va al final: el piso y el depto se meten después de la calle.
  const localidad = lugar?.localidad;
  if (localidad && direccion.endsWith(`, ${localidad}`)) {
    return `${direccion.slice(0, -localidad.length - 2)}, ${unidad}, ${localidad}`;
  }
  return `${direccion}, ${unidad}`;
}

const esTexto = (valor: unknown): valor is string => typeof valor === 'string';
const esNumero = (valor: unknown): valor is number =>
  typeof valor === 'number' && Number.isFinite(valor);

function lugarGuardado(valor: unknown): Lugar | undefined {
  if (!valor || typeof valor !== 'object') return undefined;
  const l = valor as Record<string, unknown>;
  const textos = ['placeId', 'calle', 'numero', 'localidad', 'provincia', 'codigoPostal'];
  if (!textos.every((campo) => esTexto(l[campo]))) return undefined;
  if (!esNumero(l.latitud) || !esNumero(l.longitud)) return undefined;
  return l as Lugar;
}

/** Lee el comercio guardado. Si no hay, o le falta el nombre o la dirección, no hay comercio. */
export function comercioGuardado(valor: unknown): Comercio | undefined {
  if (!valor || typeof valor !== 'object') return undefined;
  const c = valor as Record<string, unknown>;
  if (!esTexto(c.nombreComercio) || !esTexto(c.direccion)) return undefined;
  if (!c.nombreComercio.trim() || !c.direccion.trim()) return undefined;
  const lugar = lugarGuardado(c.lugar);
  return {
    nombreComercio: c.nombreComercio,
    direccion: c.direccion,
    ...(esTexto(c.piso) && c.piso ? { piso: c.piso } : {}),
    ...(esTexto(c.depto) && c.depto ? { depto: c.depto } : {}),
    ...(lugar ? { lugar } : {}),
  };
}
