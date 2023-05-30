require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {

    const secretName = process.env.KEY_VAULT_SECRET_NAME_TSA_MONGODB_URL;
    const keyVaultName = process.env.KEY_VAULT_NAME;

    console.log(secretName);
    console.log(keyVaultName);
    
    if (!secretName || !keyVaultName) throw Error("getSecret: Required params missing");

    connectionString = await getSecret(secretName, keyVaultName);
    process.env.TSA_MONGODB_URL = connectionString;

}

async function getConnectionInfo() {
  if (!process.env.TSA_MONGODB_URL) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.TSA_MONGODB_URL){
      throw new Error("No value in TSA_MONGODB_URL in env var");
    }
  }

  // To override the database name, set the TSA_MONGODB_NAME environment variable in the .env file
  const TSA_MONGODB_NAME = process.env.TSA_MONGODB_NAME || "azure-todo-app";

  return {
    TSA_MONGODB_URL: process.env.TSA_MONGODB_URL,
    TSA_MONGODB_NAME: process.env.TSA_MONGODB_NAME
  }
}


module.exports = {
  getConnectionInfo
}