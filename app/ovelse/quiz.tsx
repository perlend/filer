import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import { ALLE_SPORSMAL, sporsmalForOmrade } from "@/content";
import type { QuizSporsmal } from "@/content/types";
import {
  hentSrsKort,
  hentSvarlogg,
  lagreSrsKort,
  lagreSvarlogg,
  registrerOkt,
} from "@/lib/lagring";
import { erNumeriskRiktig, velgSporsmalTilOkt } from "@/lib/okt";
import { nyttKort, vurderKort, type SrsKort } from "@/lib/srs";
import { registrerISvarlogg, velgSvakeSporsmal, type Svarlogg } from "@/lib/statistikk";
import { stokkAlternativer, stokkSantUsant } from "@/lib/stokking";
import { avstand, farger } from "@/theme";

const MAKS_PER_OKT = 10;

interface Svar {
  riktig: boolean;
  valgtIndeks?: number;
  valgtBool?: boolean;
}

export default function Quiz() {
  const { omrade, modus } = useLocalSearchParams<{ omrade?: string; modus?: string }>();

  const [okt, setOkt] = useState<QuizSporsmal[] | null>(null);
  const [kortMap, setKortMap] = useState<Record<string, SrsKort>>({});
  const [svarlogg, setSvarlogg] = useState<Svarlogg>({});
  const [indeks, setIndeks] = useState(0);
  const [svar, setSvar] = useState<Svar | null>(null);
  const [antallRiktige, setAntallRiktige] = useState(0);
  const [numeriskTekst, setNumeriskTekst] = useState("");
  const [lagret, setLagret] = useState(false);

  useEffect(() => {
    (async () => {
      const [kort, logg] = await Promise.all([hentSrsKort(), hentSvarlogg()]);
      setKortMap(kort);
      setSvarlogg(logg);
      if (modus === "svake") {
        setOkt(velgSvakeSporsmal(ALLE_SPORSMAL, logg, MAKS_PER_OKT));
      } else {
        const utvalg = omrade ? sporsmalForOmrade(omrade) : ALLE_SPORSMAL;
        setOkt(velgSporsmalTilOkt(utvalg, kort, MAKS_PER_OKT));
      }
    })();
  }, [omrade, modus]);

  const aktivtSporsmal = okt?.[indeks];

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

  // Lagre resultatet når økten er gjennomført
  useEffect(() => {
    if (okt && okt.length > 0 && indeks >= okt.length && !lagret) {
      setLagret(true);
      void Promise.all([lagreSrsKort(kortMap), lagreSvarlogg(svarlogg)]).then(() =>
        registrerOkt(okt.length, antallRiktige)
      );
    }
  }, [okt, indeks, lagret, kortMap, svarlogg, antallRiktige]);

  if (okt === null) {
    return (
      <View style={[stiler.skjerm, stiler.midtstilt]}>
        <Text style={stiler.svakTekst}>Laster …</Text>
      </View>
    );
  }

  if (okt.length === 0) {
    return (
      <View style={[stiler.skjerm, stiler.midtstilt, { padding: avstand.l }]}>
        <Text style={stiler.oppsummeringTittel}>Alt repetert! 🎉</Text>
        <Text style={[stiler.svakTekst, { textAlign: "center", marginVertical: avstand.m }]}>
          Ingen spørsmål venter akkurat nå. Kom tilbake i morgen – repetisjonene forfaller etter
          hvert som tiden går.
        </Text>
        <Knapp tittel="Tilbake" onPress={() => router.back()} />
      </View>
    );
  }

  const ferdig = indeks >= okt.length;

  if (ferdig) {
    const prosent = Math.round((antallRiktige / okt.length) * 100);
    return (
      <View style={[stiler.skjerm, stiler.midtstilt, { padding: avstand.l }]}>
        <Text style={stiler.oppsummeringTittel}>
          {prosent >= 80 ? "Sterkt! 💪" : prosent >= 50 ? "Godt jobbet!" : "Du er i gang!"}
        </Text>
        <Text style={stiler.oppsummeringTall}>
          {antallRiktige} av {okt.length} riktige
        </Text>
        <Text style={[stiler.svakTekst, { textAlign: "center", marginBottom: avstand.l }]}>
          Spørsmålene du bommet på kommer tilbake i morgen. De du kan, venter lenger – sånn fester
          kunnskapen seg.
        </Text>
        <Knapp tittel="Ferdig" onPress={() => router.back()} />
      </View>
    );
  }

  const sporsmal = okt[indeks];

  function besvar(riktig: boolean, ekstra: Omit<Svar, "riktig"> = {}) {
    const kort = kortMap[sporsmal.id] ?? nyttKort(sporsmal.id);
    setKortMap({ ...kortMap, [sporsmal.id]: vurderKort(kort, riktig) });
    setSvarlogg(registrerISvarlogg(svarlogg, sporsmal.id, riktig));
    if (riktig) setAntallRiktige((n) => n + 1);
    setSvar({ riktig, ...ekstra });
  }

  function neste() {
    setSvar(null);
    setNumeriskTekst("");
    setIndeks((n) => n + 1);
  }

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Text style={stiler.teller}>
        Spørsmål {indeks + 1} av {okt.length}
      </Text>
      <Kort style={{ marginBottom: avstand.m }}>
        <Text style={stiler.sporsmal}>{sporsmal.sporsmal}</Text>
      </Kort>

      {sporsmal.type === "flervalg" && stokketFlervalg && (
        <View style={stiler.alternativer}>
          {stokketFlervalg.alternativer.map((alternativ, n) => {
            const valgt = svar?.valgtIndeks === n;
            const visRiktig = svar !== null && n === stokketFlervalg.riktigIndeks;
            const visGalt = svar !== null && valgt && n !== stokketFlervalg.riktigIndeks;
            return (
              <Pressable
                key={n}
                disabled={svar !== null}
                onPress={() => besvar(n === stokketFlervalg.riktigIndeks, { valgtIndeks: n })}
                style={[
                  stiler.alternativ,
                  visRiktig && stiler.alternativRiktig,
                  visGalt && stiler.alternativGalt,
                ]}
              >
                <Text style={stiler.alternativTekst}>{alternativ}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {sporsmal.type === "santusant" && stokketSantUsant && (
        <View style={stiler.alternativer}>
          {stokketSantUsant.map((verdi) => {
            const valgt = svar?.valgtBool === verdi;
            const visRiktig = svar !== null && verdi === sporsmal.riktig;
            const visGalt = svar !== null && valgt && verdi !== sporsmal.riktig;
            return (
              <Pressable
                key={String(verdi)}
                disabled={svar !== null}
                onPress={() => besvar(verdi === sporsmal.riktig, { valgtBool: verdi })}
                style={[
                  stiler.alternativ,
                  visRiktig && stiler.alternativRiktig,
                  visGalt && stiler.alternativGalt,
                ]}
              >
                <Text style={stiler.alternativTekst}>{verdi ? "Sant" : "Usant"}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {sporsmal.type === "numerisk" && svar === null && (
        <View>
          <Inndatafelt
            etikett="Ditt svar"
            verdi={numeriskTekst}
            onEndre={setNumeriskTekst}
            enhet={sporsmal.enhet}
            plassholder="0"
          />
          <Knapp
            tittel="Svar"
            deaktivert={numeriskTekst.trim() === ""}
            onPress={() =>
              besvar(erNumeriskRiktig(tilTall(numeriskTekst), sporsmal.svar, sporsmal.toleranse))
            }
          />
        </View>
      )}

      {svar !== null && (
        <Kort
          style={[
            stiler.tilbakemelding,
            { backgroundColor: svar.riktig ? farger.riktigBakgrunn : farger.galtBakgrunn },
          ]}
        >
          <Text
            style={[
              stiler.tilbakemeldingTittel,
              { color: svar.riktig ? farger.riktig : farger.galt },
            ]}
          >
            {svar.riktig ? "Riktig! ✅" : "Ikke helt. ❌"}
          </Text>
          {sporsmal.type === "numerisk" && (
            <Text style={stiler.fasit}>
              Fasit: {sporsmal.svar.toLocaleString("nb-NO")} {sporsmal.enhet}
            </Text>
          )}
          <Text style={stiler.forklaring}>{sporsmal.forklaring}</Text>
          <Text style={stiler.kilde}>Kilde: {sporsmal.kilde}</Text>
        </Kort>
      )}

      {svar !== null && (
        <View style={{ marginTop: avstand.m }}>
          <Knapp
            tittel={indeks + 1 < okt.length ? "Neste spørsmål" : "Se resultat"}
            onPress={neste}
          />
        </View>
      )}
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl },
  midtstilt: { alignItems: "center", justifyContent: "center" },
  teller: { fontSize: 13, color: farger.tekstSvak, marginBottom: avstand.s },
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
  alternativRiktig: { backgroundColor: farger.riktigBakgrunn, borderColor: farger.riktig },
  alternativGalt: { backgroundColor: farger.galtBakgrunn, borderColor: farger.galt },
  alternativTekst: { fontSize: 16, color: farger.tekst },
  tilbakemelding: { marginTop: avstand.m, gap: avstand.s },
  tilbakemeldingTittel: { fontSize: 16, fontWeight: "700" },
  fasit: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  forklaring: { fontSize: 15, color: farger.tekst, lineHeight: 22 },
  kilde: { fontSize: 13, color: farger.tekstSvak, fontStyle: "italic" },
  svakTekst: { fontSize: 15, color: farger.tekstSvak },
  oppsummeringTittel: { fontSize: 26, fontWeight: "700", color: farger.tekst },
  oppsummeringTall: { fontSize: 18, color: farger.tekst, marginVertical: avstand.s },
});
