import { Stack } from "expo-router";
import { farger } from "@/theme";

export default function KalkulatorLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: farger.kort },
        headerTintColor: farger.tekst,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Kalkulatorer" }} />
      <Stack.Screen name="ohm" options={{ title: "Ohms lov og effekt" }} />
      <Stack.Screen name="spenningsfall" options={{ title: "Spenningsfall" }} />
      <Stack.Screen name="kabel" options={{ title: "Kabeltverrsnitt" }} />
    </Stack>
  );
}
