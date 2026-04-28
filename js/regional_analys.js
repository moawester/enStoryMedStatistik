addMdToPage(`
<h2>Regionala skillnader mellan riksdagsvalen 2018 och 2022</h2>
<p>På den här sidan analyserar jag hur valresultaten skiljer sig mellan tre svenska län:
<b>Stockholm</b>, <b>Skåne</b> och <b>Norrbotten</b>. Målet är att undersöka om geografi påverkar
hur människor röstar i riksdagsvalet.</p>
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

<h3>Välj visualisering</h3>
<select id="viewSelector" style="padding:10px;font-size:16px;margin-bottom:20px;">
  <option value="visu2018">Valresultat 2018</option>
  <option value="visu2022">Valresultat 2022</option>
  <option value="visuChange">Förändring 2018 → 2022</option>
  <option value="visuMap">Karta: förändring SD</option>
</select>
<!-- OBS: GE HELT NYA ID:N SOM INTE KAN KROCKA -->
<div id="visu2018" style="width:900px;height:500px;"></div>
<div id="visu2022" style="width:900px;height:500px;display:none;"></div>
<div id="visuChange" style="width:900px;height:500px;display:none;"></div>
<div id="visuMap" style="width:900px;height:500px;display:none;"></div>
`);

// ======================================================
// 1. LÄN SOM SKA JÄMFÖRAS (måste matcha geo-mysql exakt)
// ======================================================
const selectedCounties = ["Stockholm", "Skåne", "Norrbotten"];


// ======================================================
// 2. HÄMTA KOMMUNER FRÅN GEO-MYSQL
// ======================================================
async function getKommunerI_Lan(lanNamn) {
  try {
    dbQuery.use('geo-mysql');

    const raw = await dbQuery(
      `SELECT municipality FROM geoData WHERE county = '${lanNamn}'`
    );

    const rows = Array.isArray(raw)
      ? raw
      : (raw?.results || raw?.data || []);
    if (!rows || rows.length === 0) {
      console.warn("Inga kommuner hittades för län:", lanNamn);
      return [];
    }
    return [...new Set(rows.map(r => r.municipality))];
  } catch (error) {
    console.error("Fel vid hämtning av kommuner för län:", lanNamn, error);
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
  "#52BDEC", // M
  "#FF0000", // S
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
  data.addColumn("number", "M");
  data.addColumn("number", "S");
  data.addColumn("number", "SD");
  data.addColumn("number", "C");
  data.addColumn("number", "L");
  data.addColumn("number", "KD");
  data.addColumn("number", "V");
  data.addColumn("number", "MP");
  data.addRows(rows);
  const chart = new google.visualization.ColumnChart(
    document.getElementById(containerId)
  );
  chart.draw(data, {
    title,
    legend: { position: "top" },
    colors: partyColors
  });
}

//-------------------------------------------------------------
function drawMap(mapRows) {
  const data = google.visualization.arrayToDataTable(mapRows);
  const chart = new google.visualization.GeoChart(
    document.getElementById("visuMap")
  );

  chart.draw(data, {
    region: "SE",
    resolution: "provinces",
    colorAxis: { colors: ["#ffeecc", "#ff9900", "#cc6600"] }
  });
}

//-------------------------------------------------------------
document.getElementById("viewSelector").addEventListener("change", (e) => {
  const chosen = e.target.value;

  ["visu2018", "visu2022", "visuChange", "visuMap"].forEach(id => {
    document.getElementById(id).style.display =
      (id === chosen ? "block" : "none");
  });
});

//-------------------------------------------------------------
// 9. Rita diagrammen
//-------------------------------------------------------------
google.charts.load("current", { packages: ["corechart", "geochart"], language: "sv" });
google.charts.setOnLoadCallback(drawBothCharts);
async function drawBothCharts() {
  const { rows2018, rows2022, changeRows } = await buildChartRows();
  drawSingleChart("visu2018", "Valresultat 2018 per län (i %)", rows2018);
  drawSingleChart("visu2022", "Valresultat 2022 per län (i %)", rows2022);
  drawSingleChart("visuChange", "Förändring 2018 → 2022 (pp)", changeRows);
  const mapRows = [
    ["Region", "Förändring SD (%)"]
  ];
  changeRows.forEach(r => {
    mapRows.push([r[0], r[3]]);
  });
  drawMap(mapRows);
}