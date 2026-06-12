import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface Favorite {
  id: string;
  name: string;
  createdAt: string;
  wallColor: string;
  furniture: string;
  /** Lokal kopi av originalbildet. */
  originalUri: string;
  /** Lokal kopi av det genererte bildet. */
  resultUri: string;
}

const STORAGE_KEY = 'romviz.favorites';

async function readAll(): Promise<Favorite[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Favorite[];
  } catch {
    return [];
  }
}

async function writeAll(favorites: Favorite[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export async function listFavorites(): Promise<Favorite[]> {
  const all = await readAll();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Kopierer bildene inn i appens eget område så de overlever at cache tømmes. */
async function persistImage(uri: string, prefix: string): Promise<string> {
  if (Platform.OS === 'web') return uri; // web: behold data-/blob-URI som den er
  const ext = uri.endsWith('.png') ? 'png' : 'jpg';
  const target = `${FileSystem.documentDirectory}${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;
  if (uri === target) return uri;
  await FileSystem.copyAsync({ from: uri, to: target });
  return target;
}

export async function addFavorite(input: Omit<Favorite, 'id' | 'createdAt'>): Promise<Favorite> {
  const favorite: Favorite = {
    ...input,
    originalUri: await persistImage(input.originalUri, 'original'),
    resultUri: await persistImage(input.resultUri, 'resultat'),
    id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    createdAt: new Date().toISOString(),
  };
  const all = await readAll();
  all.push(favorite);
  await writeAll(all);
  return favorite;
}

export async function getFavorite(id: string): Promise<Favorite | undefined> {
  const all = await readAll();
  return all.find((f) => f.id === id);
}

export async function removeFavorite(id: string): Promise<void> {
  const all = await readAll();
  const favorite = all.find((f) => f.id === id);
  await writeAll(all.filter((f) => f.id !== id));
  if (favorite) {
    for (const uri of [favorite.originalUri, favorite.resultUri]) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
        // bildet kan allerede være borte
      }
    }
  }
}
