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

addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background: #c0aec4;border-radius:14px;">
  <h3>Valresultatet 2018</h3>
  <p>
    2018 års resultat visar tre tydligt olika politiska profiler.
  </p>
  <p>
    <b>Stockholm</b> hade ett starkare stöd för Miljöpartiet (6,1 %) och 
    Moderaterna (24,3 %) än de andra länen. Medans Socialdemokraterna (23,1 %) 
    och Sverigedemokraterna (12,8 %) låg lägre än i Skåne och Norrbotten.
  </p>
  <p>
    <b>Skåne</b> utmärktes av ett mycket högt stöd för Sverigedemokraterna 
    (23,4 %), klart högre än både Stockholm och Norrbotten. Vi ser även att Socialdemokraterna 
    (25,2 %) var det Skåningarna röstade mest på.
  </p>
  <p>
    <b>Norrbotten</b> dominerades av Socialdemokraterna (41,7 %). 
    Vänsterpartiet (10,7 %) hade en starkare position i länet jämförelsevis med de andra länen.
    Moderaterna (12,8 %) och Miljöpartiet (2,8 %) hade däremot svagare stöd än i Stockholm och Skåne.
  </p>
  <p>Diagrammet nedan visar valresultatet för 2018.</p>
</div>
<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visu2018" style="width:900px;height:500px;"></div>
</div>
`);


addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background: #c0aec4;border-radius:14px;">
  <h3>Valresultatet 2022</h3>
  <p>
    Mellan 2018 och 2022 rör sig flera partier i liknande riktning i alla län, 
    men utvecklingen är olika stark.
  </p>
  <p>
    I <b>Stockholm</b> ser vi att Socialdemokraterna tydligt går upp i röster
    medan Moderaterna minskar. Och därför byter de plats i vilka som är det största partiet i länet.
  </p>
  <p>
    I <b>Skåne</b> fortsätter Sverigedemokraterna att vara det starkaste av de tre 
    länen och vi kan se att Moderaternas röster minskar även hos Skåningarna.
  </p>
  <p>
    I <b>Norrbotten</b> ligger Socialdemokraterna kvar på en extremt hög nivå 
    (41,6 %). Samtidigt ökar Sverigedemokraterna kraftigt till (20,3 %) och 
    Vänsterpartiet minskar tydligt till (7 %).
  </p>
  <p>Diagrammet nedan visar valresultatet för 2022.</p>
</div>
<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visu2022" style="width:900px;height:500px;"></div>
</div>
`);


addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background: #c0aec4;border-radius:14px;">
  <h3>Förändringar mellan 2018 och 2022</h3>
  <p>
    När förändringen i procentenheter jämförs framträder flera tydliga mönster.
  </p>
  <p>
    <b>Sverigedemokraterna</b> ökar i alla län och allra mest i
    Norrbotten där ökningen är särskilt stark.
  </p>
  <p>
    <b>Socialdemokraterna</b> har en ökning hos Stockholm och Skåne, med den största ökningen i 
    Stockholm där de går om Moderaterna.
  </p>
  <p>
    <b>Moderaterna</b> minskar både i Stockholm och Skåne, men ökar svagt i 
    Norrbotten.
  </p>
  <p>
    <b>Miljöpartiet</b> ökar i samtliga län, tydligast i Stockholm.
  </p>
  <p>
    <b>Vänsterpartiet</b> minskar i alla län, särskilt i Norrbotten.
  </p>
  <p>
    Diagrammet nedan visar förändringen i procentenheter mellan valen.
  </p>
</div>
<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:40px;">
  <div id="visuChange" style="width:900px;height:500px;"></div>
</div>
`);


addMdToPage(`
<div style="max-width:900px;margin:40px auto;padding:24px;background: #a89ff1;border-radius:14px;">
  <h3>Slutsats</h3>
  <p>
    Analysen visar att de tre länen har tydligt olika politiska profiler.
  </p>
  <p>
    Skåne är det län där Sverigedemokraterna står starkast och där ökningen 
    mellan valen är mest betydande.
  </p>
  <p>
    Stockholm utmärker sig genom starkare stöd för Miljöpartiet och 
    Socialdemokraterna, medan Moderaterna tappar en del röster mellan valen.
  </p>
  <p>
    Norrbotten fortsätter att vara Socialdemokraternas starkaste region
    även när man inte ser en ökning mellan valåren, 
    samtidigt som Sverigedemokraterna växer kraftigt och Vänsterpartiet 
    tappar stort.
  </p>
  <p>
    Resultaten visar hur lokala förutsättningar som demografi, geografi 
    och historiska röstningsmönster påverkar utvecklingen över tid.
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

    console.log("====", county, "====");
    for (const parti in totals) {
      const p = totals[parti];
      console.log(
        parti,
        "2018:",
        ((p.r2018 / total2018) * 100).toFixed(2) + "%",
        "2022:",
        ((p.r2022 / total2022) * 100).toFixed(2) + "%"
      );
    }

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

