import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * HTML-skallet for web-versjonen. Viktigst her er 100dvh:
 * mobilnettlesere (særlig Safari) legger adresselinjen over innhold
 * som bruker 100 %/100vh – dvh følger den synlige flaten dynamisk,
 * så fanelinja alltid ligger over nettleser-baren.
 */
export default function Rot({ children }: PropsWithChildren) {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#FFFFFF" />
        <title>Lærling</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const css = `
html, body, #root {
  height: 100%;
}
@supports (height: 100dvh) {
  html, body, #root {
    height: 100dvh;
  }
}
body {
  overflow: hidden;
  overscroll-behavior-y: none;
  background-color: #F4F6F8;
  /* Hjem-indikatoren på iPhone når appen er lagt til Hjem-skjermen */
  padding-bottom: env(safe-area-inset-bottom);
}
`;
