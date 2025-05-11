const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChrcSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "cu1": "String",
    "pa1": "String",
    "op1": "String",
    "ch1": "String",
    "ch2": "String",
    "ch3": "String",
    "ch4": "String",
    "ch5": "String",
    "ch6": "String",
    "ch7": "String",
    "ch8": "String"
  }
  );

module.exports = mongoose.model("chrc", ChrcSchema);