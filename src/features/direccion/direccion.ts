/**
 * Piso y depto de una dirección: opcionales, sin validación.
 * Los nombres (`piso`, `depto`) hay que confirmarlos con Seba cuando esté la API.
 */
export type PisoDepto = { piso: string; depto: string };

export const PISO_DEPTO_INICIAL: PisoDepto = { piso: '', depto: '' };

/** Largo máximo de cada campo. */
export const LARGO_PISO_DEPTO = 10;

/** Corta lo escrito en el largo máximo. No se valida nada más: puede quedar vacío. */
export const limpiarPisoDepto = (texto: string) => texto.slice(0, LARGO_PISO_DEPTO);

/** Ya tiene piso o depto cargado: los campos se muestran abiertos de entrada. */
export const tienePisoDepto = ({ piso, depto }: PisoDepto) =>
  piso.trim() !== '' || depto.trim() !== '';
