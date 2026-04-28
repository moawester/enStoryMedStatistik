// Analys danderyd vka röster och lägsta röster?
//Topp 10 minskining kommuner?
// Dropdown
//procent
addMdToPage(`# Den geografiska trenden

## Vilket parti dominerade valet mellan 2018 och 2022?
Innan vi går in på kommuner, vilket parti fick flest röster i hela Sverige?

---`);

dbQuery.use('riksdagsval-neo4j');
const totalt = await dbQuery(`
  MATCH (n:Partiresultat)
  RETURN n.parti AS parti, 
         SUM(n.roster2018) AS roster2018,
         SUM(n.roster2022) AS roster2022
  ORDER BY roster2022 DESC
  LIMIT 8
`);

const valData = [
  ['Parti', '2018', '2022'],
  ...totalt.map(p => [p.parti, p.roster2018, p.roster2022])
];

drawGoogleChart({
  type: 'BarChart',
  data: valData,
  options: {
    title: 'Röster per parti 2018-2022',
    height: 400,
    colors: ['#b22222', '#e8453c'],
    legend: { position: 'top' }
  }
});

addMdToPage(`
Socialdemokraterna dominerade valet 2022 med nästan 2 miljoner röster. 
Vi ska titta närmare på var i Sverige som Socialdemkraterna fick flest röster från
`);


dbQuery.use('riksdagsval-neo4j');
const topp10 = await dbQuery(`
  MATCH (n:Partiresultat)
  WHERE n.parti = "Arbetarepartiet-Socialdemokraterna"
  RETURN n.kommun AS kommun,
         n.roster2018 AS roster2018,
         n.roster2022 AS roster2022,
         round(((n.roster2022 - n.roster2018) * 100.0 / n.roster2018), 1) AS forandringProcent
  ORDER BY forandringProcent DESC
  LIMIT 10
`);

dbQuery.use('geo-mysql');
const geoData = await dbQuery('SELECT municipality, county FROM geoData GROUP BY municipality, county');

const kombinerad = topp10.map(e => {
  const geo = geoData.find(g => g.municipality === e.kommun);
  return {
    kommun: e.kommun,
    roster2018: e.roster2018,
    roster2022: e.roster2022,
    forandringProcent: e.forandringProcent,
    lan: geo ? geo.county : 'Okänt'
  };
});

const diagramData = kombinerad.slice(0, 10).map(k => ({
  kommun: k.kommun,
  forandringProcent: Number(k.forandringProcent)
}));

addMdToPage(`---
## Var ökade Socialdemokraterna mest? Topp 10 kommuner
Vi räknade ut den procentuella förändringen per kommun mellan 2018 och 2022.
Vår hypotes är att Socialdemokraterna ökade i glesbygd i norra Sverige, stämde det?

---`);

drawGoogleChart({
  type: 'BarChart',
  data: makeChartFriendly(diagramData, 'kommun', 'forandringProcent'),
  options: {
    title: 'Topp 10 kommuner 2018-2022',
    height: 450,
    chartArea: { left: 100, height: '70%' },
    colors: ['#e8453c'],
    hAxis: { title: 'Röster (%)' },
    legend: { position: 'none' }
  }
});

