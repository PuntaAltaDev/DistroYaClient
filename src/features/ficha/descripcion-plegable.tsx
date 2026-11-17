import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { descripcionVisible } from '@/features/proveedores/proveedor';
import { useAppTheme } from '@/theme';

type DescripcionPlegableProps = {
  /** Lo que escribió el proveedor. Si no escribió nada, el bloque no aparece. */
  texto: string | undefined;
  titulo?: string;
};

/**
 * Descripción del proveedor, plegada: el cliente la ve solo si la despliega.
 * La flecha gira al abrir y cerrar (sin giro si el teléfono pide menos movimiento).
 */
export function DescripcionPlegable({
  texto,
  titulo = 'SOBRE ESTE PROVEEDOR',
}: DescripcionPlegableProps) {
  const { colors, spacing, motion } = useAppTheme();
  const reducir = useReducedMotion();
  const [abierta, setAbierta] = useState(false);
  const giro = useSharedValue(0);
  const visible = descripcionVisible(texto);

  useEffect(() => {
    giro.set(withTiming(abierta ? 1 : 0, { duration: reducir ? 0 : motion.duration.base }));
  }, [abierta, giro, reducir, motion.duration.base]);

  const flechaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${giro.get() * 180}deg` }],
  }));

  if (!visible) return null;

  return (
    <View
      style={[styles.bloque, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      <Pressable
        onPress={() => setAbierta((actual) => !actual)}
        accessibilityRole="button"
        accessibilityState={{ expanded: abierta }}
        accessibilityLabel="Sobre este proveedor"
        style={[styles.encabezado, { paddingVertical: spacing.md }]}>
        <AppText variant="overline" color="textSecondary">
          {titulo}
        </AppText>
        <Animated.View style={flechaStyle}>
          <Icon name="expand" size={20} color="textSecondary" />
        </Animated.View>
      </Pressable>
      {abierta ? (
        <Animated.View
          entering={reducir ? undefined : FadeIn.duration(motion.duration.base)}
          style={{ paddingBottom: spacing.lg }}>
          <AppText variant="subhead" color="textSecondary">
            {visible}
          </AppText>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloque: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
