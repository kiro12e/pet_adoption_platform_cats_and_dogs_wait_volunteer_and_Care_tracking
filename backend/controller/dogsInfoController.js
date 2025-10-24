const { getCollection } = require('../config/db');

function dogsCollection() {
  return getCollection('dogsInfo'); 
}

async function insertData(data) {
  return await dogsCollection().insertOne(data);
}

async function deleteData(id) {
  return await dogsCollection().deleteOne({ id });
}

async function filtering(id) {
  return await dogsCollection().findOne({ id });
}

async function updateData(id, updateData) {
  return await dogsCollection().updateOne({ id }, { $set: updateData });
}

module.exports = { insertData, deleteData, filtering, updateData };