require('dotenv').config();

const { MongoClient, ObjectId } = require('mongodb');


const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'ioms_db';

let db = null;
let client = null;


async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}


function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}


async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
  ObjectId
};