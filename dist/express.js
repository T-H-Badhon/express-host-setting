"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
// Create an Express app
const app = (0, express_1.default)();
// Enable CORS for all origins
app.use((0, cors_1.default)());
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Set up the storage engine for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
// Initialize multer with storage configuration
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({
        message: 'File uploaded successfully!',
        filename: req.file.filename,
    });
});
// Serve static files (images) from the "uploads" folder
app.use('/uploads', express_1.default.static(uploadsDir));
// Route to get an uploaded image by filename
app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path_1.default.join(uploadsDir, filename);
    if (fs_1.default.existsSync(imagePath)) {
        res.sendFile(imagePath);
    }
    else {
        res.status(404).send('Image not found');
    }
});
// Use error handling middleware
app.use(errorHandler);
exports.default = app;
