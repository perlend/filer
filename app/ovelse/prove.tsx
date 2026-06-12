import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import { ALLE_SPORSMAL, OMRADER } from "@/content";
import type { QuizSporsmal } from "@/content/types";
import { erNumeriskRiktig } from "@/lib/okt";
import { karakterestimat, velgProveSporsmal } from "@/lib/statistikk";
import { stokkAlternativer, stokkSantUsant } from "@/lib/stokking";
import { avstand, farger } from "@/theme";

const ANTALL = 20;
const TID_SEKUNDER = 25 * 60;

interface AvgittSvar {
  riktig: boolean;
  visning: string;
}

export default function Provemodus() {
  const [startet, setStartet] = useState(false);
  const [prove, setProve] = useState<QuizSporsmal[]>([]);
  const [indeks, setIndeks] = useState(0);
  const [svarListe, setSvarListe] = useState<AvgittSvar[]>([]);
  const [numeriskTekst, setNumeriskTekst] = useState("");
  const [sekunderIgjen, setSekunderIgjen] = useState(TID_SEKUNDER);

  const ferdig = startet && (indeks >= prove.length || sekunderIgjen <= 0);

  useEffect(() => {
    if (!startet || ferdig) return;
    const intervall = setInterval(() => setSekunderIgjen((s) => s - 1), 1000);
    return () => clearInterval(intervall);
  }, [startet, ferdig]);

  const antallRiktige = useMemo(() => svarListe.filter((s) => s.riktig).length, [svarListe]);

  const aktivtSporsmal = prove[indeks];

  // Stokk alternativene én gang per spørsmål (nøklet på id), ikke per render.
  const stokketFlervalg = useMemo(() => {
    if (aktivtSporsmal?.type !== "flervalg") return null;
    return stokkAlternativer(aktivtSporsmal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktivtSporsmal?.id]);

  const stokketSantUsant = useMemo(() => {
    if (aktivtSporsmal?.type !== "santusant") return null;
    return stokkSantUsant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktivtSporsmal?.id]);

  function start() {
    setProve(velgProveSporsmal(ALLE_SPORSMAL, ANTALL));
    setIndeks(0);
    setSvarListe([]);
    setSekunderIgjen(TID_SEKUNDER);
    setStartet(true);
  }

  function besvar(riktig: boolean, visning: string) {
    setSvarListe((liste) => [...liste, { riktig, visning }]);
    setNumeriskTekst("");
    setIndeks((n) => n + 1);
  }

  if (!startet) {
    return (
      <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
        <Kort style={stiler.seksjon}>
          <Text style={stiler.tittel}>Prøvemodus 🎓</Text>
          <Text style={stiler.brodtekst}>
            {ANTALL} spørsmål trukket fra alle fagområdene, {TID_SEKUNDER / 60} minutter på
            klokka – og ingen fasit underveis, akkurat som på ekte prøve. Til slutt får du
            resultat per område, et karakterestimat og full gjennomgang av det du bommet på.
          </Text>
          <Knapp tittel="Start prøven" onPress={start} />
        </Kort>
      </ScrollView>
    );
  }

  if (ferdig) {
    const besvarte = svarListe.length;
    const prosent = besvarte > 0 ? Math.round((antallRiktige / besvarte) * 100) : 0;
    const estimat = karakterestimat(prosent);
    const feilene = prove
      .slice(0, besvarte)
      .map((sporsmal, n) => ({ sporsmal, svar: svarListe[n] }))
      .filter((r) => !r.svar.riktig);

    const perOmrade = OMRADER.map((omrade) => {
      const rader = prove
        .slice(0, besvarte)
        .map((sporsmal, n) => ({ sporsmal, riktig: svarListe[n].riktig }))
        .filter((r) => r.sporsmal.omrade === omrade.id);
      return { omrade, riktige: rader.filter((r) => r.riktig).length, total: rader.length };
    }).filter((r) => r.total > 0);

    return (
      <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
        <Kort style={[stiler.seksjon, stiler.midtstilt]}>
          <Text style={stiler.resultatProsent}>{prosent} %</Text>
          <Text style={stiler.resultatEstimat}>{estimat}</Text>
          <Text style={stiler.brodtekst}>
            {antallRiktige} av {besvarte} riktige
            {sekunderIgjen <= 0 ? " – tiden løp ut" : ""}
          </Text>
          <Text style={stiler.merknad}>
            Veiledende estimat – en quiz måler ikke planlegging, utførelse og egenvurdering, som
            teller tungt på fagprøven.
          </Text>
        </Kort>

        <Kort style={stiler.seksjon}>
          <Text style={stiler.tittel}>Per område</Text>
          {perOmrade.map(({ omrade, riktige, total }) => (
            <View key={omrade.id} style={stiler.omradeRad}>
              <Text style={stiler.omradeNavn}>
                {omrade.ikon} {omrade.navn}
              </Text>
              <Text style={stiler.omradeTall}>
                {riktige}/{total}
              </Text>
            </View>
          ))}
        </Kort>

        {feilene.length > 0 && (
          <Kort style={stiler.seksjon}>
            <Text style={stiler.tittel}>Gjennomgang av feilsvar ({feilene.length})</Text>
            {feilene.map(({ sporsmal, svar }) => (
              <View key={sporsmal.id} style={stiler.feilBlokk}>
                <Text style={stiler.feilSporsmal}>{sporsmal.sporsmal}</Text>
                <Text style={stiler.feilDittSvar}>Ditt svar: {svar.visning}</Text>
                <Text style={stiler.feilForklaring}>{sporsmal.forklaring}</Text>
                <Text style={stiler.feilKilde}>Kilde: {sporsmal.kilde}</Text>
              </View>
            ))}
          </Kort>
        )}

        <Knapp tittel="Ny prøve" onPress={start} />
        <Knapp tittel="Tilbake" variant="sekundar" onPress={() => router.back()} />
      </ScrollView>
    );
  }

  const sporsmal = prove[indeks];
  const minutter = Math.floor(sekunderIgjen / 60);
  const sekunder = String(sekunderIgjen % 60).padStart(2, "0");

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <View style={stiler.toppRad}>
        <Text style={stiler.teller}>
          {indeks + 1} av {prove.length}
        </Text>
        <Text style={[stiler.klokke, sekunderIgjen < 120 && { color: farger.galt }]}>
          ⏱ {minutter}:{sekunder}
        </Text>
      </View>

      <Kort style={{ marginBottom: avstand.m }}>
        <Text style={stiler.sporsmal}>{sporsmal.sporsmal}</Text>
      </Kort>

      {sporsmal.type === "flervalg" && stokketFlervalg && (
        <View style={stiler.alternativer}>
          {stokketFlervalg.alternativer.map((alternativ, n) => (
            <Pressable
              key={n}
              style={stiler.alternativ}
              onPress={() => besvar(n === stokketFlervalg.riktigIndeks, alternativ)}
            >
              <Text style={stiler.alternativTekst}>{alternativ}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {sporsmal.type === "santusant" && stokketSantUsant && (
        <View style={stiler.alternativer}>
          {stokketSantUsant.map((verdi) => (
            <Pressable
              key={String(verdi)}
              style={stiler.alternativ}
              onPress={() => besvar(verdi === sporsmal.riktig, verdi ? "Sant" : "Usant")}
            >
              <Text style={stiler.alternativTekst}>{verdi ? "Sant" : "Usant"}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {sporsmal.type === "numerisk" && (
        <View>
          <Inndatafelt
            etikett="Ditt svar"
            verdi={numeriskTekst}
            onEndre={setNumeriskTekst}
            enhet={sporsmal.enhet}
            plassholder="0"
          />
          <Knapp
            tittel="Svar og gå videre"
            deaktivert={numeriskTekst.trim() === ""}
            onPress={() =>
              besvar(
                erNumeriskRiktig(tilTall(numeriskTekst), sporsmal.svar, sporsmal.toleranse),
                `${numeriskTekst} ${sporsmal.enhet}`
              )
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl, gap: avstand.s },
  seksjon: { gap: avstand.s },
  midtstilt: { alignItems: "center" },
  tittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  brodtekst: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  merknad: { fontSize: 12, color: farger.tekstSvak, fontStyle: "italic", textAlign: "center" },
  toppRad: { flexDirection: "row", justifyContent: "space-between", marginBottom: avstand.s },
  teller: { fontSize: 13, color: farger.tekstSvak },
  klokke: { fontSize: 15, fontWeight: "700", color: farger.tekst },
  sporsmal: { fontSize: 18, fontWeight: "600", color: farger.tekst, lineHeight: 26 },
  alternativer: { gap: avstand.s },
  alternativ: {
    backgroundColor: farger.kort,
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 12,
    padding: avstand.m,
    minHeight: 48,
    justifyContent: "center",
  },
  alternativTekst: { fontSize: 16, color: farger.tekst },
  resultatProsent: { fontSize: 44, fontWeight: "700", color: farger.tekst },
  resultatEstimat: { fontSize: 20, fontWeight: "700", color: farger.primarMork },
  omradeRad: { flexDirection: "row", justifyContent: "space-between" },
  omradeNavn: { fontSize: 14, color: farger.tekst, flex: 1 },
  omradeTall: { fontSize: 14, fontWeight: "700", color: farger.tekst },
  feilBlokk: {
    borderTopWidth: 1,
    borderTopColor: farger.kant,
    paddingTop: avstand.s,
    gap: avstand.xs,
  },
  feilSporsmal: { fontSize: 14, fontWeight: "600", color: farger.tekst },
  feilDittSvar: { fontSize: 13, color: farger.galt },
  feilForklaring: { fontSize: 13, color: farger.tekst, lineHeight: 19 },
  feilKilde: { fontSize: 12, color: farger.tekstSvak, fontStyle: "italic" },
});
