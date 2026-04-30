Röstar vi olika beroende på var vi bor?
Detta projekt undersöker hur röstningen förändrats mellan riksdagsvalen 2018 och 2022, och om geografi påverkar hur människor röstar. Syftet är att förstå om Sverige är på väg mot större politiska skillnader mellan olika typer av områden.

Frågeställning
Finns det skillnader mellan stad och landsbygd?
Är vissa partier starkare i olika delar av landet?
Har dessa skillnader förändrats över tid?
Hypotes
Vi utgår från att människor röstar olika beroende på var de bor. Skillnader i livsvillkor, ekonomi, utbildning och demografi påverkar sannolikt röstningen.

Vi förväntar oss att förändringen i partistöd skiljer sig mellan geografiska områden – särskilt mellan stad och landsbygd.

Sverige i fokus
Regionala skillnader
Vi jämför olika län för att se hur partistöd varierar geografiskt.

Stad & landsbygd
Vi analyserar hur befolkningstäthet påverkar förändringar i röstningen, och om urbana respektive rurala områden utvecklas åt olika håll.

Geografiska trender
Vi identifierar var i landet de största politiska förändringarna har skett mellan 2018 och 2022.

Metod
Mätning
Vi beräknar förändring i procentenheter mellan valåren 2018 och 2022.

Positivt värde = partiet har ökat sitt stöd
Negativt värde = partiet har minskat sitt stöd
Teknik & verktyg
Databaser:

Neo4j för valstatistik
MongoDB för demografiska och ekonomiska data
SQLite för befolkningstäthet och länsinfo
DBeaver som hanteringsmiljö för geodata
Visualisering – Google Charts:
Diagram och grafer genereras med Google Charts. Detta gör det möjligt att:

jämföra partiers utveckling mellan olika områden
visa skillnader mellan län
visualisera trender över tid
plotta samband mellan t.ex. befolkningstäthet och röstförändring
Google Charts valdes eftersom det är lätt att integrera, stödjer interaktiva grafer och passar bra för webbaserade presentationer av data.

Syfte
Syftet är att undersöka om geografi är en viktig faktor för hur svenska väljare ändrar sitt röstbeteende. Projektet söker svar på om Sverige är på väg mot ökade politiska skillnader mellan regioner, mellan stad och landsbygd, eller mellan kommuner med olika befolkningsstruktur.

Datakällor och datakvalitet
Länsinfo (SQLite)
Information om Sveriges län används som grund för jämförelser mellan regioner.
Trovärdighet: Allmänt etablerad fakta.
Datakvalitet: Stabil översikt över länens struktur.

Demografi och inkomster (MongoDB)
Data om medelålder och medel-/medianinkomst på kommunnivå.
Trovärdighet: Mycket hög — baserad på SCB.
Datakvalitet: Detaljerad och välstrukturerad, men beskrivande.

Riksdagsval 2018 & 2022 (Neo4j)
Officiella valresultat på kommunnivå.
Trovärdighet: Mycket hög — myndighetsdata.
Datakvalitet: Exakta siffror, men visar inte orsaker bakom röstning.

Geodata (DBeaver)
Kommun- och tätortsdata för geografisk analys.
Trovärdighet: Troligen baserat på nationell kartdata.
Datakvalitet: Bra för geografisk struktur, men ursprunget inte helt kartlagt.

Befolkningstäthet (SCB / tätorter-sqlite)
Används för att dela in kommuner i stad och landsbygd.
Trovärdighet: Mycket hög — SCB.
Datakvalitet: Ger tydlig bild av täthet men fångar inte bakomliggande faktorer som ekonomi, utbildning eller ålder.

Begränsningar
Analysen fokuserar på geografi och demografi.
Faktorer som inkomst, ålder eller utbildning täcks inte fullt ut i alla dataset.
Resultaten kan visa samband men inte bevisa exakta orsaker.