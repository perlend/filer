import { useCallback, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import {
  EFOBASEN_URL,
  HOVEDGRUPPER,
  PRODUKTFORSLAG,
  erGyldigElnummer,
  formaterElnummer,
  hentMineElnummer,
  lagreMineElnummer,
  type ElnummerOppforing,
} from "@/lib/elnummer";
import { avstand, farger } from "@/theme";

export default function ElnummerSide() {
  const [mine, setMine] = useState<ElnummerOppforing[]>([]);
  const [nyttNummer, setNyttNummer] = useState("");
  const [nyttNavn, setNyttNavn] = useState("");
  const [sok, setSok] = useState("");

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      void hentMineElnummer().then((liste) => aktiv && setMine(liste));
      return () => {
        aktiv = false;
      };
    }, [])
  );

  const kanLeggeTil = erGyldigElnummer(nyttNummer) && nyttNavn.trim().length > 0;

  async function leggTil() {
    const ny: ElnummerOppforing = {
      id: `${Date.now()}`,
      elnummer: nyttNummer.trim(),
      navn: nyttNavn.trim(),
    };
    const oppdatert = [...mine, ny].sort((a, b) => a.navn.localeCompare(b.navn, "nb"));
    setMine(oppdatert);
    setNyttNummer("");
    setNyttNavn("");
    await lagreMineElnummer(oppdatert);
  }

  async function slett(id: string) {
    const oppdatert = mine.filter((e) => e.id !== id);
    setMine(oppdatert);
    await lagreMineElnummer(oppdatert);
  }

  const filtrert = sok.trim()
    ? mine.filter(
        (e) =>
          e.navn.toLowerCase().includes(sok.trim().toLowerCase()) ||
          e.elnummer.includes(sok.trim().replace(/\s/g, ""))
      )
    : mine;

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Kort style={stiler.seksjon}>
        <Text style={stiler.tittel}>Hva er et elnummer?</Text>
        <Text style={stiler.brodtekst}>
          Et elnummer er et unikt 7-sifret produktnummer for elektromateriell i Norge. De to
          første sifrene angir hovedgruppen. Numrene tildeles via EFObasen – bransjens felles
          produktdatabase med rundt 250 000 produkter. Det er der du slår opp alt.
        </Text>
        <Knapp tittel="Åpne EFObasen 🔎" onPress={() => void Linking.openURL(EFOBASEN_URL)} />
      </Kort>

      <Kort style={stiler.seksjon}>
        <Text style={stiler.tittel}>Hovedgrupper (utdrag)</Text>
        {HOVEDGRUPPER.map((gruppe) => (
          <View key={gruppe.serie} style={stiler.gruppeRad}>
            <Text style={stiler.gruppeSerie}>{gruppe.serie}</Text>
            <View style={stiler.gruppeTekst}>
              <Text style={stiler.gruppeNavn}>{gruppe.navn}</Text>
              <Text style={stiler.gruppeBeskrivelse}>{gruppe.beskrivelse}</Text>
            </View>
          </View>
        ))}
        <Text style={stiler.merknad}>
          Full gruppeoversikt og alle produktnumre finner du i EFObasen.
        </Text>
      </Kort>

      <Kort style={stiler.seksjon}>
        <Text style={stiler.tittel}>Mine elnummer ⭐</Text>
        <Text style={stiler.brodtekst}>
          Lagre numrene du bruker oftest, så har du dem alltid for hånden – også uten dekning.
        </Text>

        <TextInput
          style={stiler.felt}
          value={nyttNummer}
          onChangeText={setNyttNummer}
          placeholder="Elnummer (7 siffer)"
          placeholderTextColor={farger.tekstSvak}
          keyboardType="number-pad"
          maxLength={7}
        />
        <TextInput
          style={stiler.felt}
          value={nyttNavn}
          onChangeText={setNyttNavn}
          placeholder="Produktnavn, f.eks. PFXP 3G2,5"
          placeholderTextColor={farger.tekstSvak}
        />
        <Knapp tittel="Legg til" deaktivert={!kanLeggeTil} onPress={() => void leggTil()} />

        <Text style={stiler.forslagTittel}>Vanlige produkter å registrere:</Text>
        <View style={stiler.forslagRad}>
          {PRODUKTFORSLAG.map((forslag) => (
            <Pressable key={forslag} style={stiler.forslagChip} onPress={() => setNyttNavn(forslag)}>
              <Text style={stiler.forslagTekst}>{forslag}</Text>
            </Pressable>
          ))}
        </View>
      </Kort>

      {mine.length > 0 && (
        <Kort style={stiler.seksjon}>
          <TextInput
            style={stiler.felt}
            value={sok}
            onChangeText={setSok}
            placeholder="Søk i mine elnummer …"
            placeholderTextColor={farger.tekstSvak}
          />
          {filtrert.map((oppforing) => (
            <View key={oppforing.id} style={stiler.oppforingRad}>
              <View style={stiler.oppforingTekst}>
                <Text style={stiler.oppforingNummer}>{formaterElnummer(oppforing.elnummer)}</Text>
                <Text style={stiler.oppforingNavn}>{oppforing.navn}</Text>
              </View>
              <Pressable onPress={() => void slett(oppforing.id)} hitSlop={12}>
                <Text style={stiler.slett}>✕</Text>
              </Pressable>
            </View>
          ))}
          {filtrert.length === 0 && <Text style={stiler.merknad}>Ingen treff.</Text>}
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
  gruppeRad: { flexDirection: "row", gap: avstand.s, alignItems: "flex-start" },
  gruppeSerie: {
    fontSize: 16,
    fontWeight: "700",
    color: farger.primarMork,
    width: 28,
  },
  gruppeTekst: { flex: 1 },
  gruppeNavn: { fontSize: 15, fontWeight: "600", color: farger.tekst },
  gruppeBeskrivelse: { fontSize: 13, color: farger.tekstSvak, lineHeight: 19 },
  merknad: { fontSize: 12, color: farger.tekstSvak, fontStyle: "italic" },
  felt: {
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    backgroundColor: farger.kort,
    paddingHorizontal: avstand.m,
    paddingVertical: 12,
    fontSize: 15,
    color: farger.tekst,
  },
  forslagTittel: { fontSize: 13, color: farger.tekstSvak, marginTop: avstand.s },
  forslagRad: { flexDirection: "row", flexWrap: "wrap", gap: avstand.s },
  forslagChip: {
    backgroundColor: farger.bakgrunn,
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 16,
    paddingHorizontal: avstand.m,
    paddingVertical: 6,
  },
  forslagTekst: { fontSize: 13, color: farger.tekst },
  oppforingRad: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: farger.kant,
    paddingVertical: avstand.s,
  },
  oppforingTekst: { flex: 1 },
  oppforingNummer: { fontSize: 16, fontWeight: "700", color: farger.primarMork },
  oppforingNavn: { fontSize: 14, color: farger.tekst },
  slett: { fontSize: 16, color: farger.tekstSvak, padding: avstand.xs },
});
