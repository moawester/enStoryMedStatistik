addMdToPage(`
# Regionala Skillnader

Här undersöker vi hur olika län har röstat i riksdagsvalen 2018 och 2022. 
`);

dbQuery.use('counties-sqlite');
let countyInfo = await dbQuery('SELECT * FROM countyInfo');
console.log('Counties from SQLite', countyInfo);

dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData LIMIT 25');
console.log('geoData from mysql', geoData);

dbQuery.use('kommun-info-mongodb');
let kommunInfo = await dbQuery.collection('kommunInfo').find({}).limit(5);
console.log('kommunInfo from MongoDB', kommunInfo);

dbQuery.use('riksdagsval-neo4j');

let voteData = await dbQuery(`
    MATCH (p:Partiresultat) 
    RETURN p.kommun, p.parti, p.roster2018, p.roster2022 
    LIMIT 15
`);

console.log('voteData from Neo4j:', voteData);

dbQuery.use('tatorter.db');
let tatortData = await dbQuery('SELECT * FROM municipality_statistics LIMIT 25');
console.log('Tatorter from SQLite', tatortData);


tableFromData({ data: countyInfo });

tableFromData({ data: geoData });

tableFromData({ data: voteData });

tableFromData({ data: tatortData });