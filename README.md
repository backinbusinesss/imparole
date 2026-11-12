# Imparole — sito web

Nuovo sito per **Imparole**, Centro per l'Infanzia e la Famiglia (Cooperativa Sociale): Cernusco sul Naviglio, Milano, Vimodrone e Seveso.

Sito statico in HTML, CSS e JavaScript, senza build né dipendenze.

## Struttura

```
index.html            pagina principale
assets/css/style.css  stile (token colore e tipografia in :root)
assets/js/main.js     menu mobile, schede età, lettere-tessera trascinabili
assets/favicon.svg
```

## Vederlo in locale

```bash
python -m http.server 5173
```

Poi apri http://localhost:5173.

## Design

- **Font:** Bricolage Grotesque (titoli) e Atkinson Hyperlegible (testo, pensato per la massima leggibilità).
- **Colori:** indaco `#1E1A4D`, viola `#5B3FD9`, giallo `#FFC93C`, menta `#2FB892`, corallo `#FF7A6B`.
- **Elemento chiave:** il nome composto con lettere-tessera, "im" + "parole".

## Pubblicazione

Si può pubblicare con GitHub Pages (Settings → Pages → branch `main`, cartella `/`).
