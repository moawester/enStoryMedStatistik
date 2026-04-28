addToPage(`
<div style="max-width: 1000px; margin: 0 auto 40px auto; padding: 40px; border-radius: 18px;
background: linear-gradient(135deg,#0f172a,#1e293b);
color:white; text-align:center; box-shadow:0 15px 30px rgba(0,0,0,0.2);">

  <h1 style="margin:0; font-size:36px;">Röstar vi olika beroende på var vi bor?</h1>

  <p style="font-size:18px; margin-top:15px; line-height:1.6;">
    Vi undersöker hur röstningen förändrats mellan riksdagsvalen 2018 och 2022,
    och om geografi spelar en roll.
  </p>

  <p style="opacity:0.8; margin-top:10px;">
    Detta väcker frågan om Sverige håller på att bli mer politiskt uppdelat beroende på var man bor.
  </p>

</div>
`);

addToPage(`
<div style="max-width:1000px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:20px;">

  <div style="background:white; padding:25px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2>Frågeställning</h2>
    <ul>
      <li>Finns det skillnader mellan stad och landsbygd?</li>
      <li>Är vissa partier starkare i olika delar av landet?</li>
      <li>Har dessa skillnader förändrats över tid?</li>
    </ul>
  </div>

  <div style="background:#f1f5f9; padding:25px; border-radius:14px;">
    <h2>Hypotes</h2>
    <p>
      Vi antar att människor röstar olika beroende på var de bor.
      Skillnader i livsvillkor, ekonomi, utbildningsnivå och befolkningssammansättning
      kan påverka röstbeteendet.
    </p>
    <p>
      Vi förväntar oss därför att förändringen i partistöd skiljer sig mellan olika delar av landet,
      särskilt mellan stad och landsbygd.
    </p>
  </div>

</div>
`);

addToPage(`
<div style="max-width:1000px; margin:30px auto;">
  <h2 style="text-align:center;">Sverige i fokus</h2>
  <div id="swedenMap" style="width:100%; height:400px;"></div>
</div>
`);

google.charts.load("current", { packages: ["geochart"], language: "sv" });
google.charts.setOnLoadCallback(drawMap);

function drawMap() {
  const data = google.visualization.arrayToDataTable([
    ["Region", "Värde"],
    ["Sweden", 1]
  ]);

  const chart = new google.visualization.GeoChart(
    document.getElementById("swedenMap")
  );

  chart.draw(data, {
    region: "SE",
    resolution: "countries",
    colorAxis: { colors: ["#cbd5f5", "#1e3a8a"] }
  });
}

addToPage(`
<div style="max-width:1000px; margin:30px auto;">

  <h2 style="text-align:center;">Analysens tre delar</h2>

  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:20px;">

    <div style="background:white; padding:20px; border-radius:14px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      <h3>Regionala skillnader</h3>
      <p>Jämförelser mellan olika län för att se hur partistöd varierar geografiskt.</p>
    </div>

    <div style="background:white; padding:20px; border-radius:14px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      <h3>Stad & landsbygd</h3>
      <p>Hur befolkningstäthet påverkar förändringar i röstning.</p>
    </div>

    <div style="background:white; padding:20px; border-radius:14px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      <h3>Geografiska trender</h3>
      <p>Var i landet de största förändringarna har skett.</p>
    </div>

  </div>

</div>
`);

addToPage(`
<div style="max-width:1000px; margin:30px auto; background:#f8fafc; padding:25px; border-radius:14px;">

  <h2>Metod & syfte</h2>

  <p><b>Metod:</b> Vi mäter förändringar i procentenheter mellan 2018 och 2022.</p>

  <ul>
    <li>Positivt värde = partiet har ökat sitt stöd</li>
    <li>Negativt värde = partiet har minskat sitt stöd</li>
  </ul>

  <p>
    <b>Syfte:</b> Att undersöka om geografi är en viktig faktor för hur röstningen förändras,
    och om Sverige visar tecken på ökande politiska skillnader mellan olika områden.
  </p>

</div>
`);