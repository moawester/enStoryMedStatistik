addMdToPage(`
  ### Medel- och medianårsinkomst i tusentals kronor, per kommun, från MongoDB
  (Endast de 25 första av många poster.)
  `);
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({}).limit(25);
tableFromData({ data: income });
console.log('income from mongodb', income);