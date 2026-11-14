import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Marco } from '@/components/ui/marco';
import { LogoIniciales } from '@/features/proveedores/logo-iniciales';
import { fechaCorta, type Proveedor } from '@/features/proveedores/proveedor';
import { useAppTheme } from '@/theme';

type FichaScreenProps = {
  proveedor: Proveedor;
  alVolver: () => void;
  /** Abre el PDF de la lista de precios. */
  alVerLista: () => void;
  alWhatsapp: () => void;
  alLlamar: () => void;
};

/** Ficha del proveedor: quién es, sus rubros, cómo contactarlo y su lista de precios. */
export function FichaScreen({
  proveedor: p,
  alVolver,
  alVerLista,
  alWhatsapp,
  alLlamar,
}: FichaScreenProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Marco
      alVolver={alVolver}
      accion={p.listaUrl ? { label: 'Ver lista de precios', onPress: alVerLista } : undefined}>
      <Animated.View entering={FadeIn.duration(350)} style={{ gap: spacing.lg }}>
        <LogoIniciales razonSocial={p.razonSocial} grande />
        <View style={{ gap: spacing.xs }}>
          <AppText variant="title" accessibilityRole="header">
            {p.razonSocial}
          </AppText>
          <AppText variant="subhead" color="textSecondary">
            {p.direccion}, {p.localidad}, {p.provincia}
          </AppText>
        </View>
        <View style={[styles.rubros, { gap: spacing.xs }]}>
          {p.rubros.map((rubro) => (
            <View
              key={rubro}
              style={{
                borderRadius: radius.pill,
                backgroundColor: colors.surfaceAlt,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
              }}>
              <AppText variant="caption" color="primaryText">
                {rubro}
              </AppText>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ gap: spacing.sm }}>
        <AppText variant="overline" color="textSecondary">
          CONTACTO
        </AppText>
        <View style={[styles.grupo, { borderTopColor: colors.border }]}>
          <Canal icono="chat" titulo="WhatsApp" detalle={p.whatsapp} onPress={alWhatsapp} />
          {p.telefono ? (
            <Canal icono="phone" titulo="Llamar" detalle={p.telefono} onPress={alLlamar} />
          ) : null}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(280).duration(400)} style={{ gap: spacing.sm }}>
        <AppText variant="overline" color="textSecondary">
          LISTA DE PRECIOS
        </AppText>
        <AppText variant="subhead" color="textSecondary">
          {p.listaUrl
            ? p.listaFecha
              ? `Actualizada el ${fechaCorta(p.listaFecha)}.`
              : 'Disponible.'
            : 'Todavía no subió su lista. Escribile para pedirla.'}
        </AppText>
      </Animated.View>
    </Marco>
  );
}

type CanalProps = { icono: IconName; titulo: string; detalle: string; onPress: () => void };

/** Fila de contacto: ícono, canal y dato; toda la fila abre la otra app. */
function Canal({ icono, titulo, detalle, onPress }: CanalProps) {
  const { colors, spacing } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${titulo}: ${detalle}`}
      style={({ pressed }) => [
        styles.fila,
        {
          gap: spacing.md,
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
          backgroundColor: pressed ? colors.primarySoft : 'transparent',
        },
      ]}>
      <Icon name={icono} size={20} color="primaryText" />
      <View style={[styles.textos, { gap: spacing.xxs }]}>
        <AppText variant="headline">{titulo}</AppText>
        <AppText variant="footnote" color="textSecondary">
          {detalle}
        </AppText>
      </View>
      <Icon name="forward" size={18} color="primaryText" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rubros: { flexDirection: 'row', flexWrap: 'wrap' },
  grupo: { borderTopWidth: StyleSheet.hairlineWidth },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textos: { flex: 1 },
});
