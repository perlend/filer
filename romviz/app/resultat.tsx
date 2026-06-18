import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { addFavorite } from '@/lib/favorites';
import { showMessage } from '@/lib/ui';
import { colors, spacing } from '@/theme';

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    resultUri: string;
    originalUri: string;
    wallColor: string;
    furniture: string;
    furnitureImageUris: string;
    provider: string;
  }>();

  let furnitureImageUris: string[] = [];
  try {
    furnitureImageUris = params.furnitureImageUris ? JSON.parse(params.furnitureImageUris) : [];
  } catch {
    furnitureImageUris = [];
  }
  const [name, setName] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayedUri = showOriginal ? params.originalUri : params.resultUri;

  async function onSave() {
    if (name.trim() === '') {
      showMessage('Mangler navn', 'Gi favoritten et navn, f.eks. «Stue – salvie + eik».');
      return;
    }
    setSaving(true);
    try {
      await addFavorite({
        name: name.trim(),
        wallColor: params.wallColor ?? '',
        furniture: params.furniture ?? '',
        originalUri: params.originalUri,
        resultUri: params.resultUri,
        furnitureImageUris,
      });
      router.replace('/');
    } catch (error) {
      showMessage('Lagring feilet', error instanceof Error ? error.message : String(error));
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {params.provider === 'mock' && (
        <View style={styles.mockBanner}>
          <Text style={styles.mockBannerText}>
            Demomodus: ingen API-nøkkel lagt inn, så dette er originalbildet. Legg inn
            Gemini-nøkkel under Innstillinger for ekte generering.
          </Text>
        </View>
      )}

      <Image source={{ uri: displayedUri }} style={styles.image} />
      <Pressable
        style={styles.toggle}
        onPressIn={() => setShowOriginal(true)}
        onPressOut={() => setShowOriginal(false)}
      >
        <Text style={styles.toggleText}>
          {showOriginal ? 'Originalen vises' : 'Hold inne for å se originalen'}
        </Text>
      </Pressable>

      <Text style={styles.meta}>Veggfarge: {params.wallColor}</Text>
      {params.furniture ? <Text style={styles.meta}>Møbler: {params.furniture}</Text> : null}
      {furnitureImageUris.length > 0 && (
        <View style={styles.furnitureRow}>
          {furnitureImageUris.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.furnitureThumb} />
          ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Navn på favoritten, f.eks. «Stue – salvie + eik»"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />
      <Pressable style={[styles.saveButton, saving && { opacity: 0.6 }]} onPress={onSave} disabled={saving}>
        <Text style={styles.saveButtonText}>Lagre som favoritt</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Prøv igjen med andre valg</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  mockBanner: {
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  mockBannerText: { color: colors.text, lineHeight: 20 },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12, backgroundColor: colors.border },
  toggle: { alignItems: 'center', paddingVertical: spacing.md },
  toggleText: { color: colors.textMuted, textDecorationLine: 'underline' },
  meta: { color: colors.text, marginBottom: spacing.xs },
  furnitureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  furnitureThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginTop: spacing.lg,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  secondaryButton: { alignItems: 'center', paddingVertical: spacing.lg },
  secondaryButtonText: { color: colors.accent, fontWeight: '600' },
});
