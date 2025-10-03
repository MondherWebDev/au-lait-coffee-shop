# 🚀 Au Lait Coffee Shop - Persistent Backend Setup

## 🎯 Problem Solved

**Before**: Website data (logo, hero video, products, etc.) was stored in browser localStorage, which meant:
- ❌ Data was lost when reopening the website
- ❌ Each browser/device had different content
- ❌ Server restarts cleared all content
- ❌ No real persistence across sessions

**After**: Full backend persistence with:
- ✅ **SQLite database** for reliable data storage
- ✅ **REST API** for content management
- ✅ **Persistent across sessions** - data survives browser restarts
- ✅ **Cross-device sync** - same content everywhere
- ✅ **Server-side storage** - survives server restarts

## 🛠️ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the environment template
cp .env.local .env.local

# Edit with your settings (optional for development)
# Add your Cloudinary credentials if you want image uploads
```

### 3. Start Both Servers
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the Next.js frontend
npm run dev
```

### 4. Access Your Website
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: Press `Ctrl+Shift+A` on the website

## 📋 Detailed Setup Guide

### Backend Server Setup

The backend server runs on port 3001 and provides:
- REST API endpoints for content management
- SQLite database for data persistence
- File upload handling for images/videos

**Starting the backend:**
```bash
# Development mode (auto-restarts on changes)
npm run server:dev

# Production mode
npm run server
```

### Database Structure

The SQLite database includes these tables:
- `content` - All website content (logo, hero, about, etc.)
- `categories` - Product categories
- `products` - Menu items with pricing
- `gallery_images` - Photo gallery images
- `site_settings` - Website configuration

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content` | Get all website content |
| GET | `/api/content/:type` | Get specific content section |
| POST | `/api/content/:type` | Update content section |
| POST | `/api/content/bulk` | Update multiple sections |
| GET | `/api/content/categories/all` | Get all categories |
| POST | `/api/content/categories` | Add new category |
| GET | `/api/content/products/all` | Get all products |
| POST | `/api/content/products` | Add new product |

## 🔧 Configuration

### Required Environment Variables

Create a `.env.local` file in your project root:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=./server/aulait.db

# Cloudinary (Optional - for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Setup (Optional)

For image/video uploads in the admin panel:

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env.local` file
4. Create an upload preset named `au_lait_preset`

## 🚀 Usage

### Adding Content via Admin Dashboard

1. **Open the website**: http://localhost:3000
2. **Access admin**: Press `Ctrl+Shift+A`
3. **Add your content**:
   - Upload logo in Settings tab
   - Add hero video/text in Hero tab
   - Add products in Menu tab
   - Configure categories
   - Set contact information
4. **Save changes**: Click "Save All Changes"

### Content Persistence

- ✅ **Automatic saving** to SQLite database
- ✅ **Cross-session persistence** - survives browser restarts
- ✅ **Server persistence** - survives server restarts
- ✅ **Local backup** - also saves to localStorage as fallback

## 🔍 Troubleshooting

### Mobile Access Issues

**Problem**: No data when accessing from mobile (192.168.106.129:3000)

#### 🔧 **Step-by-Step Diagnosis:**

**Step 1: Test the Backend Server**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Test if server is running
curl http://localhost:3001/api/health
```

**Step 2: Use the Mobile Test Page**
```bash
# Open in your mobile browser:
http://192.168.106.129:3001/mobile-test.html

# Or on desktop:
http://localhost:3001/mobile-test.html
```

**Step 3: Check Server Accessibility**
```bash
# Test from mobile browser:
http://192.168.106.129:3001/api/health

# Should return: {"status": "OK", "message": "Au Lait Coffee Shop API is running"}
```

**Step 4: Verify Your Mobile IP**
```bash
# iOS: Settings > WiFi > Your Network > IP Address
# Android: Settings > Network > WiFi > Your Network > IP Address
# Make sure it starts with 192.168.1 or similar
```

#### 🚨 **Common Issues & Solutions:**

**Issue: "Connection refused" or "Network Error"**
```bash
# ✅ Solution: Backend server not running
# 1. Start the server: npm run server
# 2. Wait for "Server running on 0.0.0.0:3001" message
# 3. Test: http://localhost:3001/api/health
```

**Issue: "CORS error" in browser console**
```bash
# ✅ Solution: Server is running but blocking requests
# 1. Check server logs for "Blocked CORS request" messages
# 2. Verify your mobile IP matches the expected pattern
# 3. Server accepts: 192.168.x.x, 10.x.x.x, 172.16-31.x.x
```

**Issue: "No data" but server responds**
```bash
# ✅ Solution: Database or API issue
# 1. Check browser console for specific errors
# 2. Test: http://192.168.106.129:3001/api/content
# 3. Should return website content or default data
```

**Issue: Server starts but mobile can't connect**
```bash
# ✅ Solution: Firewall or network configuration
# 1. Check if port 3001 is blocked by firewall
# 2. Try: telnet 192.168.106.129 3001
# 3. Or disable firewall temporarily for testing
```

#### 🔍 **Debugging Tools:**

**Server Health Check:**
```bash
# Desktop/Mobile browser:
http://192.168.106.129:3001/api/health
```

**Debug Information:**
```bash
# Desktop/Mobile browser:
http://192.168.106.129:3001/api/debug
```

**Interactive Test Page:**
```bash
# Desktop/Mobile browser:
http://192.168.106.129:3001/mobile-test.html
```

#### 📞 **If Still Not Working:**

1. **Check server logs** in terminal for error messages
2. **Verify mobile IP** matches your network (192.168.1.x or 192.168.0.x)
3. **Try different port** by changing PORT in .env.local
4. **Check firewall settings** on your computer
5. **Restart both servers** and try again

**Share these results:**
- Server logs from terminal
- Mobile browser console errors
- Results from the test page above

### Backend Server Issues

**Problem**: `npm run server` fails to start
```bash
# Check if port 3001 is already in use
lsof -i :3001
# Kill the process or use a different port in .env.local
```

**Problem**: Database connection errors
```bash
# Check if database file exists
ls -la server/aulait.db
# Check file permissions
chmod 666 server/aulait.db
```

### Frontend Issues

**Problem**: Content not loading from server
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check browser console for errors
# Look for CORS or network errors
```

**Problem**: Admin dashboard not saving
```bash
# Check browser console for API errors
# Verify backend server is running on port 3001
# Check server logs for error messages
```

## 📁 Project Structure

```
au-lait-coffee-shop/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   ├── database.js        # Database operations
│   ├── routes/
│   │   └── content.js     # API routes
│   └── aulait.db         # SQLite database (auto-created)
├── src/                   # Frontend Next.js app
│   ├── app/
│   ├── components/        # React components
│   └── ...
├── .env.local            # Environment configuration
├── package.json          # Dependencies and scripts
└── README-PERSISTENT-SETUP.md
```

## 🔒 Security Notes

- **Development**: No authentication required for admin access
- **Production**: Consider adding JWT authentication
- **Database**: SQLite file should be backed up regularly
- **Environment Variables**: Never commit `.env.local` to version control

## 🚀 Deployment

### Development Deployment
```bash
# Start both servers
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

### Production Deployment
```bash
# Build the frontend
npm run build

# Start in production mode
npm run start     # Frontend on port 3000
npm run server    # Backend on port 3001
```

## 🎉 What's New

### Persistent Storage
- **SQLite Database**: All content stored in `server/aulait.db`
- **API-First**: Frontend communicates with backend via REST API
- **Automatic Backups**: localStorage still used as fallback

### Enhanced Features
- **Real-time saving** to server database
- **Cross-device synchronization**
- **Server restart resilience**
- **Better error handling** with fallbacks

### Admin Dashboard Improvements
- **Server-side saving** with status feedback
- **Automatic fallback** to localStorage if server unavailable
- **Better upload handling** for images and videos
- **Real-time status updates**

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify both servers are running (ports 3000 and 3001)
3. Check the backend server logs for error messages
4. Ensure all environment variables are configured

---

**🎯 Result**: Your website content now persists permanently! No more losing your logo, products, or settings when reopening the website.
