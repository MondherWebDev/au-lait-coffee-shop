import { uploadAsset, uploadAssetSigned, ASSET_CATEGORIES, getOptimizedImageUrl, getOptimizedVideoUrl } from './blob-config.js';

// Asset upload script using Cloudinary
export async function uploadHeroVideo(videoFile) {
  try {
    console.log('Uploading hero video...', videoFile.name, 'Size:', videoFile.size);

    let result;

    try {
      // Try unsigned upload first
      result = await uploadAsset(videoFile, ASSET_CATEGORIES.HERO_VIDEO);
      console.log('Unsigned upload successful:', result.url);
    } catch (unsignedError) {
      console.log('Unsigned upload failed, trying signed upload:', unsignedError.message);

      // If unsigned fails, try signed upload
      result = await uploadAssetSigned(videoFile, ASSET_CATEGORIES.HERO_VIDEO);
      console.log('Signed upload successful:', result.url);
    }

    // Get optimized video URL for web use
    const optimizedUrl = getOptimizedVideoUrl(result.public_id, {
      quality: 'auto',
      format: 'auto'
    });

    return {
      originalUrl: result.url,
      optimizedUrl: optimizedUrl,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Failed to upload hero video:', error);
    throw error;
  }
}

export async function uploadProductImages(imageFiles) {
  try {
    console.log('Uploading product images...');
    const uploadPromises = Array.from(imageFiles).map(file =>
      uploadAsset(file, ASSET_CATEGORIES.PRODUCT_IMAGES)
    );
    const results = await Promise.all(uploadPromises);

    const urls = results.map(result => {
      // Get optimized image URL for web use
      const optimizedUrl = getOptimizedImageUrl(result.public_id, {
        width: 800,
        height: 600,
        quality: 'auto',
        format: 'auto'
      });

      return {
        originalUrl: result.url,
        optimizedUrl: optimizedUrl,
        publicId: result.public_id
      };
    });

    console.log('Product images uploaded successfully:', urls.length, 'images');
    return urls;
  } catch (error) {
    console.error('Failed to upload product images:', error);
    throw error;
  }
}

export async function uploadGalleryImages(imageFiles) {
  try {
    console.log('Uploading gallery images...');
    const uploadPromises = Array.from(imageFiles).map(file =>
      uploadAsset(file, ASSET_CATEGORIES.GALLERY_IMAGES)
    );
    const results = await Promise.all(uploadPromises);

    const urls = results.map(result => {
      // Get optimized image URL for web use
      const optimizedUrl = getOptimizedImageUrl(result.public_id, {
        width: 1200,
        height: 800,
        quality: 'auto',
        format: 'auto'
      });

      return {
        originalUrl: result.url,
        optimizedUrl: optimizedUrl,
        publicId: result.public_id
      };
    });

    console.log('Gallery images uploaded successfully:', urls.length, 'images');
    return urls;
  } catch (error) {
    console.error('Failed to upload gallery images:', error);
    throw error;
  }
}

// Usage example (for browser console):
/*
import { uploadHeroVideo, uploadProductImages } from './assets/upload-assets.js';

// Upload hero video
const videoFile = document.getElementById('video-input').files[0];
const videoResult = await uploadHeroVideo(videoFile);
console.log('Video URL:', videoResult.optimizedUrl);

// Upload product images
const productFiles = document.getElementById('product-images-input').files;
const productResults = await uploadProductImages(Array.from(productFiles));
console.log('Product URLs:', productResults.map(p => p.optimizedUrl));
*/
