const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// DATA AWAL

let jobs = [
  {
    id: 1,
    posisi: "Backend Developer Intern",
    perusahaan: "PT Kode Maju",
    lokasi: "Jakarta",
    tipe: "magang",
    gajiMin: 2000000,
    gajiMax: 3000000
  },
  {
    id: 2,
    posisi: "Frontend Developer",
    perusahaan: "PT Digital Nusantara",
    lokasi: "Palembang",
    tipe: "full-time",
    gajiMin: 5000000,
    gajiMax: 8000000
  },
  {
    id: 3,
    posisi: "UI/UX Designer",
    perusahaan: "CV Kreatif Indonesia",
    lokasi: "Bandung",
    tipe: "part-time",
    gajiMin: 2500000,
    gajiMax: 4000000
  }
];

let nextId = 4;


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
// Body: tidak ada

app.get("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const job = jobs.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({
      status: "error",
      message: `Lowongan kerja dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  res.status(200).json(job);
});


// POST /jobs
// Body:
// {
//   "posisi": "Backend Developer Intern",
//   "perusahaan": "PT Kode Maju",
//   "lokasi": "Jakarta",
//   "tipe": "magang",
//   "gajiMin": 2000000,
//   "gajiMax": 3000000
// }

app.post("/jobs", (req, res) => {
  const {
    posisi,
    perusahaan,
    lokasi,
    tipe,
    gajiMin,
    gajiMax
  } = req.body;

  // Validasi field wajib
  if (
    !posisi ||
    !perusahaan ||
    !lokasi ||
    !tipe
  ) {
    return res.status(400).json({
      status: "error",
      message: "Field posisi, perusahaan, lokasi, dan tipe wajib diisi",
      data: null
    });
  }

  // Validasi tipe
  if (!["full-time", "part-time", "magang"].includes(tipe)) {
    return res.status(400).json({
      status: "error",
      message: "Tipe harus berupa full-time, part-time, atau magang",
      data: null
    });
  }

  const newJob = {
    id: nextId++,
    posisi,
    perusahaan,
    lokasi,
    tipe,
    gajiMin,
    gajiMax
  };

  jobs.push(newJob);

  res.status(201).json({
    status: "success",
    message: "Data lowongan kerja berhasil ditambahkan",
    data: newJob
  });
});


// PUT /jobs/:id
// Body:
// {
//   "posisi": "Backend Developer",
//   "perusahaan": "PT Kode Maju",
//   "lokasi": "Jakarta",
//   "tipe": "full-time",
//   "gajiMin": 6000000,
//   "gajiMax": 9000000
// }
// ===============================

app.put("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = jobs.findIndex(job => job.id === id);

  // Validasi ID
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Lowongan kerja dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  const {
    posisi,
    perusahaan,
    lokasi,
    tipe,
    gajiMin,
    gajiMax
  } = req.body;

  // Validasi field wajib
  if (
    !posisi ||
    !perusahaan ||
    !lokasi ||
    !tipe
  ) {
    return res.status(400).json({
      status: "error",
      message: "Field posisi, perusahaan, lokasi, dan tipe wajib diisi",
      data: null
    });
  }

  // Validasi tipe
  if (!["full-time", "part-time", "magang"].includes(tipe)) {
    return res.status(400).json({
      status: "error",
      message: "Tipe harus berupa full-time, part-time, atau magang",
      data: null
    });
  }

  // PUT mengganti seluruh data
  const updatedJob = {
    id,
    posisi,
    perusahaan,
    lokasi,
    tipe,
    gajiMin,
    gajiMax
  };

  jobs[index] = updatedJob;

  res.status(200).json({
    status: "success",
    message: `Data lowongan kerja dengan id ${id} berhasil diperbarui`,
    data: updatedJob
  });
});


// DELETE /jobs/:id
// Body: tidak ada

app.delete("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = jobs.findIndex(job => job.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Lowongan kerja dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  jobs.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data lowongan kerja dengan id ${id} berhasil dihapus`,
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;