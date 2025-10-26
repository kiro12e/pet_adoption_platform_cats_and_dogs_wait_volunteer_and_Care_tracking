const { getCollection } = require('../config/pets/db');

function catMedicalCollection() {
  return getCollection('catMedical');
}

async function insertMedical(data) {
  return await catMedicalCollection().insertOne(data);
}

async function deleteMedical(id) {
  return await catMedicalCollection().deleteOne({ id });
}

async function findMedical(id) {
  return await catMedicalCollection().findOne({ id });
}

async function updateMedical(id, updateData) {
  return await catMedicalCollection().updateOne({ id }, { $set: updateData });
}

module.exports = { insertMedical, deleteMedical, findMedical, updateMedical };