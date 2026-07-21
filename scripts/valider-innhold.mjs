// Validerer faginnholdet i content/ mot formatreglene
// (kjøres med: npm run valider)
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const rot = new URL("..", import.meta.url).pathname;
const feil = [];
const ids = new Set();

const GYLDIGE_OMRADER = ["elsikkerhet", "teori", "maaling", "installasjon", "regelverk"];

// Kanonisk kompetansemål-kart – hvert kompetansemål i innholdet må finnes her,
// ellers kan ikke progresjonen mot læreplanen telles (se src/content/kompetansemaal.ts).
const kompetansemaalKart = JSON.parse(
  readFileSync(join(rot, "content/kompetansemaal.json"), "utf8")
);
const KJENTE_KOMPETANSEMAAL = new Set(Object.keys(kompetansemaalKart.kart));

function sjekkFelles(fil, e) {
  if (!e.id) feil.push(`${fil}: mangler id`);
  else if (ids.has(e.id)) feil.push(`${fil}: duplisert id «${e.id}»`);
  else ids.add(e.id);
  if (!GYLDIGE_OMRADER.includes(e.omrade)) feil.push(`${fil}: ukjent område «${e.omrade}» (${e.id})`);
  if (!Array.isArray(e.kompetansemaal) || e.kompetansemaal.length === 0)
    feil.push(`${fil}: ${e.id} mangler kompetansemål`);
  else
    for (const km of e.kompetansemaal)
      if (!KJENTE_KOMPETANSEMAAL.has(km))
        feil.push(
          `${fil}: ${e.id} har ukjent kompetansemål «${km}» – legg det til i content/kompetansemaal.json`
        );
}

for (const fil of readdirSync(join(rot, "content/quiz"))) {
  const sti = join(rot, "content/quiz", fil);
  const sporsmal = JSON.parse(readFileSync(sti, "utf8"));
  for (const s of sporsmal) sjekkSporsmal(fil, s);
}

function sjekkSporsmal(fil, s) {
  sjekkFelles(fil, s);
  if (!s.forklaring || s.forklaring.length < 30)
    feil.push(`${fil}: ${s.id} har for kort forklaring – den skal lære bort noe`);
  if (!s.kilde) feil.push(`${fil}: ${s.id} mangler kildehenvisning`);
  if (![1, 2, 3].includes(s.vanskelighetsgrad))
    feil.push(`${fil}: ${s.id} har ugyldig vanskelighetsgrad`);
  if (s.type === "flervalg") {
    if (!Array.isArray(s.alternativer) || s.alternativer.length < 2)
      feil.push(`${fil}: ${s.id} har for få alternativer`);
    else if (!Number.isInteger(s.riktig) || s.riktig < 0 || s.riktig >= s.alternativer.length)
      feil.push(`${fil}: ${s.id} har riktig-indeks utenfor alternativene`);
  } else if (s.type === "santusant") {
    if (typeof s.riktig !== "boolean") feil.push(`${fil}: ${s.id} mangler boolsk fasit`);
  } else if (s.type === "numerisk") {
    if (typeof s.svar !== "number" || typeof s.toleranse !== "number" || typeof s.enhet !== "string")
      feil.push(`${fil}: ${s.id} mangler svar/toleranse/enhet`);
  } else {
    feil.push(`${fil}: ${s.id} har ukjent type «${s.type}»`);
  }
}

for (const fil of readdirSync(join(rot, "content/case"))) {
  const sak = JSON.parse(readFileSync(join(rot, "content/case", fil), "utf8"));
  if (!sak.id || !sak.tittel || !sak.ingress) feil.push(`${fil}: case mangler id/tittel/ingress`);
  if (ids.has(sak.id)) feil.push(`${fil}: duplisert id «${sak.id}»`);
  else ids.add(sak.id);
  if (!Array.isArray(sak.steg) || sak.steg.length < 2)
    feil.push(`${fil}: ${sak.id} skal ha minst to faser`);
  for (const steg of sak.steg ?? []) {
    if (!steg.tittel || !steg.intro) feil.push(`${fil}: fase mangler tittel/intro`);
    for (const s of steg.sporsmal ?? []) sjekkSporsmal(fil, s);
  }
}

function* leksjonsFiler(katalog) {
  for (const navn of readdirSync(katalog, { withFileTypes: true })) {
    const sti = join(katalog, navn.name);
    if (navn.isDirectory()) yield* leksjonsFiler(sti);
    else if (navn.name.endsWith(".json")) yield sti;
  }
}

for (const sti of leksjonsFiler(join(rot, "content/leksjoner"))) {
  const fil = sti.slice(rot.length);
  const l = JSON.parse(readFileSync(sti, "utf8"));
  sjekkFelles(fil, l);
  if (!l.tittel) feil.push(`${fil}: mangler tittel`);
  if (!Array.isArray(l.seksjoner) || l.seksjoner.length < 2)
    feil.push(`${fil}: ${l.id} skal ha minst «Tenk først» og teori-seksjon`);
  else if (!l.seksjoner[0].tittel.startsWith("Tenk først"))
    feil.push(`${fil}: ${l.id} skal starte med en «Tenk først»-seksjon (oppgave før teori)`);
  if (!Array.isArray(l.huskepunkter) || l.huskepunkter.length < 2)
    feil.push(`${fil}: ${l.id} skal ha minst to huskepunkter`);
}

if (feil.length > 0) {
  console.error(`❌ ${feil.length} feil i innholdet:\n` + feil.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✅ Innholdet er gyldig (${ids.size} enheter validert).`);
