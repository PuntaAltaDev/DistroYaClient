import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Titular } from '@/components/ui/editorial';
import { Marco } from '@/components/ui/marco';
import { FilaProveedor } from '@/features/proveedores/fila-proveedor';
import type { Proveedor } from '@/features/proveedores/proveedor';
import { useAppTheme } from '@/theme';

type FavoritosScreenProps = {
  /** Favoritos con plan vigente, en el orden en que se muestran. */
  proveedores: readonly Proveedor[];
  /** Cuántos favoritos hoy no se ven (plan vencido). */
  ocultos: number;
  alVolver: () => void;
  alAbrir: (id: string) => void;
  alQuitar: (id: string) => void;
};

/** "Mis favoritos": los proveedores marcados con la estrella. */
export function FavoritosScreen({
  proveedores,
  ocultos,
  alVolver,
  alAbrir,
  alQuitar,
}: FavoritosScreenProps) {
  const { colors, spacing } = useAppTheme();

  return (
    <Marco alVolver={alVolver}>
      <Titular lineas={['Mis']} acento="favoritos." clave="favoritos" />

      <Animated.View entering={FadeIn.delay(250).duration(400)} style={{ gap: spacing.md }}>
        {proveedores.length === 0 ? (
          <AppText variant="subhead" color="textSecondary">
            Todavía no marcaste ninguno. Tocá la estrella de un proveedor para tenerlo acá y recibir
            sus listas nuevas.
          </AppText>
        ) : (
          <View style={[styles.lista, { borderTopColor: colors.border }]}>
            {proveedores.map((p) => (
              <FilaProveedor
                key={p.id}
                proveedor={p}
                favorito
                alAbrir={() => alAbrir(p.id)}
                alFavorito={() => alQuitar(p.id)}
              />
            ))}
          </View>
        )}
        {ocultos > 0 ? (
          <AppText variant="footnote" color="textMuted">
            {ocultos === 1
              ? '1 favorito no aparece porque su plan no está vigente.'
              : `${ocultos} favoritos no aparecen porque su plan no está vigente.`}
          </AppText>
        ) : null}
      </Animated.View>
    </Marco>
  );
}

const styles = StyleSheet.create({
  lista: { borderTopWidth: StyleSheet.hairlineWidth },
});
