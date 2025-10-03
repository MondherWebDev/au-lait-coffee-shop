const express = require('express');
const router = express.Router();
const {
  getContent,
  setContent,
  getAllContent,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getSiteSettings,
  setSiteSetting
} = require('../database');

// GET /api/content - Get all content
router.get('/', async (req, res) => {
  try {
    const content = await getAllContent();
    res.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
      message: error.message
    });
  }
});

// GET /api/content/:type - Get specific content type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const content = await getContent(type);

    if (content === null) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        message: `No content found for type: ${type}`
      });
    }

    res.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.type}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
      message: error.message
    });
  }
});

// POST /api/content/:type - Update specific content type
router.post('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const contentData = req.body;

    if (!contentData) {
      return res.status(400).json({
        success: false,
        error: 'Content data is required'
      });
    }

    const result = await setContent(type, contentData);

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating ${req.params.type}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content',
      message: error.message
    });
  }
});

// PUT /api/content/:type - Alias for POST (update content)
router.put('/:type', async (req, res) => {
  // Same as POST for content updates
  req.method = 'POST';
  return router.handle(req, res);
});

// GET /api/content/categories/all - Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// POST /api/content/categories - Add new category
router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;

    if (!categoryData || !categoryData.id || !categoryData.name) {
      return res.status(400).json({
        success: false,
        error: 'Category ID and name are required'
      });
    }

    const result = await addCategory(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add category',
      message: error.message
    });
  }
});

// PUT /api/content/categories/:id - Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    if (!categoryData) {
      return res.status(400).json({
        success: false,
        error: 'Category data is required'
      });
    }

    const result = await updateCategory(id, categoryData);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating category ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
});

// DELETE /api/content/categories/:id - Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCategory(id);

    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error deleting category ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

// GET /api/content/products/all - Get all products
router.get('/products/all', async (req, res) => {
  try {
    const products = await getProducts();
    res.json({
      success: true,
      data: products,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// POST /api/content/products - Add new product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData || !productData.id || !productData.name || !productData.price) {
      return res.status(400).json({
        success: false,
        error: 'Product ID, name, and price are required'
      });
    }

    const result = await addProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add product',
      message: error.message
    });
  }
});

// PUT /api/content/products/:id - Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    if (!productData) {
      return res.status(400).json({
        success: false,
        error: 'Product data is required'
      });
    }

    const result = await updateProduct(id, productData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// DELETE /api/content/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);

    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// GET /api/content/gallery/all - Get all gallery images
router.get('/gallery/all', async (req, res) => {
  try {
    const images = await getGalleryImages();
    res.json({
      success: true,
      data: images,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery images',
      message: error.message
    });
  }
});

// POST /api/content/gallery - Add new gallery image
router.post('/gallery', async (req, res) => {
  try {
    const imageData = req.body;

    if (!imageData || !imageData.id || !imageData.image_url) {
      return res.status(400).json({
        success: false,
        error: 'Image ID and URL are required'
      });
    }

    const result = await addGalleryImage(imageData);

    res.status(201).json({
      success: true,
      message: 'Gallery image added successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add gallery image',
      message: error.message
    });
  }
});

// DELETE /api/content/gallery/:id - Delete gallery image
router.delete('/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteGalleryImage(id);

    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery image deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error deleting gallery image ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete gallery image',
      message: error.message
    });
  }
});

// GET /api/content/settings/all - Get all site settings
router.get('/settings/all', async (req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({
      success: true,
      data: settings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site settings',
      message: error.message
    });
  }
});

// POST /api/content/settings - Update site setting
router.post('/settings', async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Setting key and value are required'
      });
    }

    const result = await setSiteSetting(key, value);

    res.json({
      success: true,
      message: 'Site setting updated successfully',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating site setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update site setting',
      message: error.message
    });
  }
});

// POST /api/content/bulk - Bulk update multiple content sections
router.post('/bulk', async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Bulk update data is required'
      });
    }

    const results = [];

    for (const [contentType, contentData] of Object.entries(updates)) {
      try {
        const result = await setContent(contentType, contentData);
        results.push({ contentType, success: true, data: result });
      } catch (error) {
        results.push({ contentType, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `Bulk update completed: ${successCount}/${results.length} sections updated successfully`,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform bulk update',
      message: error.message
    });
  }
});

module.exports = router;
