import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Kort } from "@/components/Kort";
import { avstand, farger } from "@/theme";

const KALKULATORER = [
  {
    rute: "/kalkulatorer/ohm",
    tittel: "⚡ Ohms lov og effekt",
    tekst: "Oppgi to av U, I, R og P – få resten",
  },
  {
    rute: "/kalkulatorer/spenningsfall",
    tittel: "📉 Spenningsfall",
    tekst: "Volt og prosent for en- og trefase, mot 4 %-anbefalingen",
  },
  {
    rute: "/kalkulatorer/kabel",
    tittel: "🔌 Kabeltverrsnitt",
    tekst: "Veiledende minste tverrsnitt ut fra strøm og korreksjonsfaktor",
  },
  {
    rute: "/kalkulatorer/formler",
    tittel: "📖 Formelsamling",
    tekst: "Alle formlene med forklaring av størrelser og når du bruker dem",
  },
  {
    rute: "/kalkulatorer/elnummer",
    tittel: "🔢 Elnummer",
    tekst: "Hovedgruppene, oppslag i EFObasen og din egen liste over mest brukte numre",
  },
] as const;

export default function KalkulatorListe() {
  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      {KALKULATORER.map((kalk) => (
        <Pressable key={kalk.rute} onPress={() => router.push(kalk.rute)}>
          <Kort style={stiler.valg}>
            <Text style={stiler.valgTittel}>{kalk.tittel}</Text>
            <Text style={stiler.valgTekst}>{kalk.tekst}</Text>
          </Kort>
        </Pressable>
      ))}
      <Text style={stiler.merknad}>
        Kalkulatorene er læringsstøtte med forenklede forutsetninger. Ved prosjektering gjelder
        alltid NEK 400 og bedriftens rutiner.
      </Text>
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, gap: avstand.m },
  valg: { gap: avstand.xs },
  valgTittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  valgTekst: { fontSize: 14, color: farger.tekstSvak },
  merknad: { fontSize: 12, color: farger.tekstSvak, textAlign: "center", marginTop: avstand.s },
});
