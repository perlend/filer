import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Romviz' }} />
        <Stack.Screen name="ny" options={{ title: 'Nytt forslag' }} />
        <Stack.Screen name="resultat" options={{ title: 'Resultat' }} />
        <Stack.Screen name="favoritt/[id]" options={{ title: 'Favoritt' }} />
        <Stack.Screen name="innstillinger" options={{ title: 'Innstillinger' }} />
      </Stack>
    </>
  );
}
