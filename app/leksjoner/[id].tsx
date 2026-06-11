import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { finnLeksjon } from "@/content";
import { merkLeksjonLest } from "@/lib/lagring";
import { avstand, farger } from "@/theme";

export default function LeksjonsVisning() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leksjon = id ? finnLeksjon(id) : undefined;
  const [lest, setLest] = useState(false);

  useEffect(() => {
    setLest(false);
  }, [id]);

  if (!leksjon) {
    return (
      <View style={[stiler.skjerm, stiler.midtstilt]}>
        <Text style={stiler.brodtekst}>Fant ikke leksjonen.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: leksjon.tittel }} />
      <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
        <Text style={stiler.tittel}>{leksjon.tittel}</Text>
        <Text style={stiler.meta}>
          {leksjon.lesetidMin} min lesetid · nivå {leksjon.nivaa}
        </Text>

        {leksjon.seksjoner.map((seksjon) => (
          <Kort key={seksjon.tittel} style={stiler.seksjon}>
            <Text style={stiler.seksjonTittel}>{seksjon.tittel}</Text>
            <Text style={stiler.brodtekst}>{seksjon.tekst}</Text>
          </Kort>
        ))}

        <Kort style={[stiler.seksjon, stiler.huskeKort]}>
          <Text style={stiler.seksjonTittel}>Husk 💡</Text>
          {leksjon.huskepunkter.map((punkt) => (
            <Text key={punkt} style={stiler.huskepunkt}>
              • {punkt}
            </Text>
          ))}
        </Kort>

        <Knapp
          tittel={lest ? "Merket som lest ✅" : "Merk som lest"}
          deaktivert={lest}
          onPress={() => {
            setLest(true);
            void merkLeksjonLest(leksjon.id).then(() => router.back());
          }}
        />
      </ScrollView>
    </>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl, gap: avstand.m },
  midtstilt: { alignItems: "center", justifyContent: "center" },
  tittel: { fontSize: 22, fontWeight: "700", color: farger.tekst },
  meta: { fontSize: 13, color: farger.tekstSvak },
  seksjon: { gap: avstand.s },
  seksjonTittel: { fontSize: 16, fontWeight: "700", color: farger.tekst },
  brodtekst: { fontSize: 15, color: farger.tekst, lineHeight: 23 },
  huskeKort: { borderColor: farger.primar, borderWidth: 2 },
  huskepunkt: { fontSize: 15, color: farger.tekst, lineHeight: 23 },
});
