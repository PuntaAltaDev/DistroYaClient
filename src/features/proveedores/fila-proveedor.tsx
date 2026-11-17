import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/theme';

import { BotonFavorito } from './boton-favorito';
import { LogoIniciales } from './logo-iniciales';
import type { Proveedor } from './proveedor';

type FilaProveedorProps = {
  proveedor: Proveedor;
  favorito: boolean;
  alAbrir: () => void;
  alFavorito: () => void;
};

/** Un proveedor en una lista (resultados, favoritos): logo, nombre, rubros, localidad y estrella. */
export function FilaProveedor({ proveedor: p, favorito, alAbrir, alFavorito }: FilaProveedorProps) {
  const { colors, spacing } = useAppTheme();

  // La estrella va al lado de la parte que abre la ficha, no adentro: en web un botón no puede
  // contener a otro.
  return (
    <View style={[styles.fila, { gap: spacing.md, borderBottomColor: colors.border }]}>
      <Pressable
        onPress={alAbrir}
        accessibilityRole="button"
        accessibilityLabel={`${p.razonSocial}, ${p.rubros.join(', ')}, ${p.localidad}`}
        style={({ pressed }) => [
          styles.abrir,
          {
            gap: spacing.md,
            paddingVertical: spacing.md,
            backgroundColor: pressed ? colors.primarySoft : 'transparent',
          },
        ]}>
        <LogoIniciales razonSocial={p.razonSocial} />
        <View style={[styles.textos, { gap: spacing.xxs }]}>
          <AppText variant="headline" numberOfLines={1}>
            {p.razonSocial}
          </AppText>
          <AppText variant="footnote" color="textSecondary" numberOfLines={1}>
            {p.rubros.join(' · ')}
          </AppText>
          <AppText variant="footnote" color="textMuted" numberOfLines={1}>
            {p.localidad}
          </AppText>
        </View>
      </Pressable>
      <BotonFavorito marcado={favorito} onPress={alFavorito} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  abrir: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  textos: { flex: 1 },
});
