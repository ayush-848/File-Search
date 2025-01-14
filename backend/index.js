const express = require('express');
const cors = require('cors');
const { upload, handleFileUpload } = require('./services/fileUpload'); // Ensure the correct import for both functions
const BinaryTree = require('./schemas/tree.schmea'); // Fixed typo

const app = express();
const PORT = process.env.PORT || 8080;
require('dotenv').config();

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());

const tree = new BinaryTree();

app.get('/',(req,res)=>{
  res.send('Welcome to File Search')
})

// Upload endpoint
app.post("/upload", 
  upload.single("file"), // Multer middleware for file upload
  handleFileUpload, // Additional handler if you have logic here
  (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please pass the file"
      });
    }

    // Insert the file details into the binary tree
    tree.insert(file.filename, {
      url: file.path, // Cloudinary URL or file URL
      size: file.size,
      mimetype: file.mimetype
    });

    const response = {
      success: true,
      message: "File uploaded",
      data: tree.toJSON(),
      file: file
    };

    res.json(response);
});

// Search endpoint
app.get('/search', (req, res) => {
    const key = req.query.key;
    const result = tree.search(key);

    if (result) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.json({
            success: false,
            message: "File not found"
        });
    }
});

// Show tree endpoint
app.get('/show-tree', (req, res) => {
    res.json({
        success: true,
        data: tree.toJSON()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
