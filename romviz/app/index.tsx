import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Favorite, listFavorites } from '@/lib/favorites';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listFavorites().then((f) => {
        if (active) setFavorites(f);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Link href="/ny" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ Nytt forslag</Text>
        </Pressable>
      </Link>

      <Text style={styles.heading}>Favoritter</Text>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>
          Ingen favoritter ennå. Lag et forslag og lagre det, så finner dere det igjen her.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/favoritt/[id]', params: { id: item.id } }} asChild>
              <Pressable style={styles.card}>
                <Image source={{ uri: item.resultUri }} style={styles.cardImage} />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.wallColor}
                </Text>
              </Pressable>
            </Link>
          )}
        />
      )}

      <Link href="/innstillinger" asChild>
        <Pressable style={styles.settingsLink}>
          <Text style={styles.settingsLinkText}>Innstillinger</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  heading: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  empty: { color: colors.textMuted, lineHeight: 22 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
  },
  cardImage: { width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.border },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  cardSubtitle: { fontSize: 13, color: colors.textMuted, paddingHorizontal: spacing.sm },
  settingsLink: { paddingVertical: spacing.md, alignItems: 'center' },
  settingsLinkText: { color: colors.textMuted, textDecorationLine: 'underline' },
});
