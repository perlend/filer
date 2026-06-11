import { Tabs } from "expo-router";
import { Text } from "react-native";
import { farger } from "@/theme";

function fane(ikon: string) {
  return ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{ikon}</Text>
  );
}

export default function RotLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: farger.kort },
        headerTitleStyle: { color: farger.tekst },
        tabBarActiveTintColor: farger.primarMork,
        tabBarInactiveTintColor: farger.tekstSvak,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Hjem", tabBarIcon: fane("🏠") }}
      />
      <Tabs.Screen
        name="ovelse"
        options={{ title: "Øvelse", headerShown: false, tabBarIcon: fane("🎯") }}
      />
      <Tabs.Screen
        name="leksjoner"
        options={{ title: "Leksjoner", headerShown: false, tabBarIcon: fane("📖") }}
      />
      <Tabs.Screen
        name="kalkulatorer"
        options={{ title: "Verktøy", headerShown: false, tabBarIcon: fane("🧰") }}
      />
      <Tabs.Screen
        name="foto"
        options={{ title: "Foto", headerShown: false, tabBarIcon: fane("📷") }}
      />
    </Tabs>
  );
}
