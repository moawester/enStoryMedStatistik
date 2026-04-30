# Röstar vi olika beroende på var vi bor?

Detta projekt undersöker hur röstningen förändrats mellan riksdagsvalen 2018 och 2022, och om geografi påverkar hur människor röstar.

Syftet är att förstå om Sverige visar tecken på ökade politiska skillnader mellan olika typer av områden.

---

## Frågeställning

- Finns det skillnader mellan stad och landsbygd?
- Är vissa partier starkare i olika delar av landet?
- Har dessa skillnader förändrats över tid?

---

## Hypotes

Vi utgår från att människor röstar olika beroende på var de bor.

Skillnader i livsvillkor, ekonomi, utbildning och demografi påverkar sannolikt röstbeteendet.  
Vi förväntar oss därför att förändringen i partistöd skiljer sig mellan olika geografiska områden – särskilt mellan stad och landsbygd.

---

## Analysens delar

Projektet är uppdelat i tre perspektiv:

### Regionala skillnader
Jämförelse mellan olika län för att se hur partistöd varierar geografiskt.

### Stad och landsbygd
Analys av hur befolkningstäthet påverkar förändringar i röstningen.

### Geografiska trender
Identifiering av var i landet de största förändringarna har skett mellan 2018 och 2022.

---

## Metod

Vi mäter förändringar i **procentenheter** mellan valen 2018 och 2022.

- Positivt värde = partiet har ökat sitt stöd  
- Negativt värde = partiet har minskat sitt stöd  

---

## Teknik & verktyg

### Databaser

- Neo4j – används för att lagra och analysera valdata  
- MongoDB – används för demografiska och ekonomiska data  
- SQLite – används för befolkningstäthet och geografisk information  
- MySQL – används för att lagra och hantera geografisk data (t.ex. kommuner och regioner)  

### Verktyg

- DBeaver – används för att hantera och utforska databaser  

### Visualisering

- Google Charts – används för att skapa diagram och visualisera data  

---

## Datakällor och datakvalitet

### SCB – Riksdagsval 2018 & 2022
Officiella valresultat på kommunnivå.  
**Trovärdighet:** Mycket hög (statlig myndighet)  
**Datakvalitet:** Exakta siffror, men visar inte orsaker bakom röstning  

---

### SCB – Befolkning och befolkningstäthet
Används för att dela in kommuner i stad och landsbygd.  
**Trovärdighet:** Mycket hög  
**Datakvalitet:** Ger tydlig bild av täthet, men fångar inte bakomliggande faktorer  

---

### SCB – Demografi och socioekonomiska faktorer
Data om exempelvis ålder, inkomst och utbildningsnivå.  
**Trovärdighet:** Mycket hög  
**Datakvalitet:** Relevant för att förstå skillnader i röstbeteende, men används här främst som förklarande faktor  

---

## Begränsningar

- Analysen fokuserar främst på geografiska faktorer  
- Alla socioekonomiska variabler analyseras inte fullt ut  
- Resultaten visar samband, men inte säkra orsaker  

---

## Slutsats

Projektet visar att röstningen i Sverige skiljer sig beroende på geografi.

Det finns tydliga skillnader mellan stad och landsbygd samt mellan olika regioner.  
Samtidigt påverkas röstbeteendet av flera faktorer, vilket innebär att geografi inte ensam kan förklara resultaten.

Detta visar att geografi är en viktig faktor att ta hänsyn till vid analys av politiska mönster i Sverige. 