import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

// Create an Express app
const app = express();

// Enable CORS for all origins
app.use(cors());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up the storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Initialize multer with storage configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// Route to handle image upload
app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.status(200).json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
  });
});

// Serve static files (images) from the "uploads" folder
app.use('/uploads', express.static(uploadsDir));

// Route to get an uploaded image by filename
app.get('/image/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const imagePath = path.join(uploadsDir, filename);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send('Image not found');
  }
});

// Use error handling middleware
app.use(errorHandler);

export default app;

