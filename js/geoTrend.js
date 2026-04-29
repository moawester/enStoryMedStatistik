const partiFarger = {
  'Moderaterna': '#7ccdf0',
  'Arbetarepartiet-Socialdemokraterna': '#fe4b4b',
  'Sverigedemokraterna': '#FFCC00',
  'Centerpartiet': '#009933',
  'Liberalerna': '#0066FF',
  'Kristdemokraterna': '#003399',
  'Vänsterpartiet': '#b41f15',
  'Miljöpartiet de gröna': '#83CF39'
};

addToPage(`
<div style="max-width: 900px; margin: 0 auto 30px auto; padding: 32px; border-radius: 16px; background: linear-gradient(135deg,#0f172a,#1e293b); color:#fff;">
  <h1>Geografiska trender</h1>
  <p>
    Röstar vi olika beroende på var vi bor?
    Här analyserar vi hur partiers stöd förändrats mellan riksdagsvalen 2018 och 2022.
  </p>
</div>
`);

addToPage(`
<div style="max-width: 900px; margin: 0 auto; display:grid; gap:18px;">
  <div style="background:#fff; padding:24px; border-radius:14px;">
    <h2>Vad undersöker vi?</h2>
    <p>
      Den här sidan fokuserar på geografiska trender på kommunnivå.
    </p>
    <ul>
      <li>Vilka kommuner där partier ökade mest</li>
      <li>Vilka kommuner där partier minskade mest</li>
      <li>Hur många kommuner partiet ökade eller minskade i</li>
      <li>Spridning: hur ojämn förändringen är mellan kommuner</li>
    </ul>
  </div>

  <div style="background:#fff; padding:24px; border-radius:14px;">
    <h2>Metod och hypotes</h2>
    <p>
      Vi räknar partiets röstandel i procent i varje kommun för 2018 och 2022.
      Därefter jämför vi förändringen i <b>procentenheter</b>.
    </p>
    <p>
      <b>Hypotes:</b> Förändringen är inte jämnt fördelad över Sverige.
      Vissa kommuner sticker ut mer än andra.
    </p>
  </div>
</div>
`);

dbQuery.use('riksdagsval-neo4j');

const partierResultat = await dbQuery(`
  MATCH (n:Partiresultat)
  RETURN DISTINCT n.parti AS parti
  ORDER BY parti
`);

const partier = partierResultat.map(p => p.parti);
const valtParti = sessionStorage.getItem('valtParti') || partier[0];

addMdToPage(`
## Välj parti
<div id="dropdown"></div>
---`);

const select = document.createElement('select');
select.style.padding = '8px';
select.style.fontSize = '16px';

partier.forEach(p => {
  const option = document.createElement('option');
  option.value = p;
  option.textContent = p;
  if (p === valtParti) option.selected = true;
  select.appendChild(option);
});

document.querySelector('#dropdown').appendChild(select);

select.addEventListener('change', e => {
  sessionStorage.setItem('valtParti', e.target.value);
  location.reload();
});

dbQuery.use('geo-mysql');

const geoData = await dbQuery(`
  SELECT municipality, county FROM geoData
`);

async function visaParti(parti) {

  const farg = partiFarger[parti] || '#666';

  addMdToPage(`
# Analys av <span style="color:${farg}">${parti}</span>
Vi jämför partiets röstandel i varje kommun mellan 2018 och 2022.
---`);

  dbQuery.use('riksdagsval-neo4j');

  const data = await dbQuery(`
    MATCH (n:Partiresultat)
    WITH n.kommun AS kommun,
         SUM(n.roster2018) AS total2018,
         SUM(n.roster2022) AS total2022,
         SUM(CASE WHEN n.parti = "${parti}" THEN n.roster2018 ELSE 0 END) AS parti2018,
         SUM(CASE WHEN n.parti = "${parti}" THEN n.roster2022 ELSE 0 END) AS parti2022
    RETURN kommun, total2018, total2022, parti2018, parti2022
  `);

  const kommunData = data.map(e => {

    const procent2018 = (e.parti2018 / e.total2018) * 100;
    const procent2022 = (e.parti2022 / e.total2022) * 100;

    return {
      kommun: e.kommun,
      procent2018: Number(procent2018.toFixed(1)),
      procent2022: Number(procent2022.toFixed(1)),
      forandring: Number((procent2022 - procent2018).toFixed(1))
    };

  });

  const topp10 = [...kommunData].sort((a, b) => b.forandring - a.forandring).slice(0, 10);
  const botten10 = [...kommunData].sort((a, b) => a.forandring - b.forandring).slice(0, 10);

  addMdToPage(`## Var ökade ${parti} mest?`);

  drawGoogleChart({
    type: 'BarChart',
    data: [['Kommun', 'Förändring'], ...topp10.map(k => [k.kommun, k.forandring])],
    options: { height: 400, colors: [farg], legend: 'none' }
  });

  addMdToPage(`## Var minskade ${parti} mest?`);

  drawGoogleChart({
    type: 'BarChart',
    data: [['Kommun', 'Förändring'], ...botten10.map(k => [k.kommun, k.forandring])],
    options: { height: 400, colors: [farg], legend: 'none' }
  });

  const antalOkade = kommunData.filter(k => k.forandring > 0).length;
  const antalMinskade = kommunData.filter(k => k.forandring < 0).length;
  const antalOfandrade = kommunData.filter(k => k.forandring === 0).length;

  addMdToPage(`
---

## Hur många kommuner ökade eller minskade partiet i?

Detta visar om förändringen var bred eller ojämn i Sverige bland 290 kommuner.
`);

  drawGoogleChart({
    type: 'PieChart',
    data: [
      ['Resultat', 'Antal'],
      ['Ökade', antalOkade],
      ['Minskade', antalMinskade],
      ['Oförändrade', antalOfandrade]
    ],
    options: { height: 350 }
  });

  const medel = kommunData.reduce((sum, k) => sum + k.forandring, 0) / kommunData.length;

  const spridning = Math.sqrt(
    kommunData.reduce((sum, k) => sum + Math.pow(k.forandring - medel, 2), 0) / kommunData.length
  );

  addMdToPage(`## Spridning mellan kommuner`);

  drawGoogleChart({
    type: 'ColumnChart',
    data: [
      ['Mått', 'Procentenheter'],
      ['Genomsnitt', Number(medel.toFixed(1))],
      ['Spridning', Number(spridning.toFixed(1))]
    ],
    options: {
      colors: [farg],
      vAxis: { title: 'Procentenheter' },
      legend: 'none'
    }
  });

  addToPage(`
<div style="max-width: 900px; margin: 30px auto; padding: 28px; border-radius: 16px; background:#ffffff; box-shadow:0 6px 18px rgba(0,0,0,0.1);">

  <h2>Slutsats för ${parti}</h2>

  <p><b>Störst ökning:</b> ${topp10[0].kommun}</p>
  <p><b>Störst minskning:</b> ${botten10[0].kommun}</p>

  <p>
    Resultatet stödjer hypotesen. Förändringen är inte jämnt fördelad,
    utan vissa kommuner sticker ut tydligt.
  </p>

</div>
`);
}

visaParti(valtParti);