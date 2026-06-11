import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API-nøkkelen lagres i enhetens sikre lager (Keychain/Keystore).
// SecureStore finnes ikke på web – der faller vi tilbake til AsyncStorage.
const NOKKEL = "laerling.anthropicApiKey";

export async function hentApiNokkel(): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(NOKKEL);
  }
  return SecureStore.getItemAsync(NOKKEL);
}

export async function lagreApiNokkel(verdi: string): Promise<void> {
  const trimmet = verdi.trim();
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(NOKKEL, trimmet);
    return;
  }
  await SecureStore.setItemAsync(NOKKEL, trimmet);
}

export async function slettApiNokkel(): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(NOKKEL);
    return;
  }
  await SecureStore.deleteItemAsync(NOKKEL);
}
