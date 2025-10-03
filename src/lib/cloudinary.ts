import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryCore = cloudinary;

export const getCloudinaryUrl = (publicId: string, transformations?: Record<string, string | number>) => {
  if (!publicId) return '';

  const options = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  };

  return cloudinary.url(publicId, options);
};

export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number) => {
  if (!publicId) return '';

  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    width: width || 800,
    height: height || 600,
    crop: 'fill',
    gravity: 'auto',
  });
};

export const getVideoUrl = (publicId: string) => {
  if (!publicId) return '';

  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    resource_type: 'video',
  });
};

export default cloudinary;
