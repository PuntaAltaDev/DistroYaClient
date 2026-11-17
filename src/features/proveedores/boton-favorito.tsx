import { Pressable } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { haptics } from '@/lib/haptics';

type BotonFavoritoProps = {
  marcado: boolean;
  onPress: () => void;
  size?: number;
};

/** Corazón para marcar o desmarcar un proveedor como favorito. */
export function BotonFavorito({ marcado, onPress, size = 22 }: BotonFavoritoProps) {
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
      <Icon
        name={marcado ? 'favoritoMarcado' : 'favorito'}
        size={size}
        color={marcado ? 'primary' : 'textSecondary'}
      />
    </Pressable>
  );
}
