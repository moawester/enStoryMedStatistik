// HERO / HEADER
addToPage(`
<div style="max-width: 900px; margin: 0 auto 30px auto; padding: 32px; border-radius: 16px; background: linear-gradient(135deg,#0f172a,#1e293b); color:#fff; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <h1 style="margin:0 0 10px 0;">Inkomst och röstning</h1>
  <p style="font-size:18px; line-height:1.6; margin:0;">
    Här undersöker vi om ekonomiska skillnader mellan kommuner kan kopplas till förändringar i röstning mellan 2018 och 2022.
  </p>
</div>
`);

function parseNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/\s+/g, "").replace(",", "."));
}

function cleanMunicipalityName(value) {
  return String(value || "")
    .replace(/^\d{4}\s+/, "")
    .trim();
}

function renderIncomeTable(rows) {
  return `
  <table style="max-width:900px; margin:0 auto 24px auto; width:100%; border-collapse:collapse; background:white; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <tr style="background:#f8fafc;">
      <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Kommun</th>
      <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Inkomst 2018</th>
      <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Inkomst 2022</th>
      <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Förändring</th>
    </tr>
    ${rows.map(row => `
      <tr>
        <td style="padding:10px; border:1px solid #e5e7eb;">${row.kommun}</td>
        <td style="padding:10px; border:1px solid #e5e7eb;">${row.income2018}</td>
        <td style="padding:10px; border:1px solid #e5e7eb;">${row.income2022}</td>
        <td style="padding:10px; border:1px solid #e5e7eb;">${Number(row.change.toFixed(1))}</td>
      </tr>
    `).join("")}
  </table>
  `;
}

try {
  dbQuery.use("income-sqlite");

  let incomeRaw = await dbQuery(`
    SELECT *
    FROM income
  `);

  let incomeRows = Array.isArray(incomeRaw)
    ? incomeRaw
    : (incomeRaw?.data || incomeRaw?.results || []);

  let incomeData = incomeRows
    .filter(row => row.region && row["2018"] && row["2022"])
    .map(row => ({
      kommun: cleanMunicipalityName(row.region),
      income2018: parseNumber(row["2018"]),
      income2022: parseNumber(row["2022"]),
      change: parseNumber(row["2022"]) - parseNumber(row["2018"])
    }))
    .filter(row => row.kommun && row.income2018 > 0 && row.income2022 > 0);

  if (!incomeData.length) {
    throw new Error("Ingen inkomstdata kunde läsas in.");
  }

  let highestIncrease = [...incomeData]
    .sort((a, b) => b.change - a.change)
    .slice(0, 10);

  let lowestIncrease = [...incomeData]
    .sort((a, b) => a.change - b.change)
    .slice(0, 10);

  addToPage(`
  <div style="max-width: 900px; margin: 0 auto; display:grid; gap:18px;">

    <div style="background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <h2 style="margin-top:0;">Metod</h2>
      <p>
        Vi använder nettoinkomst från SCB på kommunnivå för åren 2018 och 2022.
        Därefter beräknar vi hur mycket inkomsten har förändrats i varje kommun.
      </p>
      <p>
        Syftet är att se om ekonomiska skillnader kan vara en kompletterande faktor
        när vi analyserar geografiska mönster i röstning.
      </p>
    </div>

    <div style="background:#f8fafc; padding:24px; border-radius:14px;">
      <h2 style="margin-top:0;">Fråga</h2>
      <p><b>Kan ekonomiska skillnader mellan kommuner kopplas till förändringar i röstning?</b></p>
      <p>
        Inkomst förklarar inte ensam hur människor röstar, men kan ge en bredare förståelse
        för skillnader mellan olika typer av kommuner.
      </p>
    </div>
  </div>
  `);

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Störst inkomstökning 2018–2022</h2>
    <p>Tabellen visar de tio kommuner där nettoinkomsten ökade mest mellan 2018 och 2022.</p>
  </div>
  `);

  addToPage(renderIncomeTable(highestIncrease));

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Minst inkomstökning 2018–2022</h2>
    <p>Tabellen visar de tio kommuner där nettoinkomsten ökade minst mellan 2018 och 2022.</p>
  </div>
  `);

  addToPage(renderIncomeTable(lowestIncrease));

  let chartData = [
    ["Kommun", "Förändring"],
    ...highestIncrease.map(row => [row.kommun, Number(row.change.toFixed(1))])
  ];

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ecfeff; border-left:6px solid #06b6d4; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Tolkning</h2>
    <p>
      Resultatet visar att inkomsterna har förändrats olika mycket mellan kommuner.
      Det stärker projektets bild av att kommuner skiljer sig åt, inte bara geografiskt
      utan även ekonomiskt.
    </p>
    <p>
      Detta kan vara relevant när vi tolkar röstförändringar, eftersom ekonomi kan påverka
      livsvillkor, prioriteringar och politiska frågor. Värdena anges i tkr (tusen kronor). 
    </p>
  </div>
  `);

  drawGoogleChart({
    type: "ColumnChart",
    data: chartData,
    options: {
      title: "Störst förändring i nettoinkomst 2018–2022",
      height: 500,
      chartArea: { left: 80, right: 30, top: 60, bottom: 120 },
      legend: { position: "none" },
      hAxis: {
        title: "Kommun",
        slantedText: true,
        slantedTextAngle: 45
      },
      vAxis: {
        title: "Förändring i tkr"
      }
    }
  });

  addToPage(`
  <div style="max-width: 900px; margin: 24px auto; background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Slutsats</h2>
    <p>
      Inkomstdatan visar att ekonomiska förändringar skiljer sig mellan Sveriges kommuner.
      Detta ger projektet en extra datakälla som kompletterar analysen av geografiska skillnader i röstning.
    </p>
    <p>
      Analysen visar inte att inkomst direkt orsakar ett visst röstbeteende, men den visar att
      ekonomi är en relevant faktor att ta hänsyn till när man analyserar politiska mönster.
    </p>
  </div>
  `);

} catch (e) {
  console.error(e);
  addMdToPage(`
## Fel

${e.message}
`);
} 