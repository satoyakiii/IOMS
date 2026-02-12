
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'ioms_db';

const admins = [
  { name: 'Kuanyshbek Aisana', email: 'aisana@example.com', password: 'ChangeThisStrongPass1!' },
  { name: 'Rakhmanova Assem', email: 'assem@example.com', password: 'ChangeThisStrongPass2!' }
];

(async function createAdmins() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    for (const a of admins) {
      const exists = await users.findOne({ email: a.email.toLowerCase() });
      if (exists) {
        console.log('Admin exists:', a.email);
        continue;
      }
      const hashed = await bcrypt.hash(a.password, 10);
      const doc = {
        name: a.name,
        email: a.email.toLowerCase(),
        password: hashed,
        role: 'admin',
        createdAt: new Date()
      };
      await users.insertOne(doc);
      console.log('Inserted admin:', a.email, 'password:', a.password);
    }
    console.log('Done');
  } catch (err) {
    console.error('Error creating admins:', err);
  } finally {
    await client.close();
  }
})();
