import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import { minsteTverrsnitt, type KabelResultat } from "@/lib/calc/kabel";
import { avstand, farger } from "@/theme";

export default function KabelKalkulator() {
  const [strom, setStrom] = useState("");
  const [korreksjon, setKorreksjon] = useState("1");
  const [resultat, setResultat] = useState<KabelResultat | null>(null);
  const [feil, setFeil] = useState<string | null>(null);

  function beregn() {
    try {
      setResultat(
        minsteTverrsnitt({
          stromA: tilTall(strom),
          korreksjonsfaktor: korreksjon.trim() ? tilTall(korreksjon) : 1,
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
      <Text style={stiler.hjelp}>
        Forenklet tabell: kobber, PVC-isolasjon, referansemetode C, 30 °C. Husk å kontrollere
        spenningsfallet i tillegg!
      </Text>
      <Inndatafelt
        etikett="Belastningsstrøm / vernets merkestrøm"
        verdi={strom}
        onEndre={setStrom}
        enhet="A"
      />
      <Inndatafelt
        etikett="Samlet korreksjonsfaktor (temperatur × forlegning × gruppering)"
        verdi={korreksjon}
        onEndre={setKorreksjon}
        plassholder="1"
      />
      <Knapp tittel="Finn tverrsnitt" onPress={beregn} />

      {feil && <Text style={stiler.feil}>{feil}</Text>}

      {resultat && (
        <Kort style={stiler.resultat}>
          <Text style={stiler.resultatTall}>
            {resultat.tverrsnittMm2.toLocaleString("nb-NO")} mm²
          </Text>
          <Text style={stiler.resultatTekst}>
            Korrigert strømføringsevne:{" "}
            {resultat.korrigertKapasitetA.toLocaleString("nb-NO", { maximumFractionDigits: 1 })} A
          </Text>
          <Text style={stiler.merknad}>
            Veiledende verdi for læring. Ved prosjektering: kontroller mot NEK 400-5-52 tabell 52B
            med riktige korreksjonsfaktorer, og sjekk spenningsfall og kortslutningsvern.
          </Text>
        </Kort>
      )}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl },
  hjelp: { fontSize: 14, color: farger.tekstSvak, marginBottom: avstand.m },
  feil: { color: farger.galt, marginTop: avstand.m, fontSize: 15 },
  resultat: { marginTop: avstand.m, gap: avstand.s, alignItems: "center" },
  resultatTall: { fontSize: 34, fontWeight: "700", color: farger.primarMork },
  resultatTekst: { fontSize: 15, color: farger.tekst },
  merknad: { fontSize: 12, color: farger.tekstSvak, textAlign: "center" },
});
