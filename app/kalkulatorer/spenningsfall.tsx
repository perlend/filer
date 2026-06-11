import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import {
  beregnSpenningsfall,
  type Fase,
  type SpenningsfallResultat,
} from "@/lib/calc/spenningsfall";
import { avstand, farger } from "@/theme";

export default function SpenningsfallKalkulator() {
  const [fase, setFase] = useState<Fase>("enfase");
  const [spenning, setSpenning] = useState("230");
  const [lengde, setLengde] = useState("");
  const [strom, setStrom] = useState("");
  const [tverrsnitt, setTverrsnitt] = useState("");
  const [resultat, setResultat] = useState<SpenningsfallResultat | null>(null);
  const [feil, setFeil] = useState<string | null>(null);

  function velgFase(ny: Fase) {
    setFase(ny);
    setSpenning(ny === "enfase" ? "230" : "400");
    setResultat(null);
  }

  function beregn() {
    try {
      setResultat(
        beregnSpenningsfall({
          fase,
          spenningV: tilTall(spenning),
          lengdeM: tilTall(lengde),
          stromA: tilTall(strom),
          tverrsnittMm2: tilTall(tverrsnitt),
        })
      );
      setFeil(null);
    } catch (e) {
      setResultat(null);
      setFeil(e instanceof Error ? e.message : "Ugyldig input.");
    }
  }

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <View style={stiler.faseVelger}>
        {(["enfase", "trefase"] as const).map((valg) => (
          <Pressable
            key={valg}
            onPress={() => velgFase(valg)}
            style={[stiler.faseKnapp, fase === valg && stiler.faseValgt]}
          >
            <Text style={[stiler.faseTekst, fase === valg && stiler.faseTekstValgt]}>
              {valg === "enfase" ? "Enfase" : "Trefase"}
            </Text>
          </Pressable>
        ))}
      </View>

      <Inndatafelt etikett="Systemspenning" verdi={spenning} onEndre={setSpenning} enhet="V" />
      <Inndatafelt etikett="Kabellengde (én vei)" verdi={lengde} onEndre={setLengde} enhet="m" />
      <Inndatafelt etikett="Belastningsstrøm" verdi={strom} onEndre={setStrom} enhet="A" />
      <Inndatafelt
        etikett="Ledertverrsnitt"
        verdi={tverrsnitt}
        onEndre={setTverrsnitt}
        enhet="mm²"
        plassholder="f.eks. 2,5"
      />
      <Knapp tittel="Beregn" onPress={beregn} />

      {feil && <Text style={stiler.feil}>{feil}</Text>}

      {resultat && (
        <Kort
          style={[
            stiler.resultat,
            {
              backgroundColor: resultat.innenforAnbefaling
                ? farger.riktigBakgrunn
                : farger.galtBakgrunn,
            },
          ]}
        >
          <Text style={stiler.resultatTall}>
            ΔU = {resultat.fallV.toLocaleString("nb-NO", { maximumFractionDigits: 2 })} V (
            {resultat.fallProsent.toLocaleString("nb-NO", { maximumFractionDigits: 1 })} %)
          </Text>
          <Text style={stiler.resultatTekst}>
            {resultat.innenforAnbefaling
              ? "Innenfor anbefalingen på maks 4 % (NEK 400-5-52)."
              : "Over anbefalingen på 4 % – vurder større tverrsnitt."}
          </Text>
          <Text style={stiler.merknad}>
            Resistiv beregning med kobber (ρ = 0,0175 Ω·mm²/m ved 20 °C), cos φ = 1.
          </Text>
        </Kort>
      )}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl },
  faseVelger: { flexDirection: "row", gap: avstand.s, marginBottom: avstand.m },
  faseKnapp: {
    flex: 1,
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: farger.kort,
  },
  faseValgt: { backgroundColor: farger.primar, borderColor: farger.primar },
  faseTekst: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  faseTekstValgt: { color: "#FFFFFF" },
  feil: { color: farger.galt, marginTop: avstand.m, fontSize: 15 },
  resultat: { marginTop: avstand.m, gap: avstand.s },
  resultatTall: { fontSize: 20, fontWeight: "700", color: farger.tekst },
  resultatTekst: { fontSize: 15, color: farger.tekst },
  merknad: { fontSize: 12, color: farger.tekstSvak },
});
