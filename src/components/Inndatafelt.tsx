import { StyleSheet, Text, TextInput, View } from "react-native";
import { avstand, farger } from "@/theme";

interface InndatafeltProps {
  etikett: string;
  verdi: string;
  onEndre: (tekst: string) => void;
  enhet?: string;
  plassholder?: string;
}

/** Tallfelt som godtar både komma og punktum som desimaltegn. */
export function Inndatafelt({ etikett, verdi, onEndre, enhet, plassholder }: InndatafeltProps) {
  return (
    <View style={stiler.rad}>
      <Text style={stiler.etikett}>{etikett}</Text>
      <View style={stiler.feltRad}>
        <TextInput
          style={stiler.felt}
          value={verdi}
          onChangeText={onEndre}
          keyboardType="decimal-pad"
          placeholder={plassholder}
          placeholderTextColor={farger.tekstSvak}
        />
        {enhet ? <Text style={stiler.enhet}>{enhet}</Text> : null}
      </View>
    </View>
  );
}

/** Tolker norsk tallformat ("2,5") til number. NaN hvis tomt/ugyldig. */
export function tilTall(tekst: string): number {
  return Number.parseFloat(tekst.trim().replace(",", "."));
}

const stiler = StyleSheet.create({
  rad: { marginBottom: avstand.m },
  etikett: { fontSize: 14, color: farger.tekstSvak, marginBottom: avstand.xs },
  feltRad: { flexDirection: "row", alignItems: "center" },
  felt: {
    flex: 1,
    borderWidth: 1,
    borderColor: farger.kant,
    borderRadius: 10,
    backgroundColor: farger.kort,
    paddingHorizontal: avstand.m,
    paddingVertical: 12,
    fontSize: 18,
    color: farger.tekst,
  },
  enhet: { marginLeft: avstand.s, fontSize: 16, color: farger.tekstSvak, width: 40 },
});
