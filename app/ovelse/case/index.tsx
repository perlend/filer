import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Kort } from "@/components/Kort";
import { ALLE_CASER } from "@/content";
import { avstand, farger } from "@/theme";

export default function CaseListe() {
  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Text style={stiler.hjelp}>
        Et case er et helt oppdrag – fra planlegging til overlevering – slik fagprøven er bygget
        opp. Du får forklaring etter hvert svar, så bruk dem til å øve på å BEGRUNNE valgene dine.
      </Text>
      {ALLE_CASER.map((sak) => (
        <Pressable
          key={sak.id}
          onPress={() => router.push({ pathname: "/ovelse/case/[id]", params: { id: sak.id } })}
        >
          <Kort style={stiler.valg}>
            <Text style={stiler.valgTittel}>
              {sak.ikon} {sak.tittel}
            </Text>
            <Text style={stiler.valgTekst} numberOfLines={3}>
              {sak.ingress}
            </Text>
            <Text style={stiler.meta}>
              {sak.steg.length} faser · {sak.steg.reduce((sum, s) => sum + s.sporsmal.length, 0)}{" "}
              oppgaver
            </Text>
          </Kort>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, gap: avstand.m, paddingBottom: avstand.xl },
  hjelp: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  valg: { gap: avstand.xs },
  valgTittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  valgTekst: { fontSize: 14, color: farger.tekstSvak, lineHeight: 20 },
  meta: { fontSize: 12, color: farger.primarMork, fontWeight: "600" },
});
