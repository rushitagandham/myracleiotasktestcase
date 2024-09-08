const express = require('express');
const { upload } = require('../config/cloudinaryConfig');

const router = express.Router();


router.post('/upload', upload.array('images'), (req, res) => {
  try {
    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    res.json({ success: true, uploadedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
