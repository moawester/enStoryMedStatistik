addToPage(`
<div style="max-width: 850px; margin: 0 auto 30px auto; padding: 28px; border-radius: 14px; background:#f5f5f5;">
  <h1 style="margin-top:0;">Stad vs landsbygd</h1>
  <p style="font-size:18px; line-height:1.6;">
    Spelar det någon roll om man bor i en tät stad eller i en gles landsbygdskommun?
    Här undersöker vi om befolkningstäthet kan kopplas till hur röstningen förändrades mellan 2018 och 2022.
  </p>
</div>
`);

addMdToPage(`
Vi delar upp kommunerna i två grupper:

- de 10 mest tätbefolkade kommunerna (stad)
- de 10 minst tätbefolkade kommunerna (landsbygd)

Därefter jämför vi förändringen i partistöd mellan grupperna.

---

## Hypotes

Vi tror att röstförändringar skiljer sig mellan stad och landsbygd, eftersom livsvillkor, ekonomi och befolkningssammansättning ofta ser olika ut i tätbefolkade och glesbefolkade kommuner.
`);

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/\s+/g, "").replace(",", "."));
}

function average(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

try {
  dbQuery.use("tatorter-sqlite");

  let densityData = await dbQuery(`
    SELECT municipalityName AS kommun, populationDensity2022 AS density
    FROM municipality_statistics
  `);

  let sorted = densityData.sort((a, b) => b.density - a.density);
  let cityRows = sorted.slice(0, 10);
  let ruralRows = sorted.slice(-10).reverse();

  addMdToPage(`## Utvalda kommuner`);

  tableFromData({
    data: [
      { Grupp: "Stad", Kommuner: cityRows.map(r => r.kommun).join(", ") },
      { Grupp: "Landsbygd", Kommuner: ruralRows.map(r => r.kommun).join(", ") }
    ]
  });

  let cityNames = cityRows.map(r => normalizeName(r.kommun));
  let ruralNames = ruralRows.map(r => normalizeName(r.kommun));

  function getCategory(kommun) {
    let name = normalizeName(kommun);
    if (cityNames.includes(name)) return "Stad";
    if (ruralNames.includes(name)) return "Landsbygd";
    return null;
  }

  dbQuery.use("riksdagsval-neo4j");

  let voteData = await dbQuery(`
    MATCH (p:Partiresultat)
    RETURN p.kommun AS kommun,
           p.parti AS parti,
           p.roster2018 AS roster2018,
           p.roster2022 AS roster2022
  `);

  if (!voteData || !voteData.length) {
    throw new Error("Ingen valdata hittades i Neo4j.");
  }

  let filteredVotes = voteData.filter(row => getCategory(row.kommun));

  if (!filteredVotes.length) {
    throw new Error("Ingen valdata matchade de valda kommunerna.");
  }

  const totals = {};

  for (let row of filteredVotes) {
    const kommun = row.kommun;
    const parti = row.parti || "";

    if (parti.toLowerCase().includes("övriga")) continue;

    const r18 = parseNumber(row.roster2018);
    const r22 = parseNumber(row.roster2022);

    if (!totals[kommun]) {
      totals[kommun] = { total18: 0, total22: 0 };
    }

    totals[kommun].total18 += r18;
    totals[kommun].total22 += r22;
  }

  const aggregated = {};

  for (let row of filteredVotes) {
    const kommun = row.kommun;
    const parti = row.parti || "";

    if (parti.toLowerCase().includes("övriga")) continue;

    const category = getCategory(kommun);
    if (!category) continue;

    const r18 = parseNumber(row.roster2018);
    const r22 = parseNumber(row.roster2022);

    const total18 = totals[kommun]?.total18 || 0;
    const total22 = totals[kommun]?.total22 || 0;

    if (!total18 || !total22) continue;

    const share18 = (r18 / total18) * 100;
    const share22 = (r22 / total22) * 100;
    const change = share22 - share18;

    if (!aggregated[parti]) {
      aggregated[parti] = {
        Stad: [],
        Landsbygd: []
      };
    }

    aggregated[parti][category].push(change);
  }

  let results = Object.entries(aggregated)
    .map(([party, data]) => ({
      party,
      stad: average(data.Stad),
      land: average(data.Landsbygd)
    }))
    .filter(row => row.party && (row.stad !== 0 || row.land !== 0))
    .sort((a, b) => Math.max(Math.abs(b.stad), Math.abs(b.land)) - Math.max(Math.abs(a.stad), Math.abs(a.land)))
    .slice(0, 6);

  if (!results.length) {
    throw new Error("Ingen partistatistik kunde beräknas.");
  }

  let chartData = [
    ["Parti", "Stad", "Landsbygd"],
    ...results.map(r => [r.party, Number(r.stad.toFixed(2)), Number(r.land.toFixed(2))])
  ];

  addMdToPage(`
## Förändring i partistöd mellan stad och landsbygd

Diagrammet visar skillnaden mellan partiernas stöd 2018 och 2022. 
Ett positivt värde betyder att partiet ökade sitt stöd, medan ett negativt värde betyder att partiet minskade sitt stöd.

Beräkningen är: andel röster 2022 minus andel röster 2018.
`);

  drawGoogleChart({
    type: "BarChart",
    data: chartData,
    options: {
      title: "Förändring i partistöd 2018–2022",
      height: 500,
      chartArea: { left: 180, right: 30, top: 60, bottom: 60 },
      legend: { position: "top" },
      hAxis: {
        title: "Förändring i procentenheter"
      }
    }
  });

  addMdToPage(`
## Tolkning

Diagrammet visar tydliga skillnader mellan stad och landsbygd.

Sverigedemokraterna ökar mer i landsbygden än i städerna, medan partier som Centerpartiet och Vänsterpartiet minskar mer i landsbygden.

Detta tyder på att politiska förändringar inte sker jämnt över hela landet.
`);

  addMdToPage(`## Resultat`);

  tableFromData({
    data: results.map(r => ({
      Parti: r.party,
      Stad: Number(r.stad.toFixed(2)),
      Landsbygd: Number(r.land.toFixed(2))
    }))
  });

  addMdToPage(`
#et viktigt att komma ihåg att detta är en förenklad analys. Andra faktorer, som utbildningsnivå, ålder och regionala skillnader, kan också påverka valresultatet.
`);

} catch (e) {
  console.error(e);
  addMdToPage(`
## Fel

${e.message}
`);
}
addMdToPage(`
---

## Källor och data

### Valdata (riksdagsval-neo4j)
Valdatan bygger på statistik från SCB:s riksdagsval 2018 och 2022.

**Trovärdighet:**  
SCB är en statlig myndighet och en mycket tillförlitlig källa.

**Datakvalitet:**  
Datan är strukturerad och detaljerad på kommunnivå, men visar endast resultat – inte orsaker till hur människor röstar.

---

### Befolkningstäthet (tatorter-sqlite)

Data om befolkningstäthet bygger på statistik från SCB och används för att dela in kommuner i stad och landsbygd.

**Trovärdighet:**  
SCB är en statlig myndighet och en mycket tillförlitlig källa, vilket gör datan trovärdig.

**Datakvalitet:**  
Datan ger en tydlig bild av hur tätbefolkade olika kommuner är och är relevant för geografisk analys.  
Samtidigt fångar den inte alla faktorer som kan påverka röstning, till exempel ekonomi, utbildningsnivå eller ålder.

### Begränsningar

- Analysen fokuserar främst på geografi  
- Andra faktorer (ålder, inkomst, utbildning) tas inte med  
- Samband kan visas, men inte säkra orsaker  

---
`); 