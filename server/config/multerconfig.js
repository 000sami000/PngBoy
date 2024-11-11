const multer = require('multer');
const path = require('path');
const fs = require('fs');



// Create the uploadimg folder if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);  // uploadimg folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname.split(" ").join(""));  // unique file name
    }
  });
  

  
  const upload = multer({ 
    storage: storage,
   
    limits: { fileSize: 15 * 1024 * 1024 }  
  });
module.exports=upload;