# DistroYaClient
- UC10: Registro / Login con Email Personal 
- UC11: Buscador Avanzado de Proveedores por Tags / Nombre
- UC12: Visualizar Contacto y Abrir Catálogo PDF del Proveedor
- UC13: Recibir Push con Novedades y Ofertas 

# Caso de Usos
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
