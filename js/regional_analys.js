addMdToPage(`
# Regionala Skillnader

Här undersöker vi hur olika län har röstat i riksdagsvalen 2018 och 2022. 
`);


// ======================================================
// 1. LÄN SOM SKA JÄMFÖRAS (måste matcha geo-mysql exakt)
// ======================================================
const selectedCounties = ["Stockholm", "Skåne", "Norrbotten"];


// ======================================================
// 2. HÄMTA KOMMUNER FRÅN GEO-MYSQL
// ======================================================
async function getKommunerI_Lan(lanNamn) {
  dbQuery.use('geo-mysql');

  // MySQL i din miljö tillåter inte '?', så vi använder ren SQL
  const raw = await dbQuery(
    `SELECT municipality FROM geoData WHERE county = '${lanNamn}'`
  );

  console.log("DEBUG kommun-query raw:", raw);

  // Rengör resultat
  const rows = Array.isArray(raw)
    ? raw
    : (raw?.results || raw?.data || []);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn("Inga kommuner hittades för:", lanNamn);
    return [];
  }

  return [...new Set(rows.map(r => r.municipality))];
}


async function getValdataForKommuner(kommunLista) {
  dbQuery.use('riksdagsval-neo4j');

  if (!Array.isArray(kommunLista) || kommunLista.length === 0) {
    console.warn("NEO4J SKIPPAS — tom kommunlista");
    return [];
  }

  // Gör listan till Cypher-syntax: ["Stockholm","Täby", ...]
  const cypherList = JSON.stringify(kommunLista);

  const query = `
        MATCH (p:Partiresultat)
        WHERE p.kommun IN ${cypherList}
        RETURN p.parti AS parti, p.roster2018 AS r2018, p.roster2022 AS r2022
    `;

  console.log("DEBUG Neo4j query:", query);

  const raw = await dbQuery(query);

  console.log("DEBUG Neo4j raw:", raw);

  const rows = Array.isArray(raw)
    ? raw
    : (raw?.results || raw?.data || []);

  return rows;
}


// ======================================================
// 4. SUMMERA RÖSTER PER PARTI
// ======================================================
function summeraPerParti(votes) {
  if (!Array.isArray(votes)) return {};

  const result = {};

  for (let v of votes) {
    if (!v?.parti) continue;

    if (!result[v.parti]) {
      result[v.parti] = { r2018: 0, r2022: 0 };
    }

    result[v.parti].r2018 += v.r2018 || 0;
    result[v.parti].r2022 += v.r2022 || 0;
  }

  return result;
}


// ======================================================
// 5. SKAPA RADER TILL GOOGLE CHARTS
// ======================================================
async function buildChartRows() {
  const rows = [];

  for (let county of selectedCounties) {
    console.log("BEARBETAR:", county);

    const kommuner = await getKommunerI_Lan(county);
    const votes = await getValdataForKommuner(kommuner);
    const totals = summeraPerParti(votes);

    rows.push([
      county,
      totals["Moderaterna"]?.r2018 || 0,
      totals["Moderaterna"]?.r2022 || 0,
      totals["Arbetarepartiet-Socialdemokraterna"]?.r2018 || 0,
      totals["Arbetarepartiet-Socialdemokraterna"]?.r2022 || 0,
      totals["Sverigedemokraterna"]?.r2018 || 0,
      totals["Sverigedemokraterna"]?.r2022 || 0
    ]);
  }

  console.log("FÄRDIGA DIAGRAMRADER:", rows);

  return rows;
}


// ======================================================
// 6. GOOGLE CHARTS
// ======================================================
google.charts.load("current", { packages: ["corechart"], language: "sv" });
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
  const rows = await buildChartRows();

  const data = new google.visualization.DataTable();
  data.addColumn("string", "Län");
  data.addColumn("number", "M 2018");
  data.addColumn("number", "M 2022");
  data.addColumn("number", "S 2018");
  data.addColumn("number", "S 2022");
  data.addColumn("number", "SD 2018");
  data.addColumn("number", "SD 2022");

  data.addRows(rows);

  const chart = new google.visualization.ColumnChart(
    document.getElementById("chart")
  );

  chart.draw(data, {
    title: "Valresultat 2018–2022 per län",
    legend: { position: "top" }
  });
}
