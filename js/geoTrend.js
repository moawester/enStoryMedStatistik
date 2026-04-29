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
      Vi undersöker inte län eller stad/landsbygd, eftersom det tas upp på andra sidor.
    </p>
    <ul>
      <li>Vilka kommuner där partier ökade mest</li>
      <li>Vilka kommuner där partier minskade mest</li>
      <li>Extremfall: största ökningen och största minskningen</li>
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
      <b>Hypotes:</b> Vi tror att förändringen inte är jämnt fördelad över Sverige.
      Vissa partier kan öka mycket i vissa kommuner samtidigt som de minskar i andra.
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
select.style.marginBottom = '20px';

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
  SELECT municipality, county 
  FROM geoData
`);

async function visaParti(parti) {
  const farg = partiFarger[parti] || '#666';

  addMdToPage(`
# Analys av <span style="color:${farg}">${parti}</span>

Vi jämför partiets röstandel i varje kommun mellan 2018 och 2022.

Ett positivt värde betyder att partiet ökade.  
Ett negativt värde betyder att partiet minskade.

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
    const geo = geoData.find(g => g.municipality === e.kommun);

    const total2018 = Number(e.total2018);
    const total2022 = Number(e.total2022);
    const parti2018 = Number(e.parti2018);
    const parti2022 = Number(e.parti2022);

    const procent2018 = (parti2018 / total2018) * 100;
    const procent2022 = (parti2022 / total2022) * 100;

    return {
      kommun: String(e.kommun),
      county: geo ? geo.county : 'Okänt',
      procent2018: Number(procent2018.toFixed(1)),
      procent2022: Number(procent2022.toFixed(1)),
      forandring: Number((procent2022 - procent2018).toFixed(1))
    };
  }).filter(k =>
    k.county !== 'Okänt' &&
    isFinite(k.forandring)
  );

  const topp10 = [...kommunData]
    .sort((a, b) => b.forandring - a.forandring)
    .slice(0, 10);

  const botten10 = [...kommunData]
    .sort((a, b) => a.forandring - b.forandring)
    .slice(0, 10);

  addMdToPage(`
## Kommuner där ${parti} ökade mest

Diagrammet visar de tio kommuner där partiets röstandel ökade mest mellan 2018 och 2022.

Det betyder inte nödvändigtvis att partiet blev störst i dessa kommuner, utan att stödet ökade mest jämfört med förra valet.
`);

  drawGoogleChart({
    type: 'BarChart',
    data: [
      ['Kommun', 'Förändring i procentenheter'],
      ...topp10.map(k => [k.kommun, Number(k.forandring)])
    ],
    options: {
      title: `Topp 10 ökningar för ${parti}`,
      height: 430,
      chartArea: { left: 130, height: '75%' },
      legend: { position: 'none' },
      hAxis: { title: 'Förändring i procentenheter' },
      colors: [farg]
    }
  });

  addMdToPage(`
---

## Kommuner där ${parti} minskade mest

För att se hela bilden tittar vi också på var partiet tappade mest stöd.

Då kan vi jämföra om partiets förändring är jämn över landet eller om den skiljer sig mycket mellan olika kommuner.
`);

  drawGoogleChart({
    type: 'BarChart',
    data: [
      ['Kommun', 'Förändring i procentenheter'],
      ...botten10.map(k => [k.kommun, Number(k.forandring)])
    ],
    options: {
      title: `Topp 10 minskningar för ${parti}`,
      height: 430,
      chartArea: { left: 130, height: '75%' },
      legend: { position: 'none' },
      hAxis: { title: 'Förändring i procentenheter' },
      colors: [farg]
    }
  });

  const extremData = [
    ['Typ', 'Förändring i procentenheter'],
    [`Störst ökning: ${topp10[0].kommun}`, Number(topp10[0].forandring)],
    [`Störst minskning: ${botten10[0].kommun}`, Number(botten10[0].forandring)]
  ];

  const antalOkade = kommunData.filter(k => k.forandring > 0).length;
  const antalMinskade = kommunData.filter(k => k.forandring < 0).length;
  const antalOfandrade = kommunData.filter(k => k.forandring === 0).length;

  addMdToPage(`
---

Detta visar om förändringen var bred över landet eller om den bara syns i vissa kommuner.
`);

  drawGoogleChart({
    type: 'PieChart',
    data: [
      ['Resultat', 'Antal kommuner'],
      ['Ökade', antalOkade],
      ['Minskade', antalMinskade],
      ['Oförändrade', antalOfandrade]
    ],
    options: {
      title: `Antal kommuner där ${parti} ökade eller minskade`,
      height: 400
    }
  });
  const medel = kommunData.reduce((sum, k) => sum + k.forandring, 0) / kommunData.length;

  const spridning = Math.sqrt(
    kommunData.reduce((sum, k) => sum + Math.pow(k.forandring - medel, 2), 0) / kommunData.length
  );

  const toppSnitt = topp10.reduce((sum, k) => sum + k.forandring, 0) / topp10.length;
  const bottenSnitt = botten10.reduce((sum, k) => sum + k.forandring, 0) / botten10.length;

  const spridningsData = [
    ['Mått', 'Procentenheter'],
    ['Genomsnittlig förändring', Number(medel.toFixed(1))],
    ['Spridning mellan kommuner', Number(spridning.toFixed(1))],
  ];

  addMdToPage(`
---

## Spridning mellan kommuner

Här undersöker vi om förändringen är jämn eller ojämn mellan kommuner.

- **Genomsnittlig förändring** visar hur partiet förändrats i en genomsnittlig kommun.
- **Spridning** visar hur mycket kommunerna skiljer sig från varandra.
- Ett högt spridningsvärde betyder att partiet har väldigt olika utveckling i olika kommuner.
`);

  drawGoogleChart({
    type: 'ColumnChart',
    data: spridningsData,
    options: {
      title: `Spridning för ${parti}`,
      legend: { position: 'none' },
      vAxis: { title: 'Procent(%)' },
      colors: [farg]
    }
  });

  addMdToPage(`
---

## Slutsats för ${parti}

För **${parti}** syns den största ökningen i **${topp10[0].kommun}**, där röstandelen gick från **${topp10[0].procent2018}%** till **${topp10[0].procent2022}%**.

Det är en förändring på **${topp10[0].forandring} procent**.

Den största minskningen syns i **${botten10[0].kommun}**, där röstandelen gick från **${botten10[0].procent2018}%** till **${botten10[0].procent2022}%**.

Det är en förändring på **${botten10[0].forandring} procent**.

Den genomsnittliga förändringen bland kommunerna är **${medel.toFixed(1)} procentenheter**, och spridningen är **${spridning.toFixed(1)}**.

Det betyder att partiets utveckling inte ser likadan ut överallt. Vissa kommuner sticker ut tydligt, vilket visar att geografi spelar roll även när man analyserar på kommunnivå.
`);
}

visaParti(valtParti);