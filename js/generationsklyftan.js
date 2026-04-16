addMdToPage(`
###  Åldersgrupper och partier
`)

let data = await jload('json/databases-in-use.json')

addMdToPage(`
##### Röstar olika åldersgrupper för olika partier? Skiljer sig detta mellan regioner?

Vad du gör:
1. Du delar människor i åldersgrupper:
    - Ungdomar:18-40 år
    - Medelålders:41-65 år
    - Pensionärer:66+ år
2. För varje åldersgrupp räknar du ut:
    - Vilka partier vann bland denna grupp?
    - Gör detta för minst 2 regioner(t.ex. Stockholm och Norrland)
3. Du jämför:"Röstar ungdomar på samma partier oavsett region?"

---

Ditt diagram:
  - T.ex tre stapeldiagram (ett per åldersgrupp) som visar vilka partier de röstade på (kolla vilket google chart diagram som fungerar bäst)
  - Visa skillnaden mellan två regioner

---

Vad du skriver:
  - Förklara dina åldersgrupper
  - Visa diagrammet
  - Säg: "Ungdomar röstade på [parti X], men pensionärer på [parti Y]. I Stockholm var skillnaden större/mindre än i Norrland."s. Median
  `)


