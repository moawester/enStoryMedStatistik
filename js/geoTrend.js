
dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData  ORDER BY latitude LIMIT 25');
tableFromData({ data: geoData.map(x => ({ ...x, position: JSON.stringify(x.position) })) });
console.log('geoData from mysql', geoData);


dbQuery.use('riksdagsval-neo4j');
let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n LIMIT 25');
tableFromData({
  data: electionResults
    // egenskaper/kolumner kommer i lite konstig ordning från Neo - mappa i trevligare ordning
    .map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({ ids: ids.identity, kommun, roster2018, roster2022, parti, labels }))
});
