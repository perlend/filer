import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Kort } from "@/components/Kort";
import { Knapp } from "@/components/Knapp";
import { analyserFoto } from "@/lib/ai/fotoanalyse";
import { hentApiNokkel, lagreApiNokkel, slettApiNokkel } from "@/lib/ai/nokkel";
import { avstand, farger } from "@/theme";

interface ValgtBilde {
  uri: string;
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
}

function tilMediaType(mime: string | undefined): ValgtBilde["mediaType"] {
  if (mime === "image/png" || mime === "image/webp") return mime;
  return "image/jpeg";
}

export default function FotoHjelp() {
  const [apiNokkel, setApiNokkel] = useState<string | null>(null);
  const [nokkelFelt, setNokkelFelt] = useState("");
  const [bilde, setBilde] = useState<ValgtBilde | null>(null);
  const [sporsmal, setSporsmal] = useState("");
  const [svar, setSvar] = useState<string | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [laster, setLaster] = useState(false);

  useEffect(() => {
    void hentApiNokkel().then(setApiNokkel);
  }, []);

  async function velgBilde(fraKamera: boolean) {
    const valg: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.7,
      base64: true,
    };
    if (fraKamera) {
      const tillatelse = await ImagePicker.requestCameraPermissionsAsync();
      if (!tillatelse.granted) {
        setFeil("Appen trenger kameratilgang for å ta bilde.");
        return;
      }
    }
    const resultat = fraKamera
      ? await ImagePicker.launchCameraAsync(valg)
      : await ImagePicker.launchImageLibraryAsync(valg);

    const valgt = resultat.assets?.[0];
    if (resultat.canceled || !valgt?.base64) return;
    setBilde({
      uri: valgt.uri,
      base64: valgt.base64,
      mediaType: tilMediaType(valgt.mimeType),
    });
    setSvar(null);
    setFeil(null);
  }

  async function analyser() {
    if (!bilde || !apiNokkel) return;
    setLaster(true);
    setFeil(null);
    setSvar(null);
    try {
      const tekst = await analyserFoto({
        base64: bilde.base64,
        mediaType: bilde.mediaType,
        sporsmal,
        apiKey: apiNokkel,
      });
      setSvar(tekst);
    } catch (e) {
      setFeil(e instanceof Error ? e.message : "Noe gikk galt under analysen.");
    } finally {
      setLaster(false);
    }
  }

  if (apiNokkel === null) {
    return (
      <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
        <Kort style={stiler.seksjon}>
          <Text style={stiler.tittel}>Koble til Claude 🤖</Text>
          <Text style={stiler.brodtekst}>
            Foto-hjelpen bruker Claude (Anthropic) til å analysere bilder av installasjoner og
            forklare dem opp mot NEK 400. Du trenger en egen API-nøkkel fra{" "}
            platform.claude.com – den lagres kun lokalt på denne enheten.
          </Text>
          <TextInput
            style={stiler.nokkelFelt}
            value={nokkelFelt}
            onChangeText={setNokkelFelt}
            placeholder="sk-ant-…"
            placeholderTextColor={farger.tekstSvak}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <Knapp
            tittel="Lagre nøkkel"
            deaktivert={!nokkelFelt.trim().startsWith("sk-ant-")}
            onPress={() => {
              void lagreApiNokkel(nokkelFelt).then(() => setApiNokkel(nokkelFelt.trim()));
            }}
          />
        </Kort>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Text style={stiler.hjelp}>
        Ta bilde av en installasjon, et produkt eller en montasje – og få forklart hva det er og
        hvilke krav i NEK 400 som gjelder.
      </Text>

      <View style={stiler.knappeRad}>
        <View style={stiler.knappeKolonne}>
          <Knapp tittel="📷 Ta bilde" onPress={() => void velgBilde(true)} />
        </View>
        <View style={stiler.knappeKolonne}>
          <Knapp tittel="🖼️ Galleri" variant="sekundar" onPress={() => void velgBilde(false)} />
        </View>
      </View>

      {bilde && (
        <>
          <Image source={{ uri: bilde.uri }} style={stiler.forhandsvisning} resizeMode="cover" />
          <TextInput
            style={stiler.sporsmalFelt}
            value={sporsmal}
            onChangeText={setSporsmal}
            placeholder="Eget spørsmål (valgfritt), f.eks. «Er dette lov i sone 2?»"
            placeholderTextColor={farger.tekstSvak}
            multiline
          />
          <Knapp
            tittel={laster ? "Analyserer …" : "Analyser bildet"}
            deaktivert={laster}
            onPress={() => void analyser()}
          />
        </>
      )}

      {laster && (
        <View style={stiler.lasteBoks}>
          <ActivityIndicator size="large" color={farger.primar} />
          <Text style={stiler.svakTekst}>Claude ser på bildet … dette kan ta litt tid.</Text>
        </View>
      )}

      {feil && <Text style={stiler.feil}>{feil}</Text>}

      {svar && (
        <Kort style={stiler.svarKort}>
          <Text style={stiler.svarTekst}>{svar}</Text>
          <Text style={stiler.merknad}>
            KI-generert vurdering fra bilde – erstatter ikke kontroll på stedet, måling eller
            normens fulle krav.
          </Text>
        </Kort>
      )}

      <Pressable
        onPress={() => {
          void slettApiNokkel().then(() => {
            setApiNokkel(null);
            setNokkelFelt("");
          });
        }}
      >
        <Text style={stiler.glemNokkel}>Glem API-nøkkelen på denne enheten</Text>
      </Pressable>
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, paddingBottom: avstand.xl, gap: avstand.m },
  seksjon: { gap: avstand.m },
  tittel: { fontSize: 18, fontWeight: "700", color: farger.tekst },
  brodtekst: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  hjelp: { fontSize: 14, color: farger.tekstSvak, lineHeight: 21 },
  nokkelFelt: {
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    backgroundColor: farger.kort,
    paddingHorizontal: avstand.m,
    paddingVertical: 12,
    fontSize: 15,
    color: farger.tekst,
  },
  knappeRad: { flexDirection: "row", gap: avstand.s },
  knappeKolonne: { flex: 1 },
  forhandsvisning: { width: "100%", height: 240, borderRadius: 12 },
  sporsmalFelt: {
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    backgroundColor: farger.kort,
    paddingHorizontal: avstand.m,
    paddingVertical: 12,
    fontSize: 15,
    color: farger.tekst,
    minHeight: 60,
  },
  lasteBoks: { alignItems: "center", gap: avstand.s, paddingVertical: avstand.m },
  svakTekst: { fontSize: 14, color: farger.tekstSvak },
  feil: { color: farger.galt, fontSize: 15 },
  svarKort: { gap: avstand.m },
  svarTekst: { fontSize: 15, color: farger.tekst, lineHeight: 23 },
  merknad: { fontSize: 12, color: farger.tekstSvak, fontStyle: "italic" },
  glemNokkel: {
    fontSize: 13,
    color: farger.tekstSvak,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: avstand.m,
  },
});
