addToPage(`
<div style="max-width: 900px; margin: 0 auto 30px auto; padding: 32px; border-radius: 16px; background: linear-gradient(135deg,#0f172a,#1e293b); color:#fff; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <h1 style="margin:0 0 10px 0;">Stad vs landsbygd</h1>
  <p style="font-size:18px; line-height:1.6; margin:0;">
    Spelar det någon roll om man bor i en tät stad eller i en gles landsbygdskommun?
    Här undersöker vi om befolkningstäthet kan kopplas till hur röstningen förändrades mellan 2018 och 2022.
  </p>
</div>
`);

addToPage(`
<div style="max-width: 900px; margin: 0 auto; display:grid; gap:18px;">
  <div style="background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Metod och hypotes</h2>
    <p>Vi delar upp kommunerna i två grupper:</p>
    <ul>
      <li>de 10 mest tätbefolkade kommunerna (stad)</li>
      <li>de 10 minst tätbefolkade kommunerna (landsbygd)</li>
    </ul>
    <p>Därefter jämför vi förändringen i partistöd mellan grupperna.</p>
    <p><b>Hypotes:</b> Vi tror att röstförändringar skiljer sig mellan stad och landsbygd, eftersom livsvillkor, ekonomi och befolkningssammansättning ofta ser olika ut i tätbefolkade och glesbefolkade kommuner.</p>
  </div>
</div>
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

  addToPage(`
  <div style="max-width: 900px; margin: 18px auto; background:#f8fafc; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Utvalda kommuner</h2>
    <p>Här visas de kommuner som används i jämförelsen mellan stad och landsbygd.</p>
  </div>
  `);

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

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Förändring i partistöd mellan stad och landsbygd</h2>
    <p>Diagrammet visar skillnaden mellan partiernas stöd 2018 och 2022.</p>
    <p><b>Positivt värde</b> betyder att partiet har ökat sitt stöd. <b>Negativt värde</b> betyder att partiet har minskat sitt stöd.</p>
    <p>Beräkningen är: andel röster 2022 minus andel röster 2018.</p>
  </div>
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

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ecfeff; border-left:6px solid #06b6d4; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Tolkning</h2>
    <p>Diagrammet visar tydliga skillnader mellan stad och landsbygd.</p>
    <p>Sverigedemokraterna ökar mer i landsbygden än i städerna, medan partier som Centerpartiet och Vänsterpartiet minskar mer i landsbygden.</p>
    <p>Detta tyder på att politiska förändringar inte sker jämnt över hela landet.</p>
  </div>
  `);

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#f8fafc; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Resultat</h2>
    <p>Tabellen visar den genomsnittliga förändringen i partistöd i stad respektive landsbygd.</p>
  </div>
  `);

  tableFromData({
    data: results.map(r => ({
      Parti: r.party,
      Stad: Number(r.stad.toFixed(2)),
      Landsbygd: Number(r.land.toFixed(2))
    }))
  });

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Slutsats</h2>
    <p>Resultatet visar att förändringen i partistöd skiljer sig mellan stad och landsbygd.</p>
    <p>I vår analys ökade stödet för Sverigedemokraterna betydligt mer i landsbygdskommuner <b>(7,09 procentenheter)</b> jämfört med i stadskommuner <b>(1,03 procentenheter)</b>. Samtidigt minskade exempelvis Centerpartiet och Vänsterpartiet mer i landsbygden än i städerna.</p>
    <p>Detta tyder på att befolkningstäthet kan ha ett samband med hur röstningen förändras. Skillnader i livsvillkor, ekonomi och demografi mellan stad och landsbygd kan påverka hur människor röstar.</p>
    <p>Samtidigt är det viktigt att komma ihåg att detta är en förenklad analys. Andra faktorer, som utbildningsnivå, ålder och regionala skillnader, kan också påverka valresultatet.</p>
  </div>
  `);

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#f1f5f9; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Källor och data</h2>

    <h3>Valdata (riksdagsval-neo4j)</h3>
    <p>Valdatan bygger på statistik från SCB:s riksdagsval 2018 och 2022.</p>
    <p><b>Trovärdighet:</b> SCB är en statlig myndighet och en mycket tillförlitlig källa.</p>
    <p><b>Datakvalitet:</b> Datan är strukturerad och detaljerad på kommunnivå, men visar endast resultat – inte orsaker till hur människor röstar.</p>

    <h3>Befolkningstäthet (tatorter-sqlite)</h3>
    <p>Data om befolkningstäthet bygger på statistik från SCB och används för att dela in kommuner i stad och landsbygd.</p>
    <p><b>Trovärdighet:</b> SCB är en statlig myndighet och en mycket tillförlitlig källa, vilket gör datan trovärdig.</p>
    <p><b>Datakvalitet:</b> Datan ger en tydlig bild av hur tätbefolkade olika kommuner är och är relevant för geografisk analys. Samtidigt fångar den inte alla faktorer som kan påverka röstning, till exempel ekonomi, utbildningsnivå eller ålder.</p>

    <h3>Begränsningar</h3>
    <ul>
      <li>Analysen fokuserar främst på geografi.</li>
      <li>Andra faktorer som ålder, inkomst och utbildning tas inte med.</li>
      <li>Samband kan visas, men inte säkra orsaker.</li>
    </ul>
  </div>
  `);

} catch (e) {
  console.error(e);
  addMdToPage(`
## Fel

${e.message}
`);
} 