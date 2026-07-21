import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Kort } from "@/components/Kort";
import { OMRADER, sporsmalForOmrade } from "@/content";
import { avstand, farger } from "@/theme";

export default function OvelseOversikt() {
  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Pressable onPress={() => router.push("/ovelse/quiz")}>
        <Kort style={[stiler.valg, stiler.blandet]}>
          <Text style={stiler.valgTittel}>🔀 Blandet økt</Text>
          <Text style={stiler.valgTekst}>
            Repetisjoner som har forfalt + nye spørsmål fra alle områder
          </Text>
        </Kort>
      </Pressable>

      <Pressable onPress={() => router.push("/ovelse/prove")}>
        <Kort style={stiler.valg}>
          <Text style={stiler.valgTittel}>🎓 Prøvemodus</Text>
          <Text style={stiler.valgTekst}>
            20 spørsmål på 25 minutter uten fasit underveis – med karakterestimat til slutt
          </Text>
        </Kort>
      </Pressable>

      <Pressable onPress={() => router.push("/ovelse/case")}>
        <Kort style={stiler.valg}>
          <Text style={stiler.valgTittel}>🧰 Fagprøve-case</Text>
          <Text style={stiler.valgTekst}>
            Hele oppdrag fra planlegging til overlevering – slik fagprøven er bygget opp
          </Text>
        </Kort>
      </Pressable>

      <Pressable onPress={() => router.push("/ovelse/statistikk")}>
        <Kort style={stiler.valg}>
          <Text style={stiler.valgTittel}>📊 Statistikk</Text>
          <Text style={stiler.valgTekst}>
            Treffprosent per område og trening på spørsmålene du sliter mest med
          </Text>
        </Kort>
      </Pressable>

      <Pressable onPress={() => router.push("/ovelse/laereplan")}>
        <Kort style={stiler.valg}>
          <Text style={stiler.valgTittel}>🗺️ Læreplan</Text>
          <Text style={stiler.valgTekst}>
            Se hvor mange kompetansemål du har mestret – og øv målrettet på dem du mangler
          </Text>
        </Kort>
      </Pressable>

      {OMRADER.map((omrade) => (
        <Pressable
          key={omrade.id}
          onPress={() =>
            router.push({ pathname: "/ovelse/quiz", params: { omrade: omrade.id } })
          }
        >
          <Kort style={stiler.valg}>
            <Text style={stiler.valgTittel}>
              {omrade.ikon} {omrade.navn}
            </Text>
            <Text style={stiler.valgTekst}>
              {omrade.beskrivelse} · {sporsmalForOmrade(omrade.id).length} spørsmål
            </Text>
          </Kort>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, gap: avstand.m },
  valg: { gap: avstand.xs },
  blandet: { borderColor: farger.primar, borderWidth: 2 },
  valgTittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  valgTekst: { fontSize: 14, color: farger.tekstSvak },
});
