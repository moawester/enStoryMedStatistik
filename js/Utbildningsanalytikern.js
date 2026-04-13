const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('counties.sqlite3');

db.all("SELECT * FROM countyInfo", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(rows);
});

db.close();