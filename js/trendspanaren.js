addMdToPage(`
# Trendspaneren!!!!!
  `);
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({}).limit(100);
tableFromData({ data: income });
console.log('income from mongodb', income);