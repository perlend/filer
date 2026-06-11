import { StyleSheet, View, type ViewProps } from "react-native";
import { avstand, farger } from "@/theme";

export function Kort({ style, ...props }: ViewProps) {
  return <View style={[stiler.kort, style]} {...props} />;
}

const stiler = StyleSheet.create({
  kort: {
    backgroundColor: farger.kort,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: farger.kant,
    padding: avstand.m,
  },
});
