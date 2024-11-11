const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../tmpcsv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "tmpcsv/"); // Temporary directory for storing CSV/Excel files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const csvupload = multer({ storage });
  module.exports=csvupload;