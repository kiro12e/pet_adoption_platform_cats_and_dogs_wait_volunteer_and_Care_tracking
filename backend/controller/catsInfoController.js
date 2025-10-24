const { getCollection } = require('../config/db');

async function insertData(data) {
  const catsInfo = getCollection('catsInfo');
  return await catsInfo.insertOne(data);
}

async function deleteData(id) {
  const catsInfo = getCollection('catsInfo');
  return await catsInfo.deleteOne({ id });
}

async function filtering(id) {
  const catsInfo = getCollection('catsInfo');
  return await catsInfo.findOne({ id });
}

async function updateData(id, updateData) {
  const catsInfo = getCollection('catsInfo');
  return await catsInfo.updateOne({ id }, { $set: updateData });
}

module.exports = { insertData, deleteData, filtering, updateData };