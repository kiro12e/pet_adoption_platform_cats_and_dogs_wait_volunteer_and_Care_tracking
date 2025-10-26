const { getCollection } = require('../config/pets/db');


function dogsCollection() {
  return getCollection('dogsInfo');
}

async function insertDogInfo(data) {
  return await dogsCollection().insertOne(data);
}

async function deleteDogInfo(id) {
  return await dogsCollection().deleteOne({ id });
}

async function findDogInfo(id) {
  return await dogsCollection().findOne({ id });
}

async function updateDogInfo(id, updateData) {
  return await dogsCollection().updateOne({ id }, { $set: updateData });
}

module.exports = { insertDogInfo, deleteDogInfo, findDogInfo, updateDogInfo };