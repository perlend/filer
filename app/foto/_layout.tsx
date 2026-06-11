import { Stack } from "expo-router";
import { farger } from "@/theme";

export default function FotoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: farger.kort },
        headerTintColor: farger.tekst,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Foto-hjelp" }} />
    </Stack>
  );
}
