require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { cloudinary, upload } = require('./config/cloudinaryConfig');
const fetchImages = require('./src/cloudinary/fetchImages');
const sendToGPT4 = require('./src/api/gpt4');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/upload', upload.array('images', 10), async (req, res) => {
  try {
    const uploadedUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'testing-instructions',
      });
      uploadedUrls.push(result.secure_url);
    }

    res.status(200).json({ message: 'Images uploaded successfully', urls: uploadedUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

app.get('/api/generate-test-cases', async (req, res) => {
  try {
    const imageUrls = await fetchImages();

    if (!Array.isArray(imageUrls)) {
      throw new Error('Expected imageUrls to be an array');
    }

    const context = 'Please generate test cases for the functionalities shown in these images. ';

    console.log('Processing images:', imageUrls);

    const testCases = await sendToGPT4(imageUrls, context);

    res.status(200).json({ message: 'Test cases generated successfully', testCases });
  } catch (error) {
    console.error('Error in processing:', error);
    res.status(500).json({ message: 'Error generating test cases' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});