import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/theme';

import { iniciales } from './proveedor';

/**
 * Lugar del logo del proveedor. DATOS DE PRUEBA: hasta que la API mande la URL del logo
 * (Blob Storage), se muestran las iniciales del nombre.
 */
export function LogoIniciales({ razonSocial, grande }: { razonSocial: string; grande?: boolean }) {
  const { colors, radius, sizes } = useAppTheme();
  const lado = grande ? sizes.avatar : sizes.avatar * 0.75;

  return (
    <View
      accessible={false}
      style={[
        styles.caja,
        {
          width: lado,
          height: lado,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}>
      <AppText variant={grande ? 'title2' : 'headline'} color="primaryText">
        {iniciales(razonSocial)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
