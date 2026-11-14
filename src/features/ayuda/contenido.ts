/**
 * Ayuda: contacto y preguntas frecuentes.
 * DATOS DE PRUEBA: el número y el email son de mentira hasta que el negocio defina los reales.
 * Con la API, pueden venir del servidor para cambiarlos sin publicar otra versión.
 */
export const CONTACTO = {
  /** Número de WhatsApp en formato internacional, sin "+" ni espacios. */
  whatsapp: '5490000000000',
  email: 'soporte@distroya.example',
};

/** Mensaje con el que se abre el chat o el email. */
export const MENSAJE_INICIAL = 'Hola, tengo una consulta sobre DistroYa Clientes.';

export const PREGUNTAS: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: '¿Cuánto cuesta usar DistroYa?',
    respuesta: 'Nada. Buscar proveedores, ver sus listas y escribirles es gratis.',
  },
  {
    pregunta: '¿Cómo encuentro un proveedor?',
    respuesta: 'Escribí el nombre, un rubro o tu localidad, o tocá los rubros que te interesan.',
  },
  {
    pregunta: '¿Los precios están al día?',
    respuesta:
      'Cada proveedor sube su lista. En su ficha ves la fecha de la última. Ante la duda, escribile.',
  },
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta:
      'Directo con el proveedor, por WhatsApp o por teléfono. DistroYa no interviene en la venta.',
  },
  {
    pregunta: '¿Por qué ya no veo a un proveedor?',
    respuesta: 'Solo aparecen los proveedores con su plan al día.',
  },
  {
    pregunta: '¿Cómo elimino mi cuenta?',
    respuesta: 'En Ajustes, "Eliminar cuenta". Se borra todo y no se puede deshacer.',
  },
];
