addMdToPage(`
### Medelålder per region
Här visas data från vår SQLite-databas.
`);

dbQuery.use('grupparbete');

let data = await dbQuery('SELECT * FROM medelalder LIMIT 25');

tableFromData({ data });

console.log('data from sqlite', data);