# DistroYa Clientes

App móvil (iPhone, Android y web) para que los comercios gastronómicos (restaurantes, bares, almacenes) busquen proveedores por nombre o rubro, vean su lista de precios y los contacten directo. Es una de las cuatro piezas del proyecto:

| Repo                 | Qué es                              |
| -------------------- | ----------------------------------- |
| `DistroYaAdmin`      | Panel web del administrador (React) |
| **`DistroYaClient`** | **Esta app, para clientes (Expo)**  |
| `DistroYaProvider`   | App de los proveedores (Expo)       |
| `DistroYaApiBackend` | API en .NET (Seba)                  |

## Casos de uso

- UC10: Registro / Login con Email Personal
- UC11: Buscador Avanzado de Proveedores por Tags / Nombre
- UC12: Visualizar Contacto y Abrir Catálogo PDF del Proveedor
- UC13: Recibir Push con Novedades y Ofertas

```mermaid
flowchart TD
    %% Definición de Estilos
    classDef actor fill:#1e293b,stroke:#0f172a,color:#ffffff,font-weight:bold,rx:8,ry:8
    classDef cliUC fill:#faf5ff,stroke:#a855f7,color:#581c87,rx:6,ry:6

    subgraph Actores_Global ["ARQUITECTURA DE CASOS DE USO POR ACTOR"]
        direction LR
        %% ==========================================
        %% 3. CLIENTE FINAL
        subgraph Col_Cli ["📱 CLIENTE FINAL"]
            direction TB
            Cliente(["👤 Cliente Final"]):::actor

            UC10["<b>UC10</b><br/>Registro / Login con<br/>Email Personal"]:::cliUC
            UC11["<b>UC11</b><br/>Buscador Avanzado<br/>por Tags / Nombre"]:::cliUC
            UC12["<b>UC12</b><br/>Visualizar Contacto y<br/>Abrir Catálogo PDF"]:::cliUC
            UC13["<b>UC13</b><br/>Recibir Push con<br/>Novedades y Ofertas"]:::cliUC

            Cliente --> UC10
            Cliente --> UC11
            Cliente --> UC12
            UC13 -.->|Push| Cliente
        end
    end
```

## Cómo correrla

Hace falta Node.js (LTS) y, para probar en el celular, la app **Expo Go**.

```bash
npm install
npx expo start
```

Después se escanea el QR con Expo Go (el celular tiene que estar en la misma Wi‑Fi que la PC) o se abre la versión web con `w`. Si la app de Proveedores ya usa el puerto 8081, agregá `--port 8082`.

No hace falta ninguna clave por ahora.

## Scripts

| Comando              | Qué hace                                                         |
| -------------------- | ---------------------------------------------------------------- |
| `npm run check`      | Tipos + lint + formato + pruebas. Correrlo antes de cada commit. |
| `npm test`           | Corre las pruebas automáticas.                                   |
| `npm run test:watch` | Las vuelve a correr con cada cambio.                             |
| `npm run typecheck`  | Revisa los tipos de TypeScript.                                  |
| `npm run lint`       | Revisa el código con ESLint.                                     |
| `npm run format`     | Acomoda el formato con Prettier.                                 |
| `npm run iconos`     | Arma el ícono, el splash y el favicon a partir del logo.         |

## Estado actual

Hecho: bienvenida, acceso con email (código simulado) o Google (simulado) aceptando términos y privacidad, buscador por texto y rubros (solo proveedores con plan vigente), ficha del proveedor con WhatsApp, llamada y lista de precios en PDF, ajustes (apariencia, cerrar sesión, eliminar cuenta, ayuda y legal) y ayuda.

Falta, y depende de la API de Seba: login real, proveedores y rubros desde el servidor, logos, listas en PDF reales y avisos push (UC13). Hoy esas partes funcionan con datos de prueba; la lista completa está en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md#datos-de-prueba-que-se-reemplazan-con-la-api).

Para probar sin servidor, la barra de arriba tiene dos íconos que solo aparecen en desarrollo: la flecha circular borra todo y vuelve a la bienvenida, y la probeta simula lo que hace el servidor (vencer el plan de un proveedor para ver que sale del buscador, y restaurar la lista).

## Documentación

- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md): cómo está organizado el código y por qué.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): cómo trabajamos con ramas, commits y pull requests.
- [`AGENTS.md`](AGENTS.md): reglas para trabajar con Expo (cambia mucho entre versiones).

## Licencia

GPL-3.0 (ver `LICENSE`).
