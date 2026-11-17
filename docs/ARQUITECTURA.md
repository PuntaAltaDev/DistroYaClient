# Arquitectura

Cómo está organizado el código de DistroYa Clientes y las reglas que se siguen. Si algo de acá deja de ser verdad, se corrige en el mismo pull request que lo cambia.

La base (tema, componentes, almacén, acceso, herramientas de prueba y reglas) es la misma que la de DistroYa Proveedores. Si se mejora algo compartido en una app, conviene llevarlo a la otra.

## Stack

| Qué         | Con qué                                                         |
| ----------- | --------------------------------------------------------------- |
| Base        | Expo SDK 58, React Native 0.88, React 19, TypeScript estricto   |
| Navegación  | Expo Router (las rutas son archivos dentro de `src/app`)        |
| Animaciones | Reanimated 4 y Gesture Handler 3                                |
| Fuente      | Inter (200, 400, 500, 600 y 700)                                |
| Direcciones | Google Places API (New), llamada directa con `fetch`            |
| Links       | `Linking` de React Native (WhatsApp, teléfono, email)           |
| PDF         | expo-web-browser (el navegador del teléfono muestra el PDF)     |
| Guardado    | expo-sqlite (kv-store) en el teléfono; `localStorage` en la web |
| Avisos      | expo-notifications (locales; los push llegan con el backend)    |
| Pruebas     | Jest 30 con jest-expo                                           |

## Carpetas

```
src/
  app/            Rutas. Cada archivo es una pantalla: arma la de features/, le pasa los datos y le dice
                  adónde ir (router). _layout.tsx decide qué rutas existen según haya sesión o no.
    proveedor/    "/proveedor/[id]": ficha del proveedor.
    legal/        "/legal/terminos" y "/legal/privacidad".
  components/ui/  Piezas reutilizables sin lógica de negocio: texto, campo, chip, ícono, barra de acción,
                  barra superior y titular (editorial), marco de pantalla (marco) y el lugar de las
                  herramientas de prueba en la barra (ranura-dev).
  features/       Una carpeta por tema de negocio, con sus pantallas y su lógica.
    bienvenida/   Primera pantalla de la app: logo, nombre, frase y el botón "Empezar".
    acceso/       Registro o inicio de sesión (Google, o email y su código en la misma pantalla).
    cuenta/       Sesión, comercio, favoritos y bandeja de avisos del cliente, guardados en el teléfono.
    comercio/     Registro del comercio (nombre y dirección) y su edición desde Ajustes.
    direccion/    Campo de dirección con sugerencias de Google, y piso y depto opcionales.
    proveedores/  Qué es un proveedor, cuándo su plan está vigente, links de contacto y la lista.
    buscador/     Búsqueda por texto y rubros, y la pantalla de inicio con los resultados.
    ficha/        Ficha del proveedor: favorito, avisos, contacto y lista de precios.
    favoritos/    Marcar proveedores con la estrella y la pantalla "Mis favoritos".
    avisos/       Avisos de proveedores: reglas, bandeja y abrir la notificación tocada.
    ajustes/      Apariencia, tu comercio, cerrar sesión, eliminar cuenta, ayuda y legal.
    ayuda/        Contacto (WhatsApp y email) y preguntas frecuentes.
    legal/        Términos y condiciones, política de privacidad y su versión vigente.
    dev/          Herramientas de prueba (solo en desarrollo): volver al inicio y simular al servidor.
  data/           Datos de ejemplo (se reemplazan por la API).
  lib/            Servicios y ayudas sin pantalla (almacén, ajustes, vibración, abrir links y PDF,
                  notificaciones del teléfono, direcciones de Google, botón "atrás" de Android).
  theme/          Colores, tipografía, espacios y animaciones.
```

Regla de dependencias: `app` usa `features`; `features` usa `components`, `lib`, `data` y `theme`; `components` usa solo `lib` y `theme`. Nada de `components` importa de `features`. Entre carpetas de `features`, en un solo sentido: `buscador`, `ficha`, `favoritos` y `dev` usan `proveedores`; `avisos` usa `favoritos` y `proveedores`; `comercio` usa `direccion`; `ajustes` usa `comercio`; `cuenta` usa `comercio`, `favoritos` y `avisos` (los guarda); `dev` usa todas. `proveedores` no usa ninguna.

## Reglas del código

1. **Ninguna pantalla escribe un color o un tamaño a mano.** Todo sale de `theme/tokens.ts` a través de `useAppTheme()`.
2. **Los textos que ve el usuario están en español rioplatense** (voseo: "Buscá", "Tocá").
3. **Los nombres del código están en español** cuando nombran algo del negocio (`proveedor`, `rubro`, `suscripcion`) y en inglés cuando son términos técnicos (`token`, `props`). Los campos del plan siguen los del backend (`planName`, `startDate`, `endDate`).
4. **Una pantalla, un archivo.** Si crece, se parte en piezas dentro de su carpeta de `features/`.
5. **Las rutas reciben los datos y le pasan a la pantalla las funciones de `router`** (y de abrir links). Las pantallas no navegan solas.
6. **Todo lo que depende de la API va aislado** (ver la tabla de abajo), para reemplazarlo sin tocar las pantallas.
7. **Las librerías de Expo se instalan con `npx expo install`** y antes de usar una API se mira la documentación de la versión instalada (ver `AGENTS.md`).
8. **Los secretos no se suben.** Van en `.env.local` (ver `.env.example`). Hoy hay uno: la clave de Google Places (`EXPO_PUBLIC_GOOGLE_PLACES_KEY`), la misma que usa Proveedores. Sin clave, la dirección se escribe a mano.
9. **Alto de línea de Inter: nunca menos de 1,25 veces el tamaño.** Con menos, Android corta las colas de la "g" y la "p".
10. **Las reglas del negocio tienen pruebas automáticas** (búsqueda, plan vigente, links de WhatsApp y teléfono, lectura de lo guardado). Van en una carpeta `__tests__` al lado del código, en archivos `*-test.ts`, y corren con `npm test` (también dentro de `npm run check`). Si se cambia una regla, se cambia su prueba en el mismo commit.

## Diseño

- Claro sobre blanco y oscuro sobre `#041F21`; turquesa `#18A4A3` de acento. La paleta y los contrastes están en `theme/tokens.ts`.
- Inter 600 para titulares, Inter 200 solo en tamaños grandes, números de ancho fijo (`tabular-nums`) y textos de al menos 13 px.
- Barra de arriba: la marca a la izquierda y los íconos pegados a la derecha (herramientas de prueba, modo claro/oscuro y ajustes). Sin títulos de sección.
- Barra de abajo negra (ActionBar): en la ficha, "Ver lista de precios".
- Prioridad cuando hay duda: **la eficiencia y la legibilidad ganan sobre lo estético.**
- El círculo a medio llenar de la barra superior cambia entre claro y oscuro. Es solo para revisar el diseño.

## Datos de prueba que se reemplazan con la API

| Qué                            | Dónde                                                                        | Se reemplaza por                                       |
| ------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| Proveedores y sus planes       | `src/data/proveedores.ts`                                                    | Buscador de la API (ya filtra los planes vigentes)     |
| Lista de proveedores en uso    | `features/proveedores/proveedores-provider.tsx` (memoria)                    | Resultados que devuelve la API                         |
| Búsqueda por texto y rubros    | `buscar` en `features/buscador/busqueda.ts`                                  | Búsqueda en el servidor                                |
| Rubros                         | `src/data/rubros.ts`                                                         | Tags de la API                                         |
| Logo del proveedor             | `features/proveedores/logo-iniciales.tsx` (iniciales)                        | Logo desde Blob Storage                                |
| PDF de la lista de precios     | `PDF_DE_PRUEBA` en `src/data/proveedores.ts`                                 | PDF del proveedor en Blob Storage                      |
| Login (email y código, Google) | `alEnviarCodigo`, `alConfirmar` y `alGoogle` en `features/acceso/acceso.tsx` | Entra External ID, rol Cliente                         |
| Comercio del cliente           | `comercio` en la cuenta (`features/comercio/`)                               | Perfil del cliente en la API                           |
| Direcciones                    | `src/lib/places.ts` (Google directo, con la clave en la app)                 | Búsqueda de direcciones a través del backend           |
| Sesión del cliente             | `features/cuenta/` (se guarda en el teléfono)                                | Sesión de la API                                       |
| Favoritos                      | `favoritos` en la cuenta (`features/cuenta/use-favoritos.ts`)                | Favoritos del cliente en la API                        |
| Bandeja de avisos              | `avisos` en la cuenta                                                        | Avisos de la API (y push)                              |
| Llegada de avisos y listas     | Simulador en `features/dev/simulaciones.ts` (notificación local)             | Push del servidor (Notification Hubs)                  |
| Eliminar cuenta                | `eliminarCuenta` en `features/ajustes/ajustes-screen.tsx`                    | Baja de la cuenta en la API, y después borrar lo local |
| Vencer el plan, restaurar      | Simulador en `features/dev/simulaciones.ts`                                  | Cambios reales en el servidor                          |
| Textos legales                 | `features/legal/textos.ts` (borrador)                                        | Textos revisados por un abogado                        |
| Contacto de soporte            | `CONTACTO` en `features/ayuda/contenido.ts`                                  | Número y email reales                                  |

## Deudas conocidas

Cosas que hoy no cumplen del todo las reglas de arriba:

- Las pantallas no tienen pruebas automáticas todavía (solo las reglas del negocio). Para recorrer el flujo en el teléfono, Expo recomienda pruebas de punta a punta con Maestro.
- Los resultados se muestran todos juntos, sin paginar. Con la API y muchos proveedores, conviene una lista virtualizada y pedir de a páginas.

## Decisiones

- **Identificador de la app: `com.puntaaltadev.distroya.cliente`** (iOS y Android). Una vez publicada en las tiendas no se puede cambiar.
- **El logo es el carrito** (`components/ui/logo.tsx`), el mismo de Proveedores. El ícono, el splash y el favicon salen de `scripts/generar-iconos.mjs` (`npm run iconos`).
- **La bienvenida se muestra una sola vez** (`iniciada` en la cuenta). Se entra con el email (código de 6 números) o con Google. **Ambos están simulados**: cualquier código sirve y Google entra sin pedir nada. Registrarse e iniciar sesión son la misma pantalla.
- **Registro simplificado del comercio, sin aprobación** (`/registro`): después de entrar, en una sola pantalla, el nombre del comercio (2 a 60 letras) y la dirección con el buscador de Google, igual que en Proveedores; de ahí salen la localidad, la provincia y las coordenadas. Debajo, "+ Agregar piso o depto". Sirve para que el proveedor sepa quiénes son sus clientes y los encuentre por nombre o localidad al mandar un aviso. Al terminar va directo al buscador. Se guarda como `comercio: { nombreComercio, direccion, piso?, depto?, lugar? }`; `lugar` tiene `placeId`, `calle`, `numero`, `localidad`, `provincia`, `codigoPostal`, `latitud` y `longitud`. Sin etiquetas: el ejemplo dentro del campo alcanza, y todos los campos llevan la misma letra (17). El logo del comercio queda para más adelante.
- **El comercio se edita desde Ajustes** ("Tu comercio" → `/comercio`) y se guarda solo, sin botón, cada vez que los datos quedan completos. Si falta algo, se marca y queda guardado lo último que estaba bien.
- **Términos y privacidad se aceptan al entrar** ("Al continuar aceptás…"). La cuenta guarda la versión aceptada (`VERSION_LEGAL`) y la fecha.
- **Navegación con rutas protegidas** (`Stack.Protected` en `app/_layout.tsx`): sin sesión, `/` y `/entrada`; con sesión y sin comercio, `/registro` (también las cuentas que ya existían, una vez); con comercio, `/buscar`, `/proveedor/[id]`, `/favoritos`, `/avisos`, `/ajustes` y `/comercio`. Ayuda y legales están siempre. Al entrar, cerrar sesión o eliminar la cuenta, el router lleva a la pantalla de la etapa nueva (`redirectTo`).
- **En el buscador solo aparecen proveedores con plan vigente**: el plan ya empezó y todavía no venció. Una ficha de un proveedor sin plan vigente vuelve al buscador.
- **La búsqueda no distingue acentos ni mayúsculas.** Cada palabra escrita tiene que aparecer en el nombre, un rubro o la localidad. Con varios rubros elegidos, alcanza con que el proveedor tenga uno.
- **WhatsApp se abre con `wa.me`** y un mensaje ya escrito. El número se pasa al formato internacional argentino (`549` + característica + número) aceptando cómo lo carga la gente (`0291 15 …`, `+54 9 …`). Conviene que la API ya lo guarde así.
- **El PDF se abre en el navegador dentro de la app** (`expo-web-browser`): el teléfono ya sabe mostrarlo y no hace falta un visor propio.
- **Las herramientas de prueba no viven en `components`:** la barra las recibe por contexto (`RanuraDev`), así se respeta la regla de dependencias. Solo existen con `__DEV__`.
- **Favoritos:** la estrella está en cada resultado, en "Mis favoritos" y en la ficha. Se guardan como `{ proveedorId, avisosActivos, desde }`, igual que en Proveedores. "Mis favoritos" muestra solo los de plan vigente, del último marcado al primero, y avisa cuántos no se ven.
- **Avisos de proveedores (UC13):** tienen la forma `{ id, proveedorId, proveedorNombre, tipo, titulo, texto, fecha }`, con `tipo` `aviso` (lo escribe el proveedor para sus favoritos o para todos sus clientes, sin límite) o `lista-nueva` (automático, solo a favoritos). En la ficha de un favorito, "Recibir sus avisos" (prendido de entrada) apaga los dos tipos sin sacarlo de favoritos. Al tocar un aviso, en la bandeja o en el teléfono (`data.url`), se abre el perfil del proveedor. En web no hay notificaciones.
- **Leídos y no leídos, igual que en Proveedores:** la cuenta guarda los ids leídos (`leidos`). Al abrir la bandeja, todo pasa a leído, pero lo que era nuevo sigue con un punto mientras está abierta. Afuera, el ícono de avisos lleva el número de nuevos (hasta "9+"), y nada si no hay.
- **El permiso de notificaciones se pide al marcar el primer favorito**, que es cuando empiezan a servir. Hoy los avisos se simulan con notificaciones locales (andan en Expo Go). Los push reales necesitan una development build, el plugin `expo-notifications` en `app.json` y Notification Hubs.
- **Sin pantallas de carga, error o sin conexión todavía** en lo que depende de la API: se hacen cuando exista el contrato de la API.
