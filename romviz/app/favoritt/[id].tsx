import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Favorite, getFavorite, removeFavorite } from '@/lib/favorites';
import { confirmDestructive } from '@/lib/ui';
import { colors, spacing } from '@/theme';

export default function FavoriteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (id) {
      getFavorite(id).then((f) => setFavorite(f ?? null));
    }
  }, [id]);

  if (!favorite) {
    return <Text style={styles.loading}>Laster…</Text>;
  }

  function onDelete() {
    confirmDestructive(
      'Slette favoritt?',
      `«${favorite!.name}» blir borte for godt.`,
      'Slett',
      async () => {
        await removeFavorite(favorite!.id);
        router.back();
      }
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Text style={styles.title}>{favorite.name}</Text>
      <Text style={styles.date}>
        Lagret {new Date(favorite.createdAt).toLocaleDateString('nb-NO')}
      </Text>

      <Image
        source={{ uri: showOriginal ? favorite.originalUri : favorite.resultUri }}
        style={styles.image}
      />
      <Pressable
        style={styles.toggle}
        onPressIn={() => setShowOriginal(true)}
        onPressOut={() => setShowOriginal(false)}
      >
        <Text style={styles.toggleText}>
          {showOriginal ? 'Originalen vises' : 'Hold inne for å se originalen'}
        </Text>
      </Pressable>

      <Text style={styles.meta}>Veggfarge: {favorite.wallColor}</Text>
      {favorite.furniture ? <Text style={styles.meta}>Møbler: {favorite.furniture}</Text> : null}
      {(favorite.furnitureImageUris?.length ?? 0) > 0 && (
        <View style={styles.furnitureRow}>
          {favorite.furnitureImageUris!.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.furnitureThumb} />
          ))}
        </View>
      )}

      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Slett favoritt</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  loading: { padding: spacing.lg, color: colors.textMuted },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  date: { color: colors.textMuted, marginBottom: spacing.md },
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
  deleteButton: { alignItems: 'center', paddingVertical: spacing.lg, marginTop: spacing.lg },
  deleteButtonText: { color: colors.danger, fontWeight: '600' },
});
