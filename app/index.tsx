import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { OMRADER, ALLE_SPORSMAL, sporsmalForOmrade } from "@/content";
import { hentSrsKort, hentStatistikk, TOM_STATISTIKK, type Statistikk } from "@/lib/lagring";
import { forfalteKort } from "@/lib/srs";
import { avstand, farger } from "@/theme";

export default function Hjem() {
  const [statistikk, setStatistikk] = useState<Statistikk>(TOM_STATISTIKK);
  const [antallForfalte, setAntallForfalte] = useState(0);
  const [besvartPerOmrade, setBesvartPerOmrade] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      (async () => {
        const [stat, kort] = await Promise.all([hentStatistikk(), hentSrsKort()]);
        if (!aktiv) return;
        setStatistikk(stat);
        setAntallForfalte(forfalteKort(Object.values(kort)).length);
        const perOmrade: Record<string, number> = {};
        for (const s of ALLE_SPORSMAL) {
          if (s.id in kort) perOmrade[s.omrade] = (perOmrade[s.omrade] ?? 0) + 1;
        }
        setBesvartPerOmrade(perOmrade);
      })();
      return () => {
        aktiv = false;
      };
    }, [])
  );

  const treffprosent =
    statistikk.totaltBesvart > 0
      ? Math.round((statistikk.totaltRiktig / statistikk.totaltBesvart) * 100)
      : null;

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Kort style={stiler.streakKort}>
        <Text style={stiler.streakTall}>🔥 {statistikk.streak}</Text>
        <Text style={stiler.streakTekst}>
          {statistikk.streak === 0
            ? "Ta dagens økt og start en streak!"
            : statistikk.streak === 1
              ? "dag på rad – kom igjen!"
              : "dager på rad!"}
        </Text>
        {treffprosent !== null && (
          <Text style={stiler.statTekst}>
            {statistikk.totaltBesvart} spørsmål besvart · {treffprosent} % riktig
          </Text>
        )}
      </Kort>

      <Kort style={stiler.seksjon}>
        <Text style={stiler.tittel}>Dagens økt</Text>
        <Text style={stiler.brodtekst}>
          {antallForfalte > 0
            ? `${antallForfalte} repetisjon${antallForfalte === 1 ? "" : "er"} venter på deg.`
            : "Ingen forfalte repetisjoner – øv på noe nytt!"}
        </Text>
        <Knapp tittel="Start økt" onPress={() => router.push("/ovelse/quiz")} />
      </Kort>

      <Text style={stiler.tittel}>Fremdrift</Text>
      {OMRADER.map((omrade) => {
        const total = sporsmalForOmrade(omrade.id).length;
        const besvart = besvartPerOmrade[omrade.id] ?? 0;
        const andel = total > 0 ? besvart / total : 0;
        return (
          <Kort key={omrade.id} style={stiler.seksjon}>
            <Text style={stiler.omradeNavn}>
              {omrade.ikon} {omrade.navn}
            </Text>
            <View style={stiler.stolpeBakgrunn}>
              <View style={[stiler.stolpe, { width: `${Math.round(andel * 100)}%` }]} />
            </View>
            <Text style={stiler.statTekst}>
              {besvart} av {total} spørsmål påbegynt
            </Text>
          </Kort>
        );
      })}

      <Text style={stiler.ansvarsfraskrivelse}>
        Appen er læringsstøtte og erstatter ikke forskrifter, normer eller instruktøren din.
      </Text>
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl },
  streakKort: { alignItems: "center", marginBottom: avstand.m },
  streakTall: { fontSize: 44, fontWeight: "700", color: farger.tekst },
  streakTekst: { fontSize: 16, color: farger.tekstSvak, marginTop: avstand.xs },
  seksjon: { marginBottom: avstand.m, gap: avstand.s },
  tittel: { fontSize: 18, fontWeight: "700", color: farger.tekst, marginBottom: avstand.s },
  brodtekst: { fontSize: 15, color: farger.tekstSvak },
  omradeNavn: { fontSize: 16, fontWeight: "600", color: farger.tekst },
  stolpeBakgrunn: {
    height: 8,
    borderRadius: 4,
    backgroundColor: farger.kant,
    overflow: "hidden",
  },
  stolpe: { height: 8, borderRadius: 4, backgroundColor: farger.primar },
  statTekst: { fontSize: 13, color: farger.tekstSvak, marginTop: avstand.xs },
  ansvarsfraskrivelse: {
    fontSize: 12,
    color: farger.tekstSvak,
    textAlign: "center",
    marginTop: avstand.l,
  },
});
