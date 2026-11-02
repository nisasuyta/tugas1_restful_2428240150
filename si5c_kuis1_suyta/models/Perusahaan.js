const mongoose = require("mongoose");

const perusahaanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  lokasi: {
    type: String,
    required: true
  },
  industri: String
});

module.exports = mongoose.model("Perusahaan", perusahaanSchema);