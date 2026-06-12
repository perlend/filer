# Romviz

App for å visualisere rom med nye veggfarger og møbler, og lagre favoritter.
Se planen i [`../docs/romvisualisering-plan.md`](../docs/romvisualisering-plan.md).

## Kom i gang

```sh
cd romviz
npm install
npm start          # åpne i Expo Go på telefonen, eller trykk w for web
```

## Gemini-nøkkel

Genereringen bruker Google Gemini (bilderedigering). Lag en nøkkel på
[aistudio.google.com](https://aistudio.google.com/) og lim den inn i appen under
**Innstillinger**. Nøkkelen lagres kun lokalt (SecureStore). Uten nøkkel kjører
appen i demomodus: hele flyten fungerer, men «resultatet» er originalbildet.

## Status (fase 1)

- [x] Velge bilde av rommet
- [x] Velge veggfarge (paletter + egen hex/NCS-kode)
- [x] Beskrive møbler i fritekst
- [x] Generering via Gemini med foto-input (eller demomodus uten nøkkel)
- [x] Før/etter-visning (hold inne på bildet)
- [x] Favoritter lagret lokalt (AsyncStorage + lokale bildekopier)
- [ ] Fase 2: Supabase – delte favoritter mellom to brukere
- [ ] Fase 3: møbelbibliotek, flere varianter per generering
