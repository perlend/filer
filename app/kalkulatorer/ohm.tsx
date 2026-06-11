import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import { losOhm, type OhmResultat } from "@/lib/calc/ohm";
import { avstand, farger } from "@/theme";

function fmt(n: number): string {
  return n.toLocaleString("nb-NO", { maximumFractionDigits: 2 });
}

export default function OhmKalkulator() {
  const [u, setU] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [p, setP] = useState("");
  const [resultat, setResultat] = useState<OhmResultat | null>(null);
  const [feil, setFeil] = useState<string | null>(null);

  function beregn() {
    try {
      const input: Record<string, number> = {};
      if (u.trim()) input.u = tilTall(u);
      if (i.trim()) input.i = tilTall(i);
      if (r.trim()) input.r = tilTall(r);
      if (p.trim()) input.p = tilTall(p);
      setResultat(losOhm(input));
      setFeil(null);
    } catch (e) {
      setResultat(null);
      setFeil(e instanceof Error ? e.message : "Ugyldig input.");
    }
  }

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Text style={stiler.hjelp}>Fyll inn nøyaktig to felt og la resten stå tomme.</Text>
      <Inndatafelt etikett="Spenning (U)" verdi={u} onEndre={setU} enhet="V" />
      <Inndatafelt etikett="Strøm (I)" verdi={i} onEndre={setI} enhet="A" />
      <Inndatafelt etikett="Resistans (R)" verdi={r} onEndre={setR} enhet="Ω" />
      <Inndatafelt etikett="Effekt (P)" verdi={p} onEndre={setP} enhet="W" />
      <Knapp tittel="Beregn" onPress={beregn} />

      {feil && <Text style={stiler.feil}>{feil}</Text>}

      {resultat && (
        <Kort style={stiler.resultat}>
          <Text style={stiler.resultatRad}>U = {fmt(resultat.u)} V</Text>
          <Text style={stiler.resultatRad}>I = {fmt(resultat.i)} A</Text>
          <Text style={stiler.resultatRad}>R = {fmt(resultat.r)} Ω</Text>
          <Text style={stiler.resultatRad}>P = {fmt(resultat.p)} W</Text>
          <Text style={stiler.merknad}>Gjelder resistiv last (cos φ = 1) / likestrøm.</Text>
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
  resultat: { marginTop: avstand.m, gap: avstand.xs },
  resultatRad: { fontSize: 18, fontWeight: "600", color: farger.tekst },
  merknad: { fontSize: 12, color: farger.tekstSvak, marginTop: avstand.s },
});
