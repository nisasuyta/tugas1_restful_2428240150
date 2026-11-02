const mongoose = require("mongoose");

const lowonganSchema = new mongoose.Schema({
  posisi: {
    type: String,
    required: true
  },
  lokasi: String,
  tipe: {
    type: String,
    enum: ["full-time", "part-time", "magang"],
    required: true
  },
  gajiMin: Number,
  gajiMax: Number,

  perusahaan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Perusahaan",
    required: true
  },

  persyaratan: [String]
}, { timestamps: true });

module.exports = mongoose.model("Lowongan", lowonganSchema);