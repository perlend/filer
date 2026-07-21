import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Kort } from "@/components/Kort";
import { ALLE_SPORSMAL, OMRADER } from "@/content";
import type { Omrade } from "@/content/types";
import { hentSrsKort, hentSvarlogg } from "@/lib/lagring";
import {
  laereplanProgresjon,
  laereplanSammendrag,
  type MaalProgresjon,
} from "@/lib/laereplan";
import { avstand, farger } from "@/theme";

const IKON: Record<Omrade, string> = Object.fromEntries(
  OMRADER.map((o) => [o.id, o.ikon])
) as Record<Omrade, string>;

function statusFarge(status: MaalProgresjon["status"]): string {
  if (status === "mestret") return farger.riktig;
  if (status === "pabegynt") return farger.primar;
  return farger.kant;
}

function statusTekst(m: MaalProgresjon): string {
  if (m.antall === 0) return "Innhold på vei";
  if (m.status === "mestret") return "Mestret ✅";
  if (m.status === "pabegynt") return `${m.mestret} av ${m.antall} spørsmål sitter`;
  return `${m.antall} spørsmål – ikke påbegynt`;
}

export default function Laereplan() {
  const [progresjon, setProgresjon] = useState<MaalProgresjon[]>([]);

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      (async () => {
        const [srs, logg] = await Promise.all([hentSrsKort(), hentSvarlogg()]);
        if (!aktiv) return;
        setProgresjon(laereplanProgresjon(ALLE_SPORSMAL, srs, logg));
      })();
      return () => {
        aktiv = false;
      };
    }, [])
  );

  const sammendrag = laereplanSammendrag(progresjon);
  const andel =
    sammendrag.maalMedInnhold > 0 ? sammendrag.mestrede / sammendrag.maalMedInnhold : 0;

  return (
    <ScrollView style={stiler.skjerm} contentContainerStyle={stiler.innhold}>
      <Kort style={stiler.sammendragKort}>
        <Text style={stiler.sammendragTall}>
          {sammendrag.mestrede}
          <Text style={stiler.sammendragAv}> / {sammendrag.maalMedInnhold}</Text>
        </Text>
        <Text style={stiler.sammendragTekst}>kompetansemål mestret</Text>
        <View style={stiler.stolpeBakgrunn}>
          <View
            style={[stiler.stolpe, { width: `${Math.round(andel * 100)}%`, backgroundColor: farger.riktig }]}
          />
        </View>
        <Text style={stiler.sammendragUnder}>
          {sammendrag.paabegynte} av {sammendrag.maalMedInnhold} mål påbegynt
        </Text>
      </Kort>

      {progresjon.map((m) => {
        const andelMaal = m.antall > 0 ? m.mestret / m.antall : 0;
        const kanOve = m.antall > 0;
        return (
          <Pressable
            key={m.id}
            disabled={!kanOve}
            onPress={() => router.push({ pathname: "/ovelse/quiz", params: { maal: m.id } })}
          >
            <Kort style={stiler.maalKort}>
              <View style={stiler.maalTopp}>
                <Text style={stiler.maalTittel}>
                  {IKON[m.omrade] ?? "•"} {m.tittel}
                </Text>
                {kanOve && <Text style={stiler.ovLenke}>Øv ›</Text>}
              </View>
              <Text style={stiler.maalBeskrivelse}>{m.beskrivelse}</Text>
              <View style={stiler.stolpeBakgrunn}>
                <View
                  style={[
                    stiler.stolpe,
                    { width: `${Math.round(andelMaal * 100)}%`, backgroundColor: statusFarge(m.status) },
                  ]}
                />
              </View>
              <Text style={[stiler.maalStatus, { color: statusFarge(m.status) }]}>
                {statusTekst(m)}
              </Text>
            </Kort>
          </Pressable>
        );
      })}

      <Text style={stiler.fotnote}>
        Målene er koblet til læreplanen i Vg3 elektrikerfaget (ELE03-04). Ordlyden er forenklet og
        skal kvalitetssikres av fagperson med fagbrev. Et mål regnes som mestret når alle
        spørsmålene har «satt seg» i repetisjonen.
      </Text>
    </ScrollView>
  );
}

const stiler = StyleSheet.create({
  skjerm: { flex: 1, backgroundColor: farger.bakgrunn },
  innhold: { padding: avstand.m, gap: avstand.m, paddingBottom: avstand.xl },
  sammendragKort: { alignItems: "center", gap: avstand.xs },
  sammendragTall: { fontSize: 44, fontWeight: "700", color: farger.riktig },
  sammendragAv: { fontSize: 24, fontWeight: "700", color: farger.tekstSvak },
  sammendragTekst: { fontSize: 15, color: farger.tekst },
  sammendragUnder: { fontSize: 13, color: farger.tekstSvak, marginTop: avstand.xs },
  maalKort: { gap: avstand.s },
  maalTopp: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  maalTittel: { fontSize: 16, fontWeight: "700", color: farger.tekst, flex: 1, paddingRight: avstand.s },
  ovLenke: { fontSize: 14, fontWeight: "700", color: farger.primarMork },
  maalBeskrivelse: { fontSize: 13, color: farger.tekstSvak, lineHeight: 19 },
  maalStatus: { fontSize: 13, fontWeight: "600" },
  stolpeBakgrunn: {
    height: 8,
    borderRadius: 4,
    backgroundColor: farger.kant,
    overflow: "hidden",
    width: "100%",
  },
  stolpe: { height: 8, borderRadius: 4 },
  fotnote: { fontSize: 12, color: farger.tekstSvak, lineHeight: 18, marginTop: avstand.s },
});
