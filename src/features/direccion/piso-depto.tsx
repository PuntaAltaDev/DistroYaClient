import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { LineField } from '@/components/ui/line-field';
import { useAppTheme } from '@/theme';

import { LARGO_PISO_DEPTO, limpiarPisoDepto, tienePisoDepto, type PisoDepto } from './direccion';

type CampoPisoDeptoProps = {
  valor: PisoDepto;
  alCambiar: (cambios: Partial<PisoDepto>) => void;
};

/**
 * Piso y depto opcionales, debajo del campo de dirección.
 * Cerrado, es solo el link "+ Agregar piso o depto"; al tocarlo aparecen los dos campos lado a
 * lado y el primero toma el foco. Si ya hay algo cargado, se muestran abiertos de entrada.
 */
export function CampoPisoDepto({ valor, alCambiar }: CampoPisoDeptoProps) {
  const { spacing } = useAppTheme();
  const [abierto, setAbierto] = useState(() => tienePisoDepto(valor));
  /** Se abrió con el link (no de entrada): el piso toma el foco. */
  const [abiertoAlTocar, setAbiertoAlTocar] = useState(false);

  if (!abierto) {
    return (
      <Pressable
        onPress={() => {
          setAbierto(true);
          setAbiertoAlTocar(true);
        }}
        hitSlop={8}
        accessibilityRole="button"
        style={styles.link}>
        <AppText variant="footnote" color="primaryText">
          + Agregar piso o depto
        </AppText>
      </Pressable>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={[styles.fila, { gap: spacing.lg }]}>
      <View style={styles.campo}>
        <LineField
          label="Piso"
          sinEtiqueta
          chico
          placeholder="Piso"
          value={valor.piso}
          onChangeText={(texto) => alCambiar({ piso: limpiarPisoDepto(texto) })}
          maxLength={LARGO_PISO_DEPTO}
          autoFocus={abiertoAlTocar}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
      <View style={styles.campo}>
        <LineField
          label="Depto"
          sinEtiqueta
          chico
          placeholder="Depto"
          value={valor.depto}
          onChangeText={(texto) => alCambiar({ depto: limpiarPisoDepto(texto) })}
          maxLength={LARGO_PISO_DEPTO}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  link: { alignSelf: 'flex-start' },
  fila: { flexDirection: 'row' },
  campo: { flex: 1 },
});
