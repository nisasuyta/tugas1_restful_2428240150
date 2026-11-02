const Perusahaan = require("./models/Perusahaan");
const Lowongan = require("./models/Lowongan");

require("dotenv").config();
const connectDB = require("./config/database");
//
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// DATA AWAL


// GET /
// Informasi API

app.get("/", (req, res) => {
  res.status(200).json({
    nama: "Siti Chairunisah Suyta",
    nim: "2428240150",
    topik: 28,
    namaTopik: "Portal Karier: Lowongan Kerja",
    endpoints: [
      "GET /jobs",
      "GET /jobs/:id",
      "GET /jobs?tipe=magang",
      "POST /jobs",
      "PUT /jobs/:id",
      "DELETE /jobs/:id"
    ]
  });
});


// GET /jobs
// Body: tidak ada
// Filter contoh: /jobs?tipe=magang

app.get("/jobs", (req, res) => {
  let result = jobs;

  // Filter berdasarkan tipe
  if (req.query.tipe) {
    result = result.filter(job => job.tipe === req.query.tipe);
  }

  res.status(200).json(result);
});


// GET /jobs/:id
app.get("/jobs", async (req, res) => {
  try {
    const {
      tipe, lokasi, page = 1, limit = 10,
      sortBy = "createdAt", order = "desc", fields
    } = req.query;

    const filter = {};
    if (tipe) filter.tipe = tipe;
    if (lokasi) filter.lokasi = new RegExp(lokasi, "i");

    const data = await Lowongan.find(filter)
      .populate("perusahaan")
      .select(fields ? fields.split(",").join(" ") : "")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Lowongan.countDocuments(filter);

    res.status(200).json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// POST /jobs

// PUT /jobs/:id

// DELETE /jobs/:id
app.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Lowongan.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Lowongan tidak ditemukan"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Lowongan berhasil dihapus",
      data: job
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

// POST /perusahaan
app.post("/perusahaan", async (req, res) => {
  try {
    const perusahaan = await Perusahaan.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Perusahaan berhasil ditambahkan",
      data: perusahaan
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

// GET /perusahaan
app.get("/perusahaan", async (req, res) => {
  try {
    const perusahaan = await Perusahaan.find();

    res.status(200).json({
      status: "success",
      data: perusahaan
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

// CATCH-ALL 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

// SERVER
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

module.exports = app;