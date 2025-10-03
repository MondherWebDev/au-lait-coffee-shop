# Asset Management System - Golden Bean Brews

This system allows you to easily upload and manage your website assets (videos and images) using **Cloudinary** - a powerful media management platform.

## 🚀 Quick Start

### 1. Set Up Cloudinary (Free)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your **Dashboard** and copy your **Cloud Name**
3. Navigate to **Settings** → **Upload** → **Upload presets**
4. Click **"Create upload preset"** and select **"Unsigned"**
5. Copy the preset name and replace values in `.env.local` file

### 2. Upload Your Assets

1. Open `assets/asset-manager.html` in your browser
2. Upload your hero video (MP4 format recommended)
3. Upload your product images (JPG, PNG format)
4. Upload your gallery images (JPG, PNG format)
5. Copy the generated **optimized URLs**

### 3. Update Your Website

The uploaded assets will be automatically applied to your website. The system stores the URLs in browser localStorage for persistence.

## 📁 Folder Structure

```
assets/
├── images/
│   └── products/     # Product images for menu items
├── videos/           # Hero section videos
├── gallery/          # Gallery images
├── blob-config.js    # Cloudinary configuration
├── upload-assets.js  # Upload functions
├── update-website.js # Website update utilities
├── asset-manager.html # Upload interface
└── README.md         # This file
```

## 🔧 Configuration

### Environment Variables (.env.local)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### Asset Categories
- **Hero Video**: Main video for the homepage hero section
- **Product Images**: Images for coffee products in the menu
- **Gallery Images**: Images for the gallery section

## 💡 Features

- ✅ **Generous Free Tier**: 25GB storage + 25GB bandwidth monthly
- ✅ **Automatic Optimization**: Images and videos optimized for web delivery
- ✅ **Multiple Formats**: Support for MP4, WebP, AVIF, and more
- ✅ **Persistent URLs**: Once uploaded, URLs remain stable
- ✅ **Easy Management**: Beautiful web interface for uploads
- ✅ **Browser Storage**: URLs cached in localStorage
- ✅ **No GitHub Required**: Works independently of project hosting
- ✅ **Multiple Projects**: Use same account for multiple websites

## 🔗 Supported Formats

### Videos
- MP4 (recommended)
- WebM
- MOV
- AVI

### Images
- JPG/JPEG
- PNG
- WebP
- AVIF
- GIF

## 🚀 Advanced Features

### Automatic Optimization
- **Images**: Automatic format conversion, quality adjustment, responsive sizing
- **Videos**: Adaptive bitrate streaming, format optimization
- **Delivery**: CDN distribution with global edge locations

### Organization
- **Folders**: Assets organized by project and type
- **Naming**: Consistent naming conventions
- **Search**: Find assets easily in Cloudinary dashboard

## 🚨 Important Notes

1. **Account Security**: Keep your Cloudinary credentials secure
2. **File Sizes**: Large files may take longer to upload
3. **Format Support**: Ensure your files are in supported formats
4. **Browser Compatibility**: Test video playback across browsers

## 🆘 Troubleshooting

### Common Issues

1. **Upload Fails**: Check that your Cloudinary credentials are correct in `.env.local`
2. **Assets Don't Load**: Ensure the uploaded URLs are accessible
3. **Permission Errors**: Verify your upload preset is configured correctly

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Cloudinary configuration in the dashboard
3. Ensure your upload preset is set to "Unsigned"

## 📊 Pricing

Cloudinary offers an excellent free tier:
- **Free**: 25GB storage, 25GB bandwidth per month
- **Paid Plans**: Start at $89/month for higher limits

Perfect for coffee shop websites and small businesses!

## 🔄 Multiple Projects

You can use the same Cloudinary account for multiple projects:

```
Cloudinary Dashboard/
├── coffee-shop/
│   ├── videos/
│   ├── images/products/
│   └── gallery/
├── portfolio/
│   └── images/
└── blog/
    └── assets/
```

## 📝 Best Practices

1. **Organize by Project**: Use folders to separate different websites
2. **Optimize Before Upload**: Compress large files for faster uploads
3. **Use Optimized URLs**: Always use the optimized URLs for better performance
4. **Regular Cleanup**: Remove unused assets to stay within free tier limits

---

*Built with ❤️ for Golden Bean Brews*
