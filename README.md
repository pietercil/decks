# Decks

Presentaties en handleidingen, gehost via GitHub Pages.

| Deck | Map | Inhoud |
|---|---|---|
| Skills for Real Engineers | [`mattpocock-skills/`](mattpocock-skills/) | De agent skills van Matt Pocock: 10 slides overzicht (±10 min) en een naslag met elke skill |

## Lokaal bekijken

Geen build, geen dependencies. Lettertypes komen van Google Fonts; zonder internet valt het deck terug op systeemfonts.

```bash
python3 -m http.server 8000
# open http://localhost:8000/mattpocock-skills/
```

Serveer de root van de repo, niet de map van een deck: stijl en engine staan in `_shared/`.

## Presenteren

| Toets | Actie |
|---|---|
| → / spatie / PageDown | volgende stap (eerst fragmenten, dan de volgende slide) |
| ← / PageUp | vorige stap |
| Home / End | eerste / laatste slide |
| **P** | presenter view: notes, timer met budget, volgende slide |
| **O** | overzicht van alle slides |
| **T** | licht / donker |
| **B** of **.** | zwart scherm |
| **F** | volledig scherm |
| Esc | kaart / overzicht / zwart scherm sluiten |

Klik op een `/skill` om zijn kaart te openen. Op tablet en telefoon: swipen om te navigeren.

### URL-opties

- `?theme=dark`: start in het donkere thema
- `#7` of `#build`: open op slide 7, of op de slide met die id
- `?all`: alle fragmenten meteen zichtbaar (handout-modus)
- `?print`: alle slides onder elkaar, dan het printvenster: bewaar als PDF op 1600×900
- `?debug`: toont ontbrekende vertalingen in de console

## Structuur

| Wat | Waar |
|---|---|
| Stijl (Pietercil-branding), engine, helpers, logo | `_shared/` |
| Slideteksten en speaker notes (`n.<slide-id>`) | `<deck>/i18n/nl.js` |
| Slide-opbouw en tijdsbudget per hoofdstuk | `<deck>/js/slides.js` |
| Skills: fase, wie start hem, wat roept hij aan | `mattpocock-skills/js/skills.js` |

Een taal toevoegen: maak `i18n/fr.js` met dezelfde sleutels en laad het in `index.html`. De taalknoppen verschijnen dan vanzelf.
Pas na een wijziging het `?v=`-nummer op de script- en stylesheet-tags aan, zodat browsers geen oude kopie tonen.

## Bronnen

De inhoud van `mattpocock-skills/` volgt [mattpocock/skills](https://github.com/mattpocock/skills) **v1.3.1**
(README, `ask-matt` en elke `SKILL.md` uit `engineering/` en `productivity/`). De repo verandert vaak: controleer vóór je presenteert.
