import { Stack } from "expo-router";
import { farger } from "@/theme";

export default function OvelseLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: farger.kort },
        headerTintColor: farger.tekst,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Øvelse" }} />
      <Stack.Screen name="quiz" options={{ title: "Quiz" }} />
    </Stack>
  );
}
