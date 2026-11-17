import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Titular } from '@/components/ui/editorial';
import { Marco } from '@/components/ui/marco';
import { haptics } from '@/lib/haptics';
import { useAppTheme } from '@/theme';

import {
  borradorDe,
  comercioDe,
  validarComercio,
  type BorradorComercio,
  type Comercio,
  type ErroresComercio,
} from './comercio';
import { FormularioComercio } from './formulario-comercio';

type RegistroScreenProps = {
  /** Recibe el comercio ya revisado. Con la API, acá se envía a Seba. */
  alTerminar: (comercio: Comercio) => void;
};

/**
 * El registro del comercio, en una sola pantalla: nombre y dirección. Se hace una vez, después de
 * entrar, y va directo al buscador (no lleva aprobación).
 */
export function RegistroScreen({ alTerminar }: RegistroScreenProps) {
  const { spacing } = useAppTheme();
  const [borrador, setBorrador] = useState(borradorDe);
  const [errores, setErrores] = useState<ErroresComercio>({});

  const cambiar = (cambios: Partial<BorradorComercio>) => {
    setBorrador((actual) => ({ ...actual, ...cambios }));
    // El error de un campo se va en cuanto se lo corrige.
    setErrores((actuales) => {
      const siguientes = { ...actuales };
      for (const campo of Object.keys(cambios)) {
        delete siguientes[campo === 'lugar' ? 'direccion' : (campo as keyof ErroresComercio)];
      }
      return siguientes;
    });
  };

  const terminar = () => {
    const encontrados = validarComercio(borrador);
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      haptics.error();
      return;
    }
    haptics.success();
    alTerminar(comercioDe(borrador));
  };

  return (
    <Marco accion={{ label: 'Empezar a buscar', onPress: terminar }}>
      <View style={{ gap: spacing.md }}>
        <Titular lineas={['Tu']} acento="comercio." clave="registro" />
        <Animated.View entering={FadeIn.delay(220).duration(400)}>
          <AppText variant="subhead" color="textSecondary">
            Así tus proveedores saben quién sos.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <FormularioComercio borrador={borrador} errores={errores} alCambiar={cambiar} autoFocus />
      </Animated.View>
    </Marco>
  );
}
