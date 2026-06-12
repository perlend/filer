import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY_GEMINI = 'romviz.geminiApiKey';

// SecureStore finnes ikke på web; fall tilbake til localStorage der
// (kun til lokal utprøving – ikke legg nøkkelen i en delt nettleser).
async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getGeminiApiKey(): Promise<string | null> {
  return getItem(KEY_GEMINI);
}

export async function setGeminiApiKey(value: string): Promise<void> {
  if (value.trim() === '') {
    await deleteItem(KEY_GEMINI);
  } else {
    await setItem(KEY_GEMINI, value.trim());
  }
}
