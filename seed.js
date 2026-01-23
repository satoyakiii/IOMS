const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

const cars = [
  { name: 'Крузак', price: 10500000, quantity: 4 },
  { name: 'Hyundai Accent', price: 9200000, quantity: 9 },
  { name: 'Kia K5', price: 15800000, quantity: 5 }
];

db.serialize(() => {
  console.log('Resetting products table...');

  db.run('DELETE FROM products', (err) => {
    if (err) {
      console.error('Delete error:', err);
      return;
    }

    const stmt = db.prepare(
      'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)'
    );

    cars.forEach(c => {
      stmt.run(c.name, c.price, c.quantity, function () {
        console.log(`Inserted ${c.name} (id ${this.lastID})`);
      });
    });

    stmt.finalize(() => {
      console.log('Seed completed.');
      db.close();
    });
  });
});
