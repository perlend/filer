import { Stack } from "expo-router";
import { farger } from "@/theme";

export default function LeksjonerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: farger.kort },
        headerTintColor: farger.tekst,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Leksjoner" }} />
      <Stack.Screen name="[id]" options={{ title: "Leksjon" }} />
    </Stack>
  );
}
