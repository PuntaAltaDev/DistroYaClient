import { useEffect, useState } from 'react';

import { ordenarAvisos, sinLeer } from '@/features/avisos/avisos';

import { useCuenta } from './cuenta-provider';

/**
 * La bandeja, igual que en Proveedores: al abrirla, todo cuenta como leído, pero lo que era nuevo
 * sigue marcado (`nuevos`) mientras está abierta.
 */
export function useBandeja() {
  const { cuenta, actualizar } = useCuenta();
  const avisos = ordenarAvisos(cuenta.avisos);
  const [nuevos] = useState(() => sinLeer(cuenta.avisos, cuenta.leidos).map((a) => a.id));
  const ids = avisos.map((a) => a.id).join('|');
  const leidos = cuenta.leidos.join('|');

  // Marca todo como leído (también lo que llegue con la bandeja abierta). Solo escribe si cambió.
  useEffect(() => {
    if (leidos === ids) return;
    actualizar({ leidos: ids ? ids.split('|') : [] });
  }, [ids, leidos, actualizar]);

  return { avisos, nuevos };
}
