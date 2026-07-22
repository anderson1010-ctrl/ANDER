import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createDatabaseIfNeeded, getPool } from './db.js';
import { ADOPTION_PETS, LOST_REPORTS } from './seedData.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const allowedOrigins = [frontendOrigin, 'http://localhost:3002'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked origin: ${origin}`));
      }
    },
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(process.cwd(), 'dist')));

function mapPetRow(row) {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    gender: row.gender,
    age: row.age,
    image: row.image,
    category: row.category,
    status: row.status,
    description: row.description,
    temperament: row.temperament ? JSON.parse(row.temperament) : [],
    location: row.location,
    size: row.size,
    vaccinated: Boolean(row.vaccinated),
    neutered: Boolean(row.neutered),
  };
}

function mapReportRow(row) {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    description: row.description,
    image: row.image,
    lastLocation: row.lastLocation,
    lastSeenTime: row.lastSeenTime,
    reportedAt: row.reportedAt,
    contactNumber: row.contactNumber,
    isUrgent: Boolean(row.isUrgent),
    ownerName: row.ownerName,
    ownerAvatar: row.ownerAvatar,
  };
}

async function setupSchema(pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS adoption_pets (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      breed VARCHAR(100) NOT NULL,
      gender ENUM('Macho','Hembra') NOT NULL,
      age VARCHAR(50) NOT NULL,
      image TEXT NOT NULL,
      category ENUM('Perros','Gatos','Otros') NOT NULL,
      status ENUM('Saludable','Urgente','En Proceso','Adoptado') NOT NULL,
      description TEXT NOT NULL,
      temperament TEXT,
      location VARCHAR(255),
      size VARCHAR(100),
      vaccinated TINYINT(1) DEFAULT 0,
      neutered TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS lost_reports (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      breed VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      lastLocation VARCHAR(255) NOT NULL,
      lastSeenTime VARCHAR(100) NOT NULL,
      reportedAt VARCHAR(100) NOT NULL,
      contactNumber VARCHAR(60) NOT NULL,
      isUrgent TINYINT(1) DEFAULT 0,
      ownerName VARCHAR(100) NOT NULL,
      ownerAvatar TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function seedTable(pool) {
  const petInsert = `
    INSERT INTO adoption_pets (
      id, name, breed, gender, age, image, category, status,
      description, temperament, location, size, vaccinated, neutered
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      breed = VALUES(breed),
      gender = VALUES(gender),
      age = VALUES(age),
      image = VALUES(image),
      category = VALUES(category),
      status = VALUES(status),
      description = VALUES(description),
      temperament = VALUES(temperament),
      location = VALUES(location),
      size = VALUES(size),
      vaccinated = VALUES(vaccinated),
      neutered = VALUES(neutered);
  `;

  for (const pet of ADOPTION_PETS) {
    await pool.execute(petInsert, [
      pet.id,
      pet.name,
      pet.breed,
      pet.gender,
      pet.age,
      pet.image,
      pet.category,
      pet.status,
      pet.description,
      JSON.stringify(pet.temperament || []),
      pet.location || null,
      pet.size || null,
      pet.vaccinated ? 1 : 0,
      pet.neutered ? 1 : 0,
    ]);
  }

  const reportInsert = `
    INSERT INTO lost_reports (
      id, name, breed, description, image, lastLocation,
      lastSeenTime, reportedAt, contactNumber, isUrgent,
      ownerName, ownerAvatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      breed = VALUES(breed),
      description = VALUES(description),
      image = VALUES(image),
      lastLocation = VALUES(lastLocation),
      lastSeenTime = VALUES(lastSeenTime),
      reportedAt = VALUES(reportedAt),
      contactNumber = VALUES(contactNumber),
      isUrgent = VALUES(isUrgent),
      ownerName = VALUES(ownerName),
      ownerAvatar = VALUES(ownerAvatar);
  `;

  for (const report of LOST_REPORTS) {
    await pool.execute(reportInsert, [
      report.id,
      report.name,
      report.breed,
      report.description,
      report.image,
      report.lastLocation,
      report.lastSeenTime,
      report.reportedAt,
      report.contactNumber,
      report.isUrgent ? 1 : 0,
      report.ownerName,
      report.ownerAvatar || null,
    ]);
  }
}

app.get('/api/pets', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM adoption_pets ORDER BY id');
    res.json(rows.map(mapPetRow));
  } catch (error) {
    console.error('GET /api/pets error', error);
    res.status(500).json({ message: 'No se pudo obtener las mascotas.' });
  }
});

app.put('/api/pets/:id/status', async (req, res) => {
  const petId = req.params.id;
  const { status } = req.body;

  if (!petId || !status) {
    return res.status(400).json({ message: 'ID y estado son obligatorios.' });
  }

  try {
    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE adoption_pets SET status = ? WHERE id = ?',
      [status, petId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mascota no encontrada.' });
    }

    const [rows] = await pool.query('SELECT * FROM adoption_pets WHERE id = ?', [petId]);
    res.json(mapPetRow(rows[0]));
  } catch (error) {
    console.error('PUT /api/pets/:id/status error', error);
    res.status(500).json({ message: 'No se pudo actualizar el estado de la mascota.' });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM lost_reports ORDER BY id');
    res.json(rows.map(mapReportRow));
  } catch (error) {
    console.error('GET /api/reports error', error);
    res.status(500).json({ message: 'No se pudo obtener los reportes.' });
  }
});

app.post('/api/reports', async (req, res) => {
  const {
    name,
    breed,
    description,
    image,
    lastLocation,
    lastSeenTime,
    contactNumber,
    isUrgent,
    ownerName,
    ownerAvatar,
  } = req.body;

  if (!name || !breed || !description || !lastLocation || !contactNumber || !ownerName) {
    return res.status(400).json({ message: 'Faltan campos obligatorios en el reporte.' });
  }

  const newReport = {
    id: `report-${Date.now()}`,
    name,
    breed,
    description,
    image: image || '',
    lastLocation,
    lastSeenTime: lastSeenTime || 'Ahora mismo',
    reportedAt: 'Ahora mismo',
    contactNumber,
    isUrgent: isUrgent ? 1 : 0,
    ownerName,
    ownerAvatar: ownerAvatar || null,
  };

  try {
    const pool = getPool();
    await pool.execute(
      `INSERT INTO lost_reports (
        id, name, breed, description, image, lastLocation,
        lastSeenTime, reportedAt, contactNumber, isUrgent,
        ownerName, ownerAvatar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newReport.id,
        newReport.name,
        newReport.breed,
        newReport.description,
        newReport.image,
        newReport.lastLocation,
        newReport.lastSeenTime,
        newReport.reportedAt,
        newReport.contactNumber,
        newReport.isUrgent,
        newReport.ownerName,
        newReport.ownerAvatar,
      ]
    );

    res.status(201).json({
      ...newReport,
      isUrgent: Boolean(newReport.isUrgent),
    });
  } catch (error) {
    console.error('POST /api/reports error', error);
    res.status(500).json({ message: 'No se pudo guardar el reporte.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

async function startServer() {
  try {
    await createDatabaseIfNeeded();
    const pool = getPool();
    await setupSchema(pool);
    await seedTable(pool);
    app.listen(port, () => {
      console.log(`Servidor API disponible en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fallo al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
