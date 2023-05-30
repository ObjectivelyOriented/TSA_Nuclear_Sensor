const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const sensorSchema = new Schema({
  title: String,
  body: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("Sensor", sensorSchema);