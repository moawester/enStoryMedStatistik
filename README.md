# Röstar vi olika beroende på var vi bor?

Detta projekt undersöker hur röstningen förändrats mellan riksdagsvalen 2018 och 2022, och om geografi påverkar hur människor röstar.

Syftet är att förstå om Sverige visar tecken på ökade politiska skillnader mellan olika typer av områden, samt att undersöka om ekonomiska skillnader mellan kommuner kan bidra till att förklara dessa mönster.

---

## Frågeställning

- Finns det skillnader mellan stad och landsbygd?
- Är vissa partier starkare i olika delar av landet?
- Har dessa skillnader förändrats över tid?
- Kan ekonomiska skillnader mellan kommuner kopplas till röstningsmönster?

---

## Hypotes

Vi utgår från att människor röstar olika beroende på var de bor.

Skillnader i livsvillkor, ekonomi, utbildning och demografi påverkar sannolikt röstbeteendet.  
Vi förväntar oss därför att förändringen i partistöd skiljer sig mellan olika geografiska områden – särskilt mellan stad och landsbygd.

Vi antar även att ekonomiska skillnader mellan kommuner kan vara en faktor som hänger ihop med hur människor röstar.

---

## Analysens delar

Projektet är uppdelat i fyra perspektiv:

### Regionala skillnader
Jämförelse mellan olika län för att se hur partistöd varierar geografiskt.

### Stad och landsbygd
Analys av hur befolkningstäthet påverkar förändringar i röstningen.

### Geografiska trender
Identifiering av var i landet de största förändringarna har skett mellan 2018 och 2022.

### Inkomst och röstning
Analys av hur nettoinkomsten förändrats mellan kommuner och hur detta kan relateras till geografiska skillnader i röstning.

---

## Metod

Vi använder två typer av data:

### Valdata
Förändringar i partistöd mäts i **procentenheter** mellan valen 2018 och 2022.

- Positivt värde = partiet har ökat sitt stöd  
- Negativt värde = partiet har minskat sitt stöd  

### Inkomstdata
Nettoinkomst från SCB används för åren 2018 och 2022.

- Förändring mäts i **tkr (tusen kronor)**  
- Visar hur inkomster utvecklats i olika kommuner  

---

## Teknik & verktyg

### Databaser

- Neo4j – används för att lagra och analysera valdata  
- MongoDB – används för demografiska och ekonomiska data  
- SQLite – används för befolkning och inkomstdata  
- MySQL – används för geografisk data  

### Verktyg

- DBeaver – används för att hantera och utforska databaser  

### Visualisering

- Google Charts – används för att skapa diagram och visualisera data  

---

## Datakällor och datakvalitet

### SCB – Riksdagsval 2018 & 2022
Officiella valresultat på kommunnivå.  
**Trovärdighet:** Mycket hög  
**Datakvalitet:** Exakta siffror, men visar inte orsaker bakom röstning  

---

### SCB – Befolkning och befolkningstäthet
Används för att dela in kommuner i stad och landsbygd.  
**Trovärdighet:** Mycket hög  
**Datakvalitet:** Ger tydlig bild av täthet  

---

### SCB – Nettoinkomst (2018 & 2022)
Används för att analysera ekonomiska skillnader mellan kommuner.  
**Trovärdighet:** Mycket hög  
**Datakvalitet:** Tillförlitlig statistik, men är inte direkt kopplad till röstningsdata i analysen  

---

## Begränsningar

- Analysen kopplar inte direkt ihop inkomst och röstning på individnivå  
- Socioekonomiska faktorer analyseras endast översiktligt  
- Resultaten visar samband, men inte orsakssamband  

---

## Slutsats

Projektet visar att röstningen i Sverige skiljer sig beroende på geografi.

Det finns tydliga skillnader mellan stad och landsbygd samt mellan olika regioner.  
Inkomstanalysen visar även att ekonomiska skillnader mellan kommuner är stora och varierar över landet.

Däremot visar analysen inte att inkomst direkt orsakar ett visst röstbeteende.  
Istället tyder resultaten på att ekonomi kan vara en faktor som hänger ihop med de geografiska skillnader som observeras.

Detta innebär att både geografi och ekonomi är viktiga perspektiv att ta hänsyn till vid analys av politiska mönster i Sverige. 