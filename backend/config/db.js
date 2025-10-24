const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'; //Connect to Mongodb and Hide the sensitive database
const client = new MongoClient(uri);

let collection = {};

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('stray_pets_adoption');

    collection = {
      catsInfo: db.collection('cats_information'),
      dogsInfo: db.collection('dogs_information'),
      dogMedical: db.collection('dog_medical'),
      catMedical: db.collection('cat_medical'),
      dogsAvailable: db.collection('dogsAvailable'),
      catsAvailable: db.collection('catsAvailable'),
      petAdopt: db.collection('adoptionRequest')
    };

    console.log('MongoDB connected');
  } catch (err) {
    console.log("Can't connect to MongoDB:", err.message);
  }
}

function getCollection(name) {
  return collection[name];
}

module.exports = { connectDB, getCollection };