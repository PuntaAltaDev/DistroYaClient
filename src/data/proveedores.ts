/**
 * Proveedores de ejemplo, como los va a mandar la API (fechas en texto ISO).
 * Son datos de prueba: cuando esté la API de Seba, la lista viene del buscador del servidor.
 * Algunos tienen el plan vencido o todavía sin empezar, para probar que no aparecen.
 */
export type ProveedorApi = {
  id: string;
  razonSocial: string;
  rubros: string[];
  direccion: string;
  localidad: string;
  provincia: string;
  /** Número de WhatsApp tal como lo cargó el proveedor. */
  whatsapp: string;
  telefono?: string;
  /** Link al PDF de la lista de precios vigente (Blob Storage). */
  listaUrl?: string;
  /** Cuándo subió la lista vigente (ISO). */
  listaFecha?: string;
  /** Plan del proveedor. Mismos nombres que en el backend (PlanName, StartDate, EndDate). */
  suscripcion?: { planName: string; startDate: string; endDate: string };
};

/** PDF público de ejemplo, igual para todos, hasta que estén las listas reales. */
const PDF_DE_PRUEBA = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const DIA = 24 * 60 * 60 * 1000;

/** La lista de prueba, con fechas armadas a partir de hoy. */
export function proveedoresDePrueba(ahora = new Date()): ProveedorApi[] {
  const dias = (n: number) => new Date(ahora.getTime() + n * DIA).toISOString();
  /** Plan que empezó hace `desde` días y vence dentro de `hasta` días (negativo: ya venció). */
  const plan = (desde: number, hasta: number, planName = 'Mensual') => ({
    planName,
    startDate: dias(-desde),
    endDate: dias(hasta),
  });

  return [
    {
      id: 'p1',
      razonSocial: 'Distribuidora del Sur',
      rubros: ['Cervezas', 'Gaseosas', 'Aguas'],
      direccion: 'Av. Colón 1250',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '0291 15 412-3456',
      telefono: '0291 452-1100',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-3),
      suscripcion: plan(10, 20),
    },
    {
      id: 'p2',
      razonSocial: 'Bodega Los Álamos',
      rubros: ['Vinos', 'Espumantes'],
      direccion: 'Ruta 3 km 690',
      localidad: 'Punta Alta',
      provincia: 'Buenos Aires',
      whatsapp: '+54 9 2932 55-1020',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-12),
      suscripcion: plan(300, 65, 'Anual'),
    },
    {
      id: 'p3',
      razonSocial: 'Hielo Polar',
      rubros: ['Hielo'],
      direccion: 'Brown 455',
      localidad: 'Punta Alta',
      provincia: 'Buenos Aires',
      whatsapp: '2932 40-7788',
      telefono: '2932 42-0011',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-1),
      suscripcion: plan(25, 5),
    },
    {
      id: 'p4',
      razonSocial: 'Destilería Ñandú',
      rubros: ['Destilados', 'Aperitivos'],
      direccion: 'Sarmiento 88',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '5492914998877',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-30),
      suscripcion: plan(80, 100, 'Trimestral'),
    },
    {
      id: 'p5',
      razonSocial: 'Bebidas Sauce Grande',
      rubros: ['Gaseosas', 'Jugos', 'Energizantes', 'Sin alcohol'],
      direccion: 'Mitre 2100',
      localidad: 'Monte Hermoso',
      provincia: 'Buenos Aires',
      whatsapp: '02921 15 66-3344',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-6),
      suscripcion: plan(5, 25),
    },
    {
      id: 'p6',
      razonSocial: 'Barra Insumos',
      rubros: ['Insumos de barra', 'Hielo', 'Aperitivos'],
      direccion: 'Estomba 340',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '291 15 500-1122',
      telefono: '291 455-6677',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-2),
      suscripcion: plan(15, 15),
    },
    {
      id: 'p7',
      razonSocial: 'Cervecería Faro Rojo',
      rubros: ['Cervezas'],
      direccion: 'Irigoyen 77',
      localidad: 'Punta Alta',
      provincia: 'Buenos Aires',
      whatsapp: '2932 15 61-2233',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-9),
      suscripcion: plan(40, 50, 'Trimestral'),
    },
    {
      id: 'p8',
      razonSocial: 'Aguas del Atlántico',
      rubros: ['Aguas', 'Sin alcohol'],
      direccion: 'Belgrano 900',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '291 15 433-0099',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-40),
      // Vencido: no aparece en el buscador.
      suscripcion: plan(35, -5),
    },
    {
      id: 'p9',
      razonSocial: 'Vinoteca Patagonia',
      rubros: ['Vinos', 'Destilados'],
      direccion: 'Alsina 15',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '291 15 422-7766',
      // Sin plan todavía: no aparece en el buscador.
    },
    {
      id: 'p10',
      razonSocial: 'Gaseosas Bahía',
      rubros: ['Gaseosas', 'Aguas'],
      direccion: 'Don Bosco 1500',
      localidad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      whatsapp: '291 15 488-5511',
      listaUrl: PDF_DE_PRUEBA,
      listaFecha: dias(-4),
      // El plan empieza mañana: todavía no aparece.
      suscripcion: plan(-1, 29),
    },
  ];
}
