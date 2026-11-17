import { useRef, type ComponentRef } from 'react';
import { type TextInput, View } from 'react-native';

import { LineField } from '@/components/ui/line-field';
import { CampoDireccion } from '@/features/direccion/campo-direccion';
import { CampoPisoDepto } from '@/features/direccion/piso-depto';
import { useAppTheme } from '@/theme';

import { NOMBRE_MAX, type BorradorComercio, type ErroresComercio } from './comercio';

type FormularioComercioProps = {
  borrador: BorradorComercio;
  errores: ErroresComercio;
  alCambiar: (cambios: Partial<BorradorComercio>) => void;
  /** Foco en el nombre al abrir (en el registro, sí; al editar, no). */
  autoFocus?: boolean;
};

/**
 * Nombre del comercio, dirección con Google y piso o depto opcionales. Sin etiquetas: el ejemplo
 * dentro de cada campo alcanza, y todos llevan la misma letra.
 */
export function FormularioComercio({
  borrador,
  errores,
  alCambiar,
  autoFocus,
}: FormularioComercioProps) {
  const { spacing } = useAppTheme();
  const direccionRef = useRef<ComponentRef<typeof TextInput>>(null);

  return (
    <View style={{ gap: spacing.xl }}>
      <LineField
        label="Nombre del comercio"
        sinEtiqueta
        chico
        placeholder="Nombre del comercio"
        value={borrador.nombreComercio}
        onChangeText={(nombreComercio) => alCambiar({ nombreComercio })}
        error={errores.nombreComercio}
        maxLength={NOMBRE_MAX}
        autoFocus={autoFocus}
        autoCapitalize="words"
        autoComplete="organization"
        returnKeyType="next"
        onSubmitEditing={() => direccionRef.current?.focus()}
      />
      <View style={{ gap: spacing.md }}>
        <CampoDireccion
          inputRef={direccionRef}
          valor={borrador.direccion}
          lugar={borrador.lugar}
          error={errores.direccion}
          alCambiar={alCambiar}
        />
        <CampoPisoDepto
          valor={{ piso: borrador.piso, depto: borrador.depto }}
          alCambiar={alCambiar}
        />
      </View>
    </View>
  );
}
