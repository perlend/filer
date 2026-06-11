import { Pressable, StyleSheet, Text } from "react-native";
import { avstand, farger } from "@/theme";

interface KnappProps {
  tittel: string;
  onPress: () => void;
  variant?: "primar" | "sekundar";
  deaktivert?: boolean;
}

export function Knapp({ tittel, onPress, variant = "primar", deaktivert = false }: KnappProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deaktivert}
      style={({ pressed }) => [
        stiler.knapp,
        variant === "primar" ? stiler.primar : stiler.sekundar,
        (pressed || deaktivert) && stiler.dempet,
      ]}
    >
      <Text style={[stiler.tekst, variant === "primar" ? stiler.primarTekst : stiler.sekundarTekst]}>
        {tittel}
      </Text>
    </Pressable>
  );
}

const stiler = StyleSheet.create({
  knapp: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: avstand.l,
    alignItems: "center",
    // Store touch-flater: appen brukes med arbeidsnever
    minHeight: 48,
    justifyContent: "center",
  },
  primar: { backgroundColor: farger.primar },
  sekundar: {
    backgroundColor: farger.kort,
    borderWidth: 1,
    borderColor: farger.kant,
  },
  dempet: { opacity: 0.6 },
  tekst: { fontSize: 16, fontWeight: "600" },
  primarTekst: { color: "#FFFFFF" },
  sekundarTekst: { color: farger.tekst },
});
