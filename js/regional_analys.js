addMdToPage(`
<div style="max-width: 900px; margin: 0 auto 30px auto; padding: 32px; border-radius: 16px; background: linear-gradient(135deg,#0f172a,#1e293b); color:#fff; box-shadow:0 10px 25px rgba(0,0,0,0.15);">
  <h2 style="margin:0 0 10px 0;">Regionala skillnader - Län mot län</h2>
  <p style="font-size:18px; line-height:1.6; margin:0;">
  <p>På den här sidan analyserar jag hur valresultaten skiljer sig mellan tre svenska län:
    <b>Stockholm</b>, <b>Skåne</b> och <b>Norrbotten</b>. Målet är att undersöka om geografi påverkar
    hur människor röstar i riksdagsvalet.
  </p>
</div>
`);
addMdToPage(`
<div style="max-width: 900px; margin: 0 auto; display:grid; gap:18px;">
  <div style="background: #c1aac7; padding:24px; border-radius:14px; box-shadow:0 12px 33px rgba(0,0,0,0.08);">
<p>Jag visar resultat för både <b>2018</b> och <b>2022</b>, samt ett tredje diagram som visar 
förändringen mellan åren. Det finns även en karta som visualiserar hur stödet för Sverigedemokraterna 
har förändrats regionalt.</p>
<p>Hypotes
Min hypotes är att:
<ul>
<li><b>Stockholm</b>, som är mer urbant, kommer ha högre stöd för partier som brukar stå starkare i större städer (t.ex. Socialdemokraterna och Miljöpartiet).</li>
<li><b>Norrbotten</b>, som är mer glesbefolkat, kan ha ett annorlunda röstningsmönster med mer stöd för vissa partier som står starkt i norra Sverige.</li>
<li><b>Skåne</b> sticker ut genom att Sverigedemokraterna har ett ovanligt starkt fäste i många kommuner.</li>
</ul>
Jag tror därför att det finns tydliga <b>regionala skillnader</b> i hur människor röstar.
Om det visar sig att skillnaderna inte är så stora som man kan tro, så är även det ett intressant resultat.</p>
</div>
<div id="visu2018" style="width:900px;height:500px;"></div>
<div id="visu2022" style="width:900px;height:500px;"></div>
<div id="visuChange" style="width:900px;height:500px;"></div>
<div id="visuMap" style="width:900px;height:500px;"></div>

`);

const selectedCounties = ["Stockholm", "Skåne", "Norrbotten"];


// ======================================================
// 2. HÄMTA KOMMUNER FRÅN GEO-MYSQL
// ======================================================
async function getKommunerI_Lan(lanNamn) {
  try {
    dbQuery.use("geo-mysql");
    const raw = await dbQuery(
      `SELECT municipality FROM geoData WHERE county = '${lanNamn}'`
    );
    const rows = Array.isArray(raw)
      ? raw
      : (raw?.results || raw?.data || []);
    return [...new Set(rows.map(r => r.municipality))];
  } catch {
    return [];
  }
};

// ======================================================
async function getValdataForKommuner(kommunLista) {
  dbQuery.use('riksdagsval-neo4j');
  if (!kommunLista || kommunLista.length === 0) {
    return [];
  }
  // Skapa lista direkt i Cypher (viktigt i er miljö)
  const cypherList = JSON.stringify(kommunLista);
  const query = `
        MATCH (p:Partiresultat)
        WHERE p.kommun IN ${cypherList}
        RETURN p.parti AS parti, p.roster2018 AS r2018, p.roster2022 AS r2022
    `;
  const raw = await dbQuery(query);
  return Array.isArray(raw)
    ? raw
    : (raw?.results || raw?.data || []);
}


// ======================================================
// 4. SUMMERA RÖSTER PER PARTI
// ======================================================
function summeraPerParti(votes) {
  const resultat = {};
  for (let v of votes) {
    if (!resultat[v.parti]) {
      resultat[v.parti] = { r2018: 0, r2022: 0 };
    }
    resultat[v.parti].r2018 += v.r2018 || 0;
    resultat[v.parti].r2022 += v.r2022 || 0;
  }
  return resultat;
}

// ======================================================
// 5. SKAPA RADER TILL GOOGLE CHARTS
// ======================================================
//-------------------------------------------------------------
async function buildChartRows() {
  const rows2018 = [];
  const rows2022 = [];

  for (let county of selectedCounties) {
    const kommuner = await getKommunerI_Lan(county);
    const votes = await getValdataForKommuner(kommuner);
    const totals = summeraPerParti(votes);
    const total2018 = Object.values(totals).reduce((sum, p) => sum + (p.r2018 || 0), 0);
    const total2022 = Object.values(totals).reduce((sum, p) => sum + (p.r2022 || 0), 0);

    // Rader i procent för 2018
    rows2018.push([
      county,
      (totals["Moderaterna"]?.r2018 || 0) / total2018 * 100,
      (totals["Arbetarepartiet-Socialdemokraterna"]?.r2018 || 0) / total2018 * 100,
      (totals["Sverigedemokraterna"]?.r2018 || 0) / total2018 * 100,
      (totals["Centerpartiet"]?.r2018 || 0) / total2018 * 100,
      (totals["Liberalerna "]?.r2018 || 0) / total2018 * 100,
      (totals["Kristdemokraterna"]?.r2018 || 0) / total2018 * 100,
      (totals["Vänsterpartiet"]?.r2018 || 0) / total2018 * 100,
      (totals["Miljöpartiet de gröna"]?.r2018 || 0) / total2018 * 100
    ]);

    // Rader i procent för 2022
    rows2022.push([
      county,
      (totals["Moderaterna"]?.r2022 || 0) / total2022 * 100,
      (totals["Arbetarepartiet-Socialdemokraterna"]?.r2022 || 0) / total2022 * 100,
      (totals["Sverigedemokraterna"]?.r2022 || 0) / total2022 * 100,
      (totals["Centerpartiet"]?.r2022 || 0) / total2022 * 100,
      (totals["Liberalerna "]?.r2022 || 0) / total2022 * 100,
      (totals["Kristdemokraterna"]?.r2022 || 0) / total2022 * 100,
      (totals["Vänsterpartiet"]?.r2022 || 0) / total2022 * 100,
      (totals["Miljöpartiet de gröna"]?.r2022 || 0) / total2022 * 100
    ]);
  }

  const changeRows = rows2018.map((r18, index) => {
    const r22 = rows2022[index];
    return [
      r18[0],                 // län
      r22[1] - r18[1],        // M
      r22[2] - r18[2],        // S
      r22[3] - r18[3],        // SD
      r22[4] - r18[4],        // C
      r22[5] - r18[5],        // L
      r22[6] - r18[6],        // KD
      r22[7] - r18[7],        // V
      r22[8] - r18[8]         // MP
    ];
  });

  return { rows2018, rows2022, changeRows };
}

//-------------------------------------------------------------
// 7. Partifärger (officiella svenska färger)
//-------------------------------------------------------------
const partyColors = [
  "#7ccdf0", // M
  "#fe4b4b", // S
  "#FFCC00", // SD
  "#009933", // C
  "#0066FF", // L
  "#003399", // KD
  "#b41f15", // V
  "#83CF39"  // MP
];
//-------------------------------------------------------------

function drawSingleChart(containerId, title, rows) {
  const data = new google.visualization.DataTable();
  data.addColumn("string", "Län");

  const parties = ["M", "S", "SD", "C", "L", "KD", "V", "MP"];
  parties.forEach(p => {
    data.addColumn("number", p);
    data.addColumn({ type: "string", role: "tooltip" });
  });

  // Bygg rader med tooltip (%)
  const formattedRows = rows.map(row => {
    const län = row[0];
    const values = row.slice(1);

    const newRow = [län];
    values.forEach(v => {
      newRow.push(v);                // värdet
      newRow.push(v.toFixed(1) + "%"); // tooltipen
    });
    return newRow;
  });

  data.addRows(formattedRows);

  const chart = new google.visualization.ColumnChart(
    document.getElementById(containerId)
  );

  chart.draw(data, {
    title: title,
    legend: { position: "top" },
    colors: partyColors,
    backgroundColor: "#c1aac7",
    chartArea: { backgroundColor: "#c1aac7", width: "80%", height: "70%" },

    vAxis: {
      minValue: 0,
      maxValue: 50,
      ticks: [0, 10, 20, 30, 40, 50],
      format: "#'%'"
    }
  });
}


//-------------------------------------------------------------

function drawChangeChart(containerId, title, rows) {
  const data = new google.visualization.DataTable();
  data.addColumn("string", "Län");

  const parties = ["M", "S", "SD", "C", "L", "KD", "V", "MP"];
  parties.forEach(p => {
    data.addColumn("number", p);
    data.addColumn({ type: "string", role: "tooltip" });
  });

  const formattedRows = rows.map(row => {
    const län = row[0];
    const values = row.slice(1);
    const newRow = [län];
    values.forEach(v => {
      newRow.push(v);
      newRow.push(v.toFixed(1) + " %");
    });
    return newRow;
  });

  data.addRows(formattedRows);

  const chart = new google.visualization.ColumnChart(
    document.getElementById(containerId)
  );

  chart.draw(data, {
    title: title,
    legend: { position: "top" },
    colors: partyColors,
    backgroundColor: "#c1aac7",
    chartArea: { backgroundColor: "#c1aac7", width: "80%", height: "70%" },

    vAxis: {
      minValue: -5,
      maxValue: 5,
      ticks: [-5, 0, 5],
      format: "#' %'"
    }
  });
}

//-------------------------------------------------------------
google.charts.load("current", { packages: ["corechart", "geochart"], language: "sv" });
google.charts.setOnLoadCallback(() => {
  if (!chartsInitialized) {
    chartsInitialized = true;
    drawBothCharts();
  }
});

google.charts.load("current", { packages: ["corechart"], language: "sv" });
google.charts.setOnLoadCallback(async () => {
  const { rows2018, rows2022, changeRows } = await buildChartRows();
  drawSingleChart("visu2018", "Valresultat 2018", rows2018);
  drawSingleChart("visu2022", "Valresultat 2022", rows2022);
  drawChangeChart("visuChange", "Förändring 2018 → 2022 ", changeRows);
});