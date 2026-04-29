addMdToPage(`
<div style="max-width:900px;margin:0 auto 30px auto;padding:32px;border-radius:16px;
background:linear-gradient(135deg,#0f172a,#1e293b);color:white;">
  <h2>Regionala skillnader – Län mot län</h2>
  <p>
    I den här analysen jämförs tre län med olika geografiska och demografiska förutsättningar:
    <b>Stockholm</b>, <b>Skåne</b> och <b>Norrbotten</b>.
    Fokus ligger på hur partistödet skiljer sig mellan länen och hur det förändrats mellan
    valen 2018 och 2022.
  </p>
</div>
`);



/* -------------------------  2018  ------------------------- */

addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background:#c1aac7;border-radius:14px;">
  <h3>Valresultatet 2018</h3>

  <p>
    2018 års resultat visar tydliga skillnader mellan länen. 
    <b>Stockholm</b> hade ett högre stöd för Miljöpartiet och Vänsterpartiet än de två andra länen,
    samtidigt som Moderaterna och Socialdemokraterna låg något närmare varandra.
  </p>

  <p>
    <b>Skåne</b> utmärktes redan 2018 av ett betydligt starkare stöd för Sverigedemokraterna än
    både Stockholm och Norrbotten, vilket påverkar hela partifördelningen i länet.
  </p>

  <p>
    <b>Norrbotten</b> hade Socialdemokraterna som klart största parti. 
    Vänsterpartiet hade också en stabil position. 
    Sverigedemokraterna låg lägre än i Skåne, men högre än i Stockholm.
  </p>

  <p>Diagrammet nedan visar valresultatet för 2018.</p>
</div>

<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visu2018" style="width:900px;height:500px;"></div>
</div>
`);



/* -------------------------  2022  ------------------------- */

addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background:#c1aac7;border-radius:14px;">
  <h3>Valresultatet 2022</h3>

  <p>
    Mellan 2018 och 2022 rör sig flera partier i samma riktning i alla län, men med olika styrka.
    Sverigedemokraterna ökar i samtliga län, men fortfarande mest i Skåne där de redan hade
    en stark position 2018.
  </p>

  <p>
    I <b>Stockholm</b> fortsätter Miljöpartiet att ligga högre än i Skåne och Norrbotten,
    och även Vänsterpartiet har en relativt stark nivå.
  </p>

  <p>
    I <b>Norrbotten</b> ligger Socialdemokraterna kvar på en betydligt högre nivå än i de andra
    två länen, även om stödet minskar något. Sverigedemokraterna ökar här också, men inte lika
    mycket som i Skåne.
  </p>

  <p>Diagrammet nedan visar valresultatet för 2022.</p>
</div>

<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visu2022" style="width:900px;height:500px;"></div>
</div>
`);



/* -------------------------  Förändring  ------------------------- */

addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background:#c1aac7;border-radius:14px;">
  <h3>Förändringar mellan 2018 och 2022</h3>

  <p>
    När förändringen i procentenheter jämförs framträder flera mönster. 
    Sverigedemokraterna ökar i alla tre län, med den största ökningen i Skåne.
  </p>

  <p>
    Socialdemokraterna minskar i både Stockholm och Skåne, men ligger kvar på en hög nivå
    i Norrbotten där tappet är mindre tydligt.
  </p>

  <p>
    Miljöpartiet ökar framför allt i Stockholm. 
    Vänsterpartiets förändringar är mer måttliga men rör sig uppåt i Stockholm och svagt i 
    Norrbotten, medan utvecklingen i Skåne är mer blandad.
  </p>

  <p>
    Diagrammet nedan visar förändringen i procentenheter (−10 till +10).
  </p>
</div>

<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visuChange" style="width:900px;height:500px;"></div>
</div>
`);



/* -------------------------  Slutsats  ------------------------- */

addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background:#0f172a;color:white;border-radius:14px;">
  <h3>Slutsatser</h3>

  <p>
    Analysen visar att partistödet skiljer sig tydligt mellan de tre länen och att förändringarna
    mellan valen inte utvecklas lika starkt överallt. Skåne fortsätter att vara det län där
    Sverigedemokraterna har den tydligaste ökningen mellan valen.
  </p>

  <p>
    Stockholm utmärker sig med ett starkare stöd för Miljöpartiet och Vänsterpartiet,
    samtidigt som Moderaterna och Socialdemokraterna är mer jämnstora.
  </p>

  <p>
    Norrbotten fortsätter att sticka ut genom Socialdemokraternas starka ställning och
    mer stabila utveckling över tid. Sverigedemokraterna ökar också här, men betydligt mindre
    än i Skåne.
  </p>

  <p>
    Sammantaget tyder resultaten på att lokala förutsättningar – som befolkning, ekonomi,
    flyttmönster och historiska röstningsvanor – påverkar hur partistödet förändras över tid.
  </p>
</div>
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