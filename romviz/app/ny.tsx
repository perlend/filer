import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { generate } from '@/lib/generation';
import { colors, spacing, wallColors } from '@/theme';

interface PickedImage {
  uri: string;
  base64: string;
  mimeType: string;
}

export default function NewSuggestionScreen() {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [selectedColor, setSelectedColor] = useState(wallColors[0]);
  const [customHex, setCustomHex] = useState('');
  const [furniture, setFurniture] = useState('');
  const [busy, setBusy] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Feil', 'Kunne ikke lese bildet. Prøv et annet bilde.');
      return;
    }
    setImage({
      uri: asset.uri,
      base64: asset.base64,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });
  }

  const effectiveColor =
    customHex.trim() !== ''
      ? customHex.trim()
      : `${selectedColor.name} (${selectedColor.hex})`;

  async function onGenerate() {
    if (!image) {
      Alert.alert('Mangler bilde', 'Velg et bilde av rommet først.');
      return;
    }
    setBusy(true);
    try {
      const result = await generate({
        imageUri: image.uri,
        imageBase64: image.base64,
        mimeType: image.mimeType,
        wallColor: effectiveColor,
        furniture,
      });
      router.push({
        pathname: '/resultat',
        params: {
          resultUri: result.resultUri,
          originalUri: image.uri,
          wallColor: effectiveColor,
          furniture,
          provider: result.provider,
        },
      });
    } catch (error) {
      Alert.alert('Generering feilet', error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.label}>1. Bilde av rommet</Text>
      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        ) : (
          <Text style={styles.imagePickerText}>Trykk for å velge bilde</Text>
        )}
      </Pressable>

      <Text style={styles.label}>2. Veggfarge</Text>
      <View style={styles.swatchRow}>
        {wallColors.map((c) => (
          <Pressable
            key={c.hex}
            onPress={() => {
              setSelectedColor(c);
              setCustomHex('');
            }}
            style={[
              styles.swatch,
              { backgroundColor: c.hex },
              selectedColor.hex === c.hex && customHex === '' && styles.swatchSelected,
            ]}
            accessibilityLabel={c.name}
          />
        ))}
      </View>
      <Text style={styles.colorName}>
        {customHex.trim() !== '' ? customHex.trim() : `${selectedColor.name} (${selectedColor.hex})`}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="…eller egen farge (hex eller NCS-kode)"
        placeholderTextColor={colors.textMuted}
        value={customHex}
        onChangeText={setCustomHex}
        autoCapitalize="none"
      />

      <Text style={styles.label}>3. Møbler (valgfritt)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="F.eks. «grønn 3-seter sofa i fløyel, rundt spisebord i eik, stor monstera i krukke»"
        placeholderTextColor={colors.textMuted}
        value={furniture}
        onChangeText={setFurniture}
        multiline
      />

      <Pressable
        style={[styles.generateButton, busy && styles.generateButtonDisabled]}
        onPress={onGenerate}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>Generer forslag</Text>
        )}
      </Pressable>
      {busy && <Text style={styles.busyHint}>Genererer – dette kan ta opptil et minutt…</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  label: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePickerText: { color: colors.textMuted },
  preview: { width: '100%', aspectRatio: 4 / 3 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  swatchSelected: { borderWidth: 3, borderColor: colors.text },
  colorName: { color: colors.textMuted, marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.text,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  generateButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  generateButtonDisabled: { opacity: 0.6 },
  generateButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  busyHint: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
