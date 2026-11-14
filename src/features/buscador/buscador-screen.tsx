import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Titular } from '@/components/ui/editorial';
import { Icon } from '@/components/ui/icon';
import { LineField } from '@/components/ui/line-field';
import { Marco } from '@/components/ui/marco';
import { LogoIniciales } from '@/features/proveedores/logo-iniciales';
import type { Proveedor } from '@/features/proveedores/proveedor';
import { useAppTheme } from '@/theme';

import { alternarRubro, buscar } from './busqueda';

type BuscadorScreenProps = {
  proveedores: readonly Proveedor[];
  /** Rubros para filtrar. */
  rubros: readonly string[];
  alAbrir: (id: string) => void;
  alAjustes: () => void;
};

/** Inicio del cliente: buscar por texto, filtrar por rubros y ver los resultados. */
export function BuscadorScreen({ proveedores, rubros, alAbrir, alAjustes }: BuscadorScreenProps) {
  const { colors, spacing } = useAppTheme();
  const [texto, setTexto] = useState('');
  const [elegidos, setElegidos] = useState<string[]>([]);

  const resultados = buscar(proveedores, { texto, rubros: elegidos });
  const conFiltro = texto.trim() !== '' || elegidos.length > 0;

  return (
    <Marco alAjustes={alAjustes}>
      <Titular lineas={['Buscá tu']} acento="proveedor." clave="buscar" />

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ gap: spacing.lg }}>
        <LineField
          label="Buscar"
          placeholder="Nombre, rubro o localidad"
          value={texto}
          onChangeText={setTexto}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {/* Los rubros van en una sola fila que se desliza, de borde a borde. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ marginHorizontal: -spacing.xl }}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.sm }}>
          {rubros.map((rubro) => (
            <Chip
              key={rubro}
              label={rubro}
              selected={elegidos.includes(rubro)}
              onToggle={() => setElegidos((actual) => alternarRubro(actual, rubro))}
            />
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300).duration(400)} style={{ gap: spacing.sm }}>
        <View style={styles.encabezado}>
          <AppText variant="overline" color="textSecondary" accessibilityLiveRegion="polite">
            {resultados.length === 1 ? '1 PROVEEDOR' : `${resultados.length} PROVEEDORES`}
          </AppText>
          {conFiltro ? (
            <Pressable
              onPress={() => {
                setTexto('');
                setElegidos([]);
              }}
              hitSlop={8}
              accessibilityRole="button">
              <AppText variant="footnote" color="primaryText">
                Borrar filtros
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.lista, { borderTopColor: colors.border }]}>
          {resultados.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => alAbrir(p.id)}
              accessibilityRole="button"
              accessibilityLabel={`${p.razonSocial}, ${p.rubros.join(', ')}, ${p.localidad}`}
              style={({ pressed }) => [
                styles.fila,
                {
                  gap: spacing.md,
                  paddingVertical: spacing.md,
                  borderBottomColor: colors.border,
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
              <Icon name="forward" size={18} color="textSecondary" />
            </Pressable>
          ))}
        </View>

        {resultados.length === 0 ? (
          <AppText variant="subhead" color="textSecondary">
            No encontramos proveedores con esa búsqueda. Probá con otra palabra o menos rubros.
          </AppText>
        ) : null}
      </Animated.View>
    </Marco>
  );
}

const styles = StyleSheet.create({
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lista: { borderTopWidth: StyleSheet.hairlineWidth },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textos: { flex: 1 },
});
