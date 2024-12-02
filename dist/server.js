"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors")); // Import cors package
// Create an Express app
const app = (0, express_1.default)();
// Enable CORS for all origins
app.use((0, cors_1.default)());
// Set up the storage engine for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Specify the upload folder
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Ensure unique filenames by appending the timestamp
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
// Initialize multer with storage configuration
const upload = (0, multer_1.default)({ storage: storage });
// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    // Return the status and the filename
    res.status(200).send({
        message: 'File uploaded successfully!',
        filename: req.file.filename, // Send the filename as part of the response
    });
});
// Serve static files (images) from the "uploads" folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Route to get an uploaded image by filename
app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path_1.default.join(__dirname, '../uploads', filename);
    // Check if the file exists
    if (fs_1.default.existsSync(imagePath)) {
        res.sendFile(imagePath); // Send the image file
    }
    else {
        res.status(404).send('Image not found');
    }
});
// Make sure the uploads directory exists
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
// Start the server on port 3005
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
