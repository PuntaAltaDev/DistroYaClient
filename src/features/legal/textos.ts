/**
 * Términos y condiciones y política de privacidad.
 *
 * BORRADOR: estos textos los tiene que revisar un abogado antes de publicar la app.
 * Cuando cambien, se sube `VERSION_LEGAL`: la cuenta guarda qué versión aceptó cada cliente.
 * Con la API, los textos y la versión vigente pueden venir del servidor.
 */

/** Fecha de la versión vigente, en formato ISO (año-mes-día). */
export const VERSION_LEGAL = '2026-11-14';

export type DocumentoLegal = 'terminos' | 'privacidad';

type Seccion = { titulo: string; texto: string };

export type TextoLegal = {
  lineas: string[];
  acento: string;
  secciones: Seccion[];
};

export const TEXTOS_LEGALES: Record<DocumentoLegal, TextoLegal> = {
  terminos: {
    lineas: ['Términos y'],
    acento: 'condiciones.',
    secciones: [
      {
        titulo: 'Qué es DistroYa',
        texto:
          'DistroYa conecta comercios gastronómicos con proveedores y distribuidores. Te mostramos sus perfiles y sus listas de precios para que los contactes directo. No intervenimos en las ventas, los precios ni las entregas.',
      },
      {
        titulo: 'Tu cuenta',
        texto:
          'Entrás con tu email o tu cuenta de Google. Sos responsable de lo que se haga desde tu cuenta.',
      },
      {
        titulo: 'Lo que publican los proveedores',
        texto:
          'Cada proveedor es responsable de sus datos y su lista de precios. Antes de comprar, confirmá precios y condiciones con él.',
      },
      {
        titulo: 'Uso de la app',
        texto:
          'La app es para encontrar y contactar proveedores. No se puede usar para enviar mensajes masivos, molestar a los proveedores ni copiar sus listas para otros fines.',
      },
      {
        titulo: 'Baja de la cuenta',
        texto:
          'Podés eliminar tu cuenta cuando quieras desde Ajustes. También podemos darla de baja si no se cumplen estos términos.',
      },
      {
        titulo: 'Cambios',
        texto:
          'Si cambiamos estos términos, te lo avisamos en la app antes de que entren en vigencia.',
      },
    ],
  },
  privacidad: {
    lineas: ['Política de'],
    acento: 'privacidad.',
    secciones: [
      {
        titulo: 'Qué datos guardamos',
        texto: 'Tu email de acceso y, si los activás, el permiso para mandarte avisos.',
      },
      {
        titulo: 'Para qué los usamos',
        texto:
          'Para que entres a la app, avisarte novedades y ofertas de los proveedores, y mejorar la app. No vendemos tus datos.',
      },
      {
        titulo: 'Qué ven los proveedores',
        texto:
          'Nada de tu cuenta. Si les escribís o los llamás, ven tu número o tu email, como en cualquier mensaje.',
      },
      {
        titulo: 'Con quién los compartimos',
        texto:
          'Con los servicios que usamos para que la app funcione (alojamiento y envío de avisos), solo para eso.',
      },
      {
        titulo: 'Tus derechos',
        texto:
          'Podés ver, corregir o borrar tus datos cuando quieras, desde la app o escribiéndonos. Ley 25.326 de Protección de los Datos Personales. La autoridad de control es la Agencia de Acceso a la Información Pública.',
      },
    ],
  },
};
