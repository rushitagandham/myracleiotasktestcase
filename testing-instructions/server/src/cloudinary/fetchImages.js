const {cloudinary, upload} = require('../../config/cloudinaryConfig');

async function fetchImages() {
  try {
    const folderName = 'testing-instructions';

    console.log('Cloudinary config:', cloudinary.config().cloud_name);

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderName,
      max_results: 10
    });


    console.log('Cloudinary API response:', result); 
    
    const imageUrls = result.resources.map(resource => cloudinary.url(resource.public_id));
    console.log('Fetched Image URLs:', imageUrls); 
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    throw error;
  }
}

module.exports = fetchImages;
