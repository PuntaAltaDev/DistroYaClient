import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Titular } from '@/components/ui/editorial';
import { Marco } from '@/components/ui/marco';
import { useAppTheme } from '@/theme';

import {
  borradorDe,
  comercioDe,
  validarComercio,
  type BorradorComercio,
  type Comercio,
} from './comercio';
import { FormularioComercio } from './formulario-comercio';

type ComercioScreenProps = {
  comercio?: Comercio;
  alVolver: () => void;
  /** Se llama con cada cambio que queda completo: se guarda solo, sin botón. */
  alGuardar: (comercio: Comercio) => void;
};

/**
 * Editar el comercio desde Ajustes. Se guarda solo mientras escribe, siempre que los datos estén
 * completos; si falta algo, se marca y queda guardado lo último que estaba bien.
 */
export function ComercioScreen({ comercio, alVolver, alGuardar }: ComercioScreenProps) {
  const { spacing } = useAppTheme();
  const [borrador, setBorrador] = useState(() => borradorDe(comercio));
  const [cambiado, setCambiado] = useState(false);
  const errores = cambiado ? validarComercio(borrador) : {};
  const completo = Object.keys(errores).length === 0;

  const cambiar = (cambios: Partial<BorradorComercio>) => {
    const siguiente = { ...borrador, ...cambios };
    setBorrador(siguiente);
    setCambiado(true);
    if (Object.keys(validarComercio(siguiente)).length === 0) alGuardar(comercioDe(siguiente));
  };

  return (
    <Marco alVolver={alVolver}>
      <View style={{ gap: spacing.md }}>
        <Titular lineas={['Tu']} acento="comercio." clave="comercio" />
        <Animated.View entering={FadeIn.delay(220).duration(400)}>
          <AppText variant="subhead" color="textSecondary">
            Así te ven tus proveedores. Se guarda solo.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ gap: spacing.lg }}>
        <FormularioComercio borrador={borrador} errores={errores} alCambiar={cambiar} />
        {cambiado ? (
          <AppText
            variant="footnote"
            color="textSecondary"
            accessibilityLiveRegion="polite"
            accessibilityRole="text">
            {completo ? 'Cambios guardados' : 'Sin guardar hasta completar lo marcado'}
          </AppText>
        ) : null}
      </Animated.View>
    </Marco>
  );
}
