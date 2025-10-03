// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dci2zslwa',
  uploadPreset: 'ml_default', // Using default unsigned preset
  apiKey: '919664343522282', // Your API key for signed uploads if needed
};

// Asset upload function using Cloudinary
export async function uploadAsset(file, folder = 'coffee-shop') {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (limit to 100MB for free tier)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.size} bytes. Maximum is ${maxSize} bytes (100MB)`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    console.log('Uploading to:', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with response:', errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      original_filename: result.original_filename
    };
  } catch (error) {
    console.error('Error uploading asset:', error);
    throw error;
  }
}

// Alternative upload method using signed upload (if unsigned fails)
export async function uploadAssetSigned(file, folder = 'coffee-shop') {
  try {
    console.log('Trying signed upload for file:', file.name);

    // Get timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create signature (this would normally be done server-side)
    const params = {
      folder: folder,
      timestamp: timestamp,
      upload_preset: CLOUDINARY_CONFIG.uploadPreset
    };

    const formData = new FormData();
    formData.append('file', file);
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Signed upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Error with signed upload:', error);
    throw error;
  }
}

// Function to get optimized image URL
export function getOptimizedImageUrl(publicId, transformations = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = transformations;
  let transformationString = '';

  if (width) transformationString += `w_${width},`;
  if (height) transformationString += `h_${height},`;
  if (quality !== 'auto') transformationString += `q_${quality},`;
  if (format !== 'auto') transformationString += `f_${format},`;

  // Remove trailing comma
  transformationString = transformationString.replace(/,$/, '');

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/fetch/${transformationString ? transformationString + '/' : ''}v1/${publicId}`;
}

// Function to get optimized video URL
export function getOptimizedVideoUrl(publicId, transformations = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = transformations;
  let transformationString = '';

  if (width) transformationString += `w_${width},`;
  if (height) transformationString += `h_${height},`;
  if (quality !== 'auto') transformationString += `q_${quality},`;
  if (format !== 'auto') transformationString += `f_${format},`;

  // Remove trailing comma
  transformationString = transformationString.replace(/,$/, '');

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/fetch/${transformationString ? transformationString + '/' : ''}v1/${publicId}`;
}

// Asset categories
export const ASSET_CATEGORIES = {
  HERO_VIDEO: 'coffee-shop/videos',
  PRODUCT_IMAGES: 'coffee-shop/images/products',
  GALLERY_IMAGES: 'coffee-shop/gallery'
};
