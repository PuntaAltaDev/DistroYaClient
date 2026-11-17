import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Titular } from '@/components/ui/editorial';
import { Icon } from '@/components/ui/icon';
import { Marco } from '@/components/ui/marco';
import { fechaCorta } from '@/features/proveedores/proveedor';
import { useAppTheme } from '@/theme';

import type { AvisoCliente } from './avisos';

type BandejaScreenProps = {
  /** Del más nuevo al más viejo. */
  avisos: readonly AvisoCliente[];
  alVolver: () => void;
  /** Abre el perfil del proveedor que mandó el aviso. */
  alAbrir: (aviso: AvisoCliente) => void;
};

const ETIQUETA = { aviso: 'AVISO', 'lista-nueva': 'LISTA NUEVA' } as const;

/** Bandeja de avisos de proveedores: promociones y listas nuevas de favoritos. */
export function BandejaScreen({ avisos, alVolver, alAbrir }: BandejaScreenProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <Marco alVolver={alVolver}>
      <Titular lineas={['Tus']} acento="avisos." clave="avisos" />

      <Animated.View entering={FadeIn.delay(250).duration(400)}>
        {avisos.length === 0 ? (
          <AppText variant="subhead" color="textSecondary">
            Todavía no tenés avisos. Te llegan las promociones de los proveedores y las listas
            nuevas de tus favoritos.
          </AppText>
        ) : (
          <View style={[styles.lista, { borderTopColor: colors.border }]}>
            {avisos.map((aviso) => (
              <Pressable
                key={aviso.id}
                onPress={() => alAbrir(aviso)}
                accessibilityRole="button"
                accessibilityLabel={`${aviso.proveedorNombre}: ${aviso.titulo}. ${aviso.texto}`}
                style={({ pressed }) => [
                  styles.fila,
                  {
                    gap: spacing.md,
                    paddingVertical: spacing.md,
                    borderBottomColor: colors.border,
                    backgroundColor: pressed ? colors.primarySoft : 'transparent',
                  },
                ]}>
                <View style={[styles.textos, { gap: spacing.xxs }]}>
                  <AppText variant="overline" color="primaryText" numberOfLines={1}>
                    {ETIQUETA[aviso.tipo]} · {aviso.proveedorNombre.toUpperCase()}
                  </AppText>
                  <AppText variant="headline">{aviso.titulo}</AppText>
                  <AppText variant="subhead" color="textSecondary">
                    {aviso.texto}
                  </AppText>
                  <AppText variant="footnote" color="textMuted">
                    {fechaCorta(new Date(aviso.fecha))}
                  </AppText>
                </View>
                <Icon name="forward" size={18} color="textSecondary" />
              </Pressable>
            ))}
          </View>
        )}
      </Animated.View>
    </Marco>
  );
}

const styles = StyleSheet.create({
  lista: { borderTopWidth: StyleSheet.hairlineWidth },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textos: { flex: 1 },
});
