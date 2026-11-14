import { router } from 'expo-router';

import { AjustesScreen } from '@/features/ajustes/ajustes-screen';

/** "/ajustes": apariencia, cuenta, ayuda y legal. Solo con sesión. */
export default function Ajustes() {
  return <AjustesScreen alVolver={() => router.back()} />;
}
