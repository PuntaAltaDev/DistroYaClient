import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { haptics } from '@/lib/haptics';
import { useAppTheme } from '@/theme';

type BotonFavoritoProps = {
  marcado: boolean;
  onPress: () => void;
  size?: number;
};

/** La estrella de Material, en un cuadro de 24. */
const ESTRELLA =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

/**
 * Estrella para marcar o desmarcar un proveedor como favorito: vacía sin marcar, rellena al
 * marcarla. Es un dibujo propio porque los íconos del sistema no se rellenan en Android ni en web.
 */
export function BotonFavorito({ marcado, onPress, size = 22 }: BotonFavoritoProps) {
  const { colors } = useAppTheme();
  const color = marcado ? colors.primary : colors.textSecondary;
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress();
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityState={{ selected: marcado }}
      accessibilityLabel={marcado ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d={ESTRELLA}
          fill={marcado ? color : 'none'}
          stroke={color}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
