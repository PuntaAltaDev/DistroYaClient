import {
  Inter_200ExtraLight,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { RanuraDev } from '@/components/ui/ranura-dev';
import { CuentaProvider, useCuenta } from '@/features/cuenta/cuenta-provider';
import { cargarCuenta, type Cuenta } from '@/features/cuenta/cuenta';
import { HerramientasDev } from '@/features/dev/herramientas-dev';
import { ProveedoresProvider } from '@/features/proveedores/proveedores-provider';
import { cargarModo, guardarModo } from '@/lib/ajustes';
import { AppThemeProvider, useAppTheme, type ThemeMode } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** Lo que se lee del teléfono antes de mostrar la primera pantalla. */
type Guardado = { cuenta: Cuenta; modo: ThemeMode };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_200ExtraLight,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [guardado, setGuardado] = useState<Guardado | null>(null);

  // Se lee lo guardado (cuenta y modo) mientras se cargan las fuentes. Ninguna de las dos
  // lecturas falla: si no hay nada, vuelven los valores iniciales.
  useEffect(() => {
    Promise.all([cargarCuenta(), cargarModo()]).then(([cuenta, modo]) =>
      setGuardado({ cuenta, modo }),
    );
  }, []);

  const ready = (fontsLoaded || !!fontError) && guardado !== null;

  // La pantalla de inicio (splash) se oculta recién cuando todo está listo: así no se ve
  // un destello de la bienvenida antes de mostrar el buscador.
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AppThemeProvider initialMode={guardado.modo} onModeChange={guardarModo}>
      <CuentaProvider inicial={guardado.cuenta}>
        <ProveedoresProvider>
          <RanuraDev value={__DEV__ ? <HerramientasDev /> : null}>
            <ThemedNavigation />
          </RanuraDev>
        </ProveedoresProvider>
      </CuentaProvider>
    </AppThemeProvider>
  );
}

/**
 * Pasa los colores de DistroYa a la navegación y arma las rutas.
 *
 * Cada grupo de pantallas solo existe en su etapa (rutas protegidas): sin sesión, la bienvenida
 * y el acceso; con sesión, el buscador, la ficha del proveedor y los ajustes. Cuando cambia la
 * etapa (entrar, cerrar sesión, eliminar la cuenta), Expo Router saca las pantallas que ya no
 * corresponden y lleva a la de la etapa nueva (`redirectTo`). Ayuda y legales están siempre.
 */
function ThemedNavigation() {
  const { scheme, colors } = useAppTheme();
  const { cuenta } = useCuenta();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const destino = cuenta.iniciada ? '/buscar' : '/';

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.background,
          text: colors.text,
          border: colors.border,
        },
      }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Protected guard={!cuenta.iniciada} redirectTo={destino}>
          <Stack.Screen name="index" />
          <Stack.Screen name="entrada" />
        </Stack.Protected>
        <Stack.Protected guard={cuenta.iniciada} redirectTo={destino}>
          <Stack.Screen name="buscar" />
          <Stack.Screen name="proveedor/[id]" />
          <Stack.Screen name="ajustes" />
        </Stack.Protected>
        <Stack.Screen name="ayuda" />
        <Stack.Screen name="legal/[documento]" />
      </Stack>
    </ThemeProvider>
  );
}
