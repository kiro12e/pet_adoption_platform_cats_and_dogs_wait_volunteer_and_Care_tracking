const {MongoClient} = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'
const client = new MongoClient(uri);

let collection = {};

async function connectDB() {

    try{
        await client.connect();

        const db = client.db('stray_pets_adoption');
        catsInfo = db.collection('cats_information');
        dogsInfo = db.collection('dogs_information');
        dog_medical = db.collection('dog_medical');
        cat_medical = db.collection('cat_medical');
        dogsAvail = db.collection('dogsAvailable');
        catsAvail = db.collection('catsAvailable');
        petAdopt = db.collection('adoptionRequest');
        
    }catch(err){
        console.log(`can't connect on mongodb`, err.message);
    }

}

async function getCollection(name){
    return collection[name];
}

module.exports = {connectDB, getCollection};


