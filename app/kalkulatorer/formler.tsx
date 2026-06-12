import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Kort } from "@/components/Kort";
import { FORMELSAMLING } from "@/content/formler";
import { avstand, farger } from "@/theme";

export default function Formelsamling() {
  const [sok, setSok] = useState("");

  const grupper = useMemo(() => {
    const term = sok.trim().toLowerCase();
    if (!term) return FORMELSAMLING;
    return FORMELSAMLING.map((gruppe) => ({
      ...gruppe,
      formler: gruppe.formler.filter(
        (f) =>
          f.navn.toLowerCase().includes(term) ||
          f.formel.toLowerCase().includes(term) ||
          f.naarBrukes.toLowerCase().includes(term)
      ),
    })).filter((gruppe) => gruppe.formler.length > 0);
  }, [sok]);

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <TextInput
        style={stiler.sokefelt}
        value={sok}
        onChangeText={setSok}
        placeholder="Søk: f.eks. spenningsfall, cos φ, turtall …"
        placeholderTextColor={farger.tekstSvak}
      />

      {grupper.map((gruppe) => (
        <View key={gruppe.tittel} style={stiler.gruppe}>
          <Text style={stiler.gruppeTittel}>
            {gruppe.ikon} {gruppe.tittel}
          </Text>
          {gruppe.formler.map((formel) => (
            <Kort key={formel.id} style={stiler.formelKort}>
              <Text style={stiler.formelNavn}>{formel.navn}</Text>
              <Text style={stiler.formel}>{formel.formel}</Text>
              {formel.storrelser.map((storrelse) => (
                <Text key={storrelse} style={stiler.storrelse}>
                  {storrelse}
                </Text>
              ))}
              <Text style={stiler.naarBrukes}>{formel.naarBrukes}</Text>
            </Kort>
          ))}
        </View>
      ))}

      {grupper.length === 0 && <Text style={stiler.ingenTreff}>Ingen formler matcher søket.</Text>}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl, gap: avstand.m },
  sokefelt: {
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    backgroundColor: farger.kort,
    paddingHorizontal: avstand.m,
    paddingVertical: 12,
    fontSize: 15,
    color: farger.tekst,
  },
  gruppe: { gap: avstand.s },
  gruppeTittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  formelKort: { gap: avstand.xs },
  formelNavn: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  formel: {
    fontSize: 18,
    fontWeight: "700",
    color: farger.primarMork,
    paddingVertical: avstand.xs,
  },
  storrelse: { fontSize: 13, color: farger.tekstSvak },
  naarBrukes: { fontSize: 13, color: farger.tekst, lineHeight: 19, marginTop: avstand.xs },
  ingenTreff: { fontSize: 14, color: farger.tekstSvak, textAlign: "center" },
});
