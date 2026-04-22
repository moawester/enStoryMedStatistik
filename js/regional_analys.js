addMdToPage(`
# Regionala Skillnader

Här undersöker vi hur olika län har röstat i riksdagsvalen 2018 och 2022. 
`);

async function runRegionalAnalysis() {
  try {
    // 1. Hämta länsinfo från SQLite
    dbQuery.use('counties-sqlite');
    let countyInfo = await dbQuery('SELECT * FROM counties');
  

    // 2. Hämta valdata 2022 från Neo4j
    dbQuery.use('riksdagsval-neo4j');
    let votes2022 = await dbQuery(`
            MATCH (c:County)-[:HAS_MUNICIPALITY]->(m:Municipality)-[:HAS_VOTES]->(v:Votes {year: 2022})
            RETURN c.name AS county, 
                   m.name AS municipality,
                   v.S AS S,
                   v.M AS M,
                   v.SD AS SD,
                   v.V AS V,
                   v.MP AS MP,
                   v.C AS C,
                   v.L AS L,
                   v.KD AS KD
        `);
    console.log('Valdata 2022 hämtad:', votes2022.length, 'rader');

    // 3. Hämta valdata 2018 från Neo4j
    let votes2018 = await dbQuery(`
            MATCH (c:County)-[:HAS_MUNICIPALITY]->(m:Municipality)-[:HAS_VOTES]->(v:Votes {year: 2018})
            RETURN c.name AS county, 
                   m.name AS municipality,
                   v.S AS S,
                   v.M AS M,
                   v.SD AS SD,
                   v.V AS V,
                   v.MP AS MP,
                   v.C AS C,
                   v.L AS L,
                   v.KD AS KD
        `);
    console.log('Valdata 2018 hämtad:', votes2018.length, 'rader');
  } catch (error) {
    console.error('Fel vid hämtning av data:', error);
  }
}

console.log('Länsinfo hämtad:', countyInfo.length, 'län');

dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData LIMIT 25');
console.log('geoData from mysql', geoData);

dbQuery.use('kommun-info-mongodb');
// Prova olika samlingsnamn
let kommunInfo = await dbQuery.collection('kommunInfo').find({}).limit(5);
console.log('kommunInfo from MongoDB', kommunInfo);

// Visa tabellen med geoData som fungerar
tableFromData({ data: geoData });