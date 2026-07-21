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
      <Stack.Screen name="prove" options={{ title: "Prøvemodus" }} />
      <Stack.Screen name="statistikk" options={{ title: "Statistikk" }} />
      <Stack.Screen name="laereplan" options={{ title: "Læreplan" }} />
      <Stack.Screen name="case/index" options={{ title: "Fagprøve-case" }} />
      <Stack.Screen name="case/[id]" options={{ title: "Case" }} />
    </Stack>
  );
}
