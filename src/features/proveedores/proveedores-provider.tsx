import { createContext, useContext, useState, type ReactNode } from 'react';

import { proveedoresDePrueba } from '@/data/proveedores';

import { desdeApi, planVigente, type Proveedor } from './proveedor';

type ProveedoresValor = {
  proveedores: Proveedor[];
  /** Solo pruebas: vence el plan del proveedor (ayer). */
  vencerPlan: (id: string) => void;
  /** Solo pruebas: vuelve a la lista original. */
  restaurar: () => void;
};

const ProveedoresContext = createContext<ProveedoresValor | null>(null);

const cargar = () => proveedoresDePrueba().map(desdeApi);

/**
 * Lista de proveedores. DATOS DE PRUEBA: hoy sale de `data/proveedores.ts` y vive en memoria.
 * Con la API, el buscador le pide los resultados al servidor (que ya filtra los planes vigentes).
 */
export function ProveedoresProvider({ children }: { children: ReactNode }) {
  const [proveedores, setProveedores] = useState(cargar);

  const vencerPlan = (id: string) =>
    setProveedores((lista) =>
      lista.map((p) =>
        p.id === id && p.suscripcion
          ? {
              ...p,
              suscripcion: { ...p.suscripcion, endDate: new Date(Date.now() - 24 * 3600 * 1000) },
            }
          : p,
      ),
    );

  return (
    <ProveedoresContext.Provider
      value={{ proveedores, vencerPlan, restaurar: () => setProveedores(cargar()) }}>
      {children}
    </ProveedoresContext.Provider>
  );
}

/** Acceso a los proveedores desde cualquier pantalla. */
export function useProveedores() {
  const valor = useContext(ProveedoresContext);
  if (!valor) throw new Error('useProveedores tiene que usarse dentro de <ProveedoresProvider>');
  return valor;
}

/** Un proveedor visible (plan vigente) por su id, o nada. */
export function useProveedor(id: string | undefined) {
  const { proveedores } = useProveedores();
  return proveedores.find((p) => p.id === id && planVigente(p));
}
