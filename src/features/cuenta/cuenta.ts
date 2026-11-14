import { borrar, guardar, leer } from '@/lib/almacen';

/** Cómo entró: con un código al email o con su cuenta de Google. */
export type MetodoAcceso = 'email' | 'google';

/**
 * La cuenta del cliente. El cliente no tiene registro ni aprobación: entra y busca.
 * Todavía no hay servidor: se guarda en el teléfono. Con el login de Seba (Entra External ID,
 * rol Cliente), la sesión la confirma la API.
 */
export type Cuenta = {
  /** Ya confirmó su acceso (email o Google). */
  iniciada: boolean;
  metodo?: MetodoAcceso;
  /** Email con el que entró. Con Google todavía no se conoce: lo va a dar la API. */
  email?: string;
  /** Qué versión de los términos y la privacidad aceptó, y cuándo (ISO). Ver `features/legal`. */
  terminos?: { version: string; fecha: string };
};

export const CUENTA_INICIAL: Cuenta = { iniciada: false };

/** La "v1" permite cambiar la forma de los datos más adelante sin romper lo ya guardado. */
const CLAVE = 'cuenta.v1';

/** Lee la cuenta guardada. Si no hay nada, o está dañada, empieza de cero. */
export async function cargarCuenta(): Promise<Cuenta> {
  const guardada = await leer<Partial<Cuenta>>(CLAVE);
  if (typeof guardada?.iniciada !== 'boolean') return CUENTA_INICIAL;

  return {
    iniciada: guardada.iniciada,
    metodo:
      guardada.metodo === 'email' || guardada.metodo === 'google' ? guardada.metodo : undefined,
    email: typeof guardada.email === 'string' ? guardada.email : undefined,
    terminos:
      typeof guardada.terminos?.version === 'string' && typeof guardada.terminos.fecha === 'string'
        ? guardada.terminos
        : undefined,
  };
}

export const guardarCuenta = (cuenta: Cuenta) => guardar(CLAVE, cuenta);

export const borrarCuenta = () => borrar(CLAVE);
