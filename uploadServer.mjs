import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';

const app = express();
const port = 3090;

app.use(cors());
app.use(bodyParser.json());

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ccisconnectusers'
});

const __dirname = path.resolve();
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save with original name and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.json());

app.use('/uploads', express.static(uploadDir));

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello from Express?');
});

// Upload endpoint (single file)
app.post('/uploads', upload.array('files', 10), async (req, res) => {
  const { title, user_id } = req.body;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  if (!title || !user_id) {
    return res.status(400).json({ error: 'Missing title or user_id' });
  }

  try {
    for (const file of req.files) {
      await db.query(
        'INSERT INTO uploaded_files (filename, originalname, title, user_id) VALUES (?, ?, ?, ?)',
        [file.filename, file.originalname, title, user_id]
      );
    }
    res.json({ message: 'Files uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

app.get('/list-uploads', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.id, f.filename, f.originalname, f.title, f.uploaded_at, u.username
      FROM uploaded_files f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.uploaded_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Delete file endpoint
app.delete('/uploads/:id', async (req, res) => {
  const fileId = req.params.id;
  try {
    // Get filename from DB
    const [[file]] = await db.query('SELECT filename FROM uploaded_files WHERE id = ?', [fileId]);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Delete file from disk
    const filePath = path.join(uploadDir, file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete from DB
    await db.query('DELETE FROM uploaded_files WHERE id = ?', [fileId]);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});