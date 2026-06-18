import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { getGeminiApiKey, setGeminiApiKey } from '@/lib/settings';
import { showMessage } from '@/lib/ui';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGeminiApiKey().then((key) => {
      setApiKey(key ?? '');
      setLoaded(true);
    });
  }, []);

  async function onSave() {
    await setGeminiApiKey(apiKey);
    showMessage('Lagret', apiKey.trim() === '' ? 'Nøkkelen er fjernet – appen kjører i demomodus.' : 'API-nøkkelen er lagret.');
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Gemini API-nøkkel</Text>
      <Text style={styles.help}>
        Genereringen bruker Google Gemini. Lag en gratis nøkkel på aistudio.google.com og lim den
        inn her. Nøkkelen lagres kun lokalt på denne telefonen. Uten nøkkel kjører appen i
        demomodus (viser originalbildet uendret).
      </Text>
      <TextInput
        style={styles.input}
        placeholder="AIza…"
        placeholderTextColor={colors.textMuted}
        value={apiKey}
        onChangeText={setApiKey}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        editable={loaded}
      />
      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Lagre</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  help: { color: colors.textMuted, lineHeight: 21, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    padding: spacing.md,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
