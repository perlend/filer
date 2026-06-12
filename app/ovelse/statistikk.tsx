import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { ALLE_SPORSMAL, OMRADER } from "@/content";
import { hentSvarlogg } from "@/lib/lagring";
import {
  omradeStatistikk,
  velgSvakeSporsmal,
  type OmradeStatistikk,
  type Svarlogg,
} from "@/lib/statistikk";
import { avstand, farger } from "@/theme";

export default function Statistikk() {
  const [stat, setStat] = useState<OmradeStatistikk[]>([]);
  const [svake, setSvake] = useState<ReturnType<typeof velgSvakeSporsmal>>([]);

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      void hentSvarlogg().then((logg: Svarlogg) => {
        if (!aktiv) return;
        setStat(omradeStatistikk(ALLE_SPORSMAL, logg));
        setSvake(velgSvakeSporsmal(ALLE_SPORSMAL, logg, 10));
      });
      return () => {
        aktiv = false;
      };
    }, [])
  );

  const harData = stat.some((s) => s.besvart > 0);

  function farge(prosent: number): string {
    if (prosent >= 80) return farger.riktig;
    if (prosent >= 60) return farger.primarMork;
    return farger.galt;
  }

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      {!harData && (
        <Kort>
          <Text style={stiler.brodtekst}>
            Ingen svar registrert ennå. Ta noen økter, så ser du treffprosenten din her.
          </Text>
        </Kort>
      )}

      {harData && (
        <Kort style={stiler.seksjon}>
          <Text style={stiler.tittel}>Treffprosent per område</Text>
          {OMRADER.map((omrade) => {
            const s = stat.find((x) => x.omrade === omrade.id);
            if (!s || s.prosent === null) {
              return (
                <View key={omrade.id} style={stiler.rad}>
                  <Text style={stiler.radNavn}>
                    {omrade.ikon} {omrade.navn}
                  </Text>
                  <Text style={stiler.radSvak}>ikke øvd ennå</Text>
                </View>
              );
            }
            return (
              <View key={omrade.id} style={stiler.rad}>
                <Text style={stiler.radNavn}>
                  {omrade.ikon} {omrade.navn}
                </Text>
                <Text style={[stiler.radProsent, { color: farge(s.prosent) }]}>
                  {s.prosent} %{" "}
                  <Text style={stiler.radSvak}>({s.riktige}/{s.besvart})</Text>
                </Text>
              </View>
            );
          })}
        </Kort>
      )}

      {svake.length > 0 && (
        <Kort style={stiler.seksjon}>
          <Text style={stiler.tittel}>Dine svakeste spørsmål 🎯</Text>
          {svake.slice(0, 5).map((sporsmal) => (
            <Text key={sporsmal.id} style={stiler.svaktSporsmal} numberOfLines={2}>
              • {sporsmal.sporsmal}
            </Text>
          ))}
          <Knapp
            tittel={`Tren på de ${svake.length} svakeste`}
            onPress={() => router.push({ pathname: "/ovelse/quiz", params: { modus: "svake" } })}
          />
        </Kort>
      )}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl, gap: avstand.m },
  seksjon: { gap: avstand.s },
  tittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  brodtekst: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  rad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: avstand.xs,
  },
  radNavn: { fontSize: 14, color: farger.tekst, flex: 1 },
  radProsent: { fontSize: 15, fontWeight: "700" },
  radSvak: { fontSize: 13, color: farger.tekstSvak, fontWeight: "400" },
  svaktSporsmal: { fontSize: 13, color: farger.tekst, lineHeight: 19 },
});
