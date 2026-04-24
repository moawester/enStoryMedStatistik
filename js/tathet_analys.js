addMdToPage(`
# Stad vs landsbygd

Här undersöker vi om kommunernas täthet kan ha samband med hur röstningen förändrades mellan riksdagsvalen 2018 och 2022.

Vi delar upp kommuner i:
- stad (högst täthet)
- landsbygd (lägst täthet)

Sedan jämför vi hur stödet för partier förändrats mellan 2018 och 2022.
`);

addMdToPage(`
## Hypotes
Vi tror att röstförändringar skiljer sig mellan stad och landsbygd eftersom livsvillkor och befolkning skiljer sig.
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

  addMdToPage(`## Resultat`);

  tableFromData({
    data: results.map(r => ({
      Parti: r.party,
      Stad: Number(r.stad.toFixed(2)),
      Landsbygd: Number(r.land.toFixed(2))
    }))
  });

  const sd = results.find(r =>
    r.party.toLowerCase().includes("sverigedemokraterna") ||
    r.party.toLowerCase().includes("sd")
  );

  let summary = "Vi ser skillnader mellan stad och landsbygd i hur partier förändrats.";

  if (sd) {
    summary = `I denna analys förändrades stödet för Sverigedemokraterna med ${sd.land.toFixed(2)} procentenheter i landsbygden jämfört med ${sd.stad.toFixed(2)} i städerna.`;
  }

  addMdToPage(`
## Slutsats

Resultatet visar att förändringen i partistöd skiljer sig mellan stad och landsbygd.

I vår analys ökade stödet för Sverigedemokraterna betydligt mer i landsbygdskommuner (7,09 procentenheter) jämfört med i stadskommuner (1,03 procentenheter). Samtidigt minskade till exempel Centerpartiet och Vänsterpartiet mer i landsbygden än i städerna.

Detta tyder på att befolkningstäthet kan ha ett samband med hur röstningen förändras. Skillnader i livsvillkor, ekonomi och demografi mellan stad och landsbygd kan påverka hur människor röstar.

Samtidigt är det viktigt att komma ihåg att detta är en förenklad analys. Andra faktorer, som utbildningsnivå, ålder och regionala skillnader, kan också påverka valresultatet.
`);

} catch (e) {
  console.error(e);
  addMdToPage(`
## Fel

${e.message}
`);
} 