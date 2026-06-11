import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Kort } from "@/components/Kort";
import { OMRADER, leksjonerForOmrade } from "@/content";
import { hentLesteLeksjoner } from "@/lib/lagring";
import { avstand, farger } from "@/theme";

export default function LeksjonsListe() {
  const [leste, setLeste] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      hentLesteLeksjoner().then((l) => aktiv && setLeste(l));
      return () => {
        aktiv = false;
      };
    }, [])
  );

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      {OMRADER.map((omrade) => {
        const leksjoner = leksjonerForOmrade(omrade.id);
        if (leksjoner.length === 0) return null;
        return (
          <Kort key={omrade.id} style={stiler.gruppe}>
            <Text style={stiler.gruppeTittel}>
              {omrade.ikon} {omrade.navn}
            </Text>
            {leksjoner.map((leksjon) => (
              <Pressable
                key={leksjon.id}
                style={stiler.rad}
                onPress={() => router.push({ pathname: "/leksjoner/[id]", params: { id: leksjon.id } })}
              >
                <Text style={stiler.radTittel}>
                  {leste.includes(leksjon.id) ? "✅ " : "○ "}
                  {leksjon.tittel}
                </Text>
                <Text style={stiler.radDetalj}>{leksjon.lesetidMin} min lesetid</Text>
              </Pressable>
            ))}
          </Kort>
        );
      })}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, gap: avstand.m },
  gruppe: { gap: avstand.s },
  gruppeTittel: { fontSize: 16, fontWeight: "700", color: farger.tekst },
  rad: { paddingVertical: avstand.s, borderTopWidth: 1, borderTopColor: farger.kant },
  radTittel: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  radDetalj: { fontSize: 13, color: farger.tekstSvak, marginTop: 2 },
});
