import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { Inndatafelt, tilTall } from "@/components/Inndatafelt";
import { finnCase } from "@/content";
import { erNumeriskRiktig } from "@/lib/okt";
import { avstand, farger } from "@/theme";

interface Svar {
  riktig: boolean;
  valgtIndeks?: number;
  valgtBool?: boolean;
}

export default function CaseSpiller() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sak = id ? finnCase(id) : undefined;

  const [stegIndeks, setStegIndeks] = useState(0);
  const [sporsmalIndeks, setSporsmalIndeks] = useState(-1); // -1 = viser stegintro
  const [svar, setSvar] = useState<Svar | null>(null);
  const [numeriskTekst, setNumeriskTekst] = useState("");
  const [antallRiktige, setAntallRiktige] = useState(0);
  const [totaltBesvart, setTotaltBesvart] = useState(0);

  if (!sak) {
    return (
      <View style={[stiler.skjerm, stiler.midtstilt]}>
        <Text style={stiler.brodtekst}>Fant ikke caset.</Text>
      </View>
    );
  }

  const ferdig = stegIndeks >= sak.steg.length;
  const steg = ferdig ? null : sak.steg[stegIndeks];
  const sporsmal = steg && sporsmalIndeks >= 0 ? steg.sporsmal[sporsmalIndeks] : null;

  function besvar(riktig: boolean, ekstra: Omit<Svar, "riktig"> = {}) {
    if (riktig) setAntallRiktige((n) => n + 1);
    setTotaltBesvart((n) => n + 1);
    setSvar({ riktig, ...ekstra });
  }

  function neste() {
    setSvar(null);
    setNumeriskTekst("");
    if (!steg) return;
    if (sporsmalIndeks + 1 < steg.sporsmal.length) {
      setSporsmalIndeks((n) => n + 1);
    } else {
      setStegIndeks((n) => n + 1);
      setSporsmalIndeks(-1);
    }
  }

  if (ferdig) {
    const prosent = totaltBesvart > 0 ? Math.round((antallRiktige / totaltBesvart) * 100) : 0;
    return (
      <>
        <Stack.Screen options={{ title: sak.tittel }} />
        <View style={[stiler.skjerm, stiler.midtstilt, { padding: avstand.l }]}>
          <Text style={stiler.resultatTittel}>Oppdrag levert! {sak.ikon}</Text>
          <Text style={stiler.resultatTall}>
            {antallRiktige} av {totaltBesvart} riktige ({prosent} %)
          </Text>
          <Text style={[stiler.brodtekst, { textAlign: "center", marginBottom: avstand.l }]}>
            {prosent >= 80
              ? "Solid gjennomføring – du har kontroll på hele løpet fra planlegging til overlevering."
              : "Gå gjennom fasene du bommet på – det er begrunnelsene som teller på fagprøven."}
          </Text>
          <Knapp tittel="Tilbake til casene" onPress={() => router.back()} />
        </View>
      </>
    );
  }

  // Stegintro
  if (steg && sporsmalIndeks === -1) {
    return (
      <>
        <Stack.Screen options={{ title: sak.tittel }} />
        <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
          {stegIndeks === 0 && (
            <Kort style={stiler.seksjon}>
              <Text style={stiler.ingress}>{sak.ingress}</Text>
            </Kort>
          )}
          <Kort style={stiler.seksjon}>
            <Text style={stiler.stegTittel}>{steg.tittel}</Text>
            <Text style={stiler.brodtekst}>{steg.intro}</Text>
          </Kort>
          <Knapp tittel="Start fasen" onPress={() => setSporsmalIndeks(0)} />
        </ScrollView>
      </>
    );
  }

  if (!sporsmal || !steg) return null;

  return (
    <>
      <Stack.Screen options={{ title: sak.tittel }} />
      <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
        <Text style={stiler.teller}>
          {steg.tittel} · oppgave {sporsmalIndeks + 1} av {steg.sporsmal.length}
        </Text>
        <Kort style={{ marginBottom: avstand.s }}>
          <Text style={stiler.sporsmal}>{sporsmal.sporsmal}</Text>
        </Kort>

        {sporsmal.type === "flervalg" && (
          <View style={stiler.alternativer}>
            {sporsmal.alternativer.map((alternativ, n) => {
              const visRiktig = svar !== null && n === sporsmal.riktig;
              const visGalt = svar !== null && svar.valgtIndeks === n && n !== sporsmal.riktig;
              return (
                <Pressable
                  key={n}
                  disabled={svar !== null}
                  onPress={() => besvar(n === sporsmal.riktig, { valgtIndeks: n })}
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

        {sporsmal.type === "santusant" && (
          <View style={stiler.alternativer}>
            {([true, false] as const).map((verdi) => {
              const visRiktig = svar !== null && verdi === sporsmal.riktig;
              const visGalt = svar !== null && svar.valgtBool === verdi && verdi !== sporsmal.riktig;
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
          <View style={{ marginTop: avstand.s }}>
            <Knapp
              tittel={
                sporsmalIndeks + 1 < steg.sporsmal.length
                  ? "Neste oppgave"
                  : stegIndeks + 1 < sak.steg.length
                    ? "Neste fase"
                    : "Fullfør oppdraget"
              }
              onPress={neste}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl },
  midtstilt: { alignItems: "center", justifyContent: "center" },
  seksjon: { gap: avstand.s, marginBottom: avstand.m },
  ingress: { fontSize: 14, color: farger.tekst, lineHeight: 21 },
  stegTittel: { fontSize: 17, fontWeight: "700", color: farger.tekst },
  brodtekst: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  teller: { fontSize: 13, color: farger.tekstSvak, marginBottom: avstand.s },
  sporsmal: { fontSize: 17, fontWeight: "600", color: farger.tekst, lineHeight: 25 },
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
  alternativTekst: { fontSize: 15, color: farger.tekst },
  tilbakemelding: { marginTop: avstand.m, gap: avstand.s },
  tilbakemeldingTittel: { fontSize: 16, fontWeight: "700" },
  fasit: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  forklaring: { fontSize: 14, color: farger.tekst, lineHeight: 21 },
  kilde: { fontSize: 12, color: farger.tekstSvak, fontStyle: "italic" },
  resultatTittel: { fontSize: 24, fontWeight: "700", color: farger.tekst },
  resultatTall: { fontSize: 17, color: farger.tekst, marginVertical: avstand.s },
});
