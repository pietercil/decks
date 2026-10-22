# Decks

Presentaties en handleidingen, gehost via GitHub Pages.

| Deck | Map | Inhoud |
|---|---|---|
| Skills for Real Engineers | [`mattpocock-skills/`](mattpocock-skills/) | De agent skills van Matt Pocock: 10 slides overzicht (±10 min) en een naslag met elke skill. Nederlands en Engels |

## Lokaal bekijken

Geen build, geen dependencies. Lettertypes komen van Google Fonts; zonder internet valt het deck terug op systeemfonts.

```bash
python3 -m http.server 8000
# open http://localhost:8000/mattpocock-skills/
```

Serveer de root van de repo, niet de map van een deck: stijl en engine staan in `_shared/`.

## Presenteren

Alle opties staan in het **☰-menu** rechtsboven (of druk op **?**), en ook op de laatste slide.

| Toets | Actie |
|---|---|
| → / spatie / PageDown | volgende stap (eerst de blokken van de slide, dan de volgende slide) |
| ← / PageUp | vorige stap |
| Home / End | eerste / laatste slide |
| **?** | menu |
| **P** | presenter view: notes per klikstap, timer met budget, volgende slide |
| **H** | handout-modus: alles meteen zichtbaar |
| **O** | overzicht van alle slides |
| **T** | licht / donker |
| **B** of **.** | zwart scherm |
| **F** | volledig scherm |
| **L** | taal wisselen (NL / EN) |
| Esc | menu / kaart / overzicht / zwart scherm sluiten |

Klik op een `/skill` om zijn kaart te openen, en op een gestippeld onderlijnd begrip voor zijn uitleg (alle begrippen staan ook op de slides *Begrippen* in de naslag). Op tablet en telefoon: swipen om te navigeren.

**Handout-modus** wordt onthouden in de browser; een geel label **Handout ✕** linksboven toont dat hij aanstaat (klik om uit te zetten).
De presenter view openen zet hem in alle vensters uit.

**PDF** opent een printvenster: kies *Opslaan als PDF*. *PDF: slides* geeft één liggende pagina per slide,
*PDF: met notities* een staande pagina met de speaker notes onder elke slide. Beide altijd in het lichte thema.

### URL-opties

Elke optie uit het menu werkt ook als link:

- `?lang=en` / `?lang=nl`: start in die taal (anders de laatst gekozen taal, dan de taal van de browser)
- `?all`: handout-modus (wint van wat de browser onthouden heeft)
- `?theme=dark`: start in het donkere thema
- `#7` of `#build`: open op slide 7, of op de slide met die id
- `?print` / `?print&notes`: de twee PDF-varianten
- `?presenter`: de presenter view
- `?debug`: toont ontbrekende vertalingen in de console

### Speaker notes

In `n.<slide-id>` in `i18n/nl.js`. `[→]` markeert waar een klik het volgende blok toont: de presenter view markeert de alinea
van de huidige stap. Houd het aantal `[→]` gelijk aan het aantal klikstappen op de slide.

## Structuur

| Wat | Waar |
|---|---|
| Stijl (Pietercil-branding), engine, helpers, logo | `_shared/` |
| Slideteksten en speaker notes (`n.<slide-id>`) | `<deck>/i18n/nl.js`, `<deck>/i18n/en.js` (zelfde sleutels) |
| Slide-opbouw en tijdsbudget per hoofdstuk | `<deck>/js/slides.js` |
| Skills: fase, wie start hem, wat roept hij aan | `mattpocock-skills/js/skills.js` |
| Begrippen: skills en bronlink | `DECK.terms` in `mattpocock-skills/js/skills.js`; tekst in `term.<id>.*`, en `[[id]]` of `[[id\|label]]` in eender welke tekst maakt er een klikbaar begrip van |

Een taal toevoegen: maak `i18n/fr.js` met dezelfde sleutels en laad het in `index.html`. De taalknoppen verschijnen dan vanzelf.
Pas na een wijziging het `?v=`-nummer op de script- en stylesheet-tags aan, zodat browsers geen oude kopie tonen.

## Bronnen

De inhoud van `mattpocock-skills/` volgt [mattpocock/skills](https://github.com/mattpocock/skills) **v1.3.1**
(README, `ask-matt` en elke `SKILL.md` uit `engineering/` en `productivity/`). De repo verandert vaak: controleer vóór je presenteert.
