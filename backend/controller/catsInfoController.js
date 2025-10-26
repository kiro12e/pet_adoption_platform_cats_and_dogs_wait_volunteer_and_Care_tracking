const { getCollection } = require('../config/db');

function catsCollection() {
  return getCollection('catsInfo');
}

async function insertCatInfo(data) {
  return await catsCollection().insertOne(data);
}

async function deleteCatInfo(id) {
  return await catsCollection().deleteOne({ id });
}

async function findCatInfo(id) {
  return await catsCollection().findOne({ id });
}

async function updateCatInfo(id, updateData) {
  return await catsCollection().updateOne({ id }, { $set: updateData });
}

module.exports = { insertCatInfo, deleteCatInfo, findCatInfo, updateCatInfo };