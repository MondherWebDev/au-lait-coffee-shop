'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductSize {
  size: string;
  price: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price?: string; // For backward compatibility
  sizes?: ProductSize[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onUpdateProducts: (products: Product[]) => void;
}

export default function ProductManager({ products, categories, onUpdateProducts }: ProductManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    sizes: [
      { size: '12oz', price: '' },
      { size: '16oz', price: '' },
      { size: '20oz', price: '' }
    ]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      image: '',
      sizes: [
        { size: '12oz', price: '' },
        { size: '16oz', price: '' },
        { size: '20oz', price: '' }
      ]
    });
    setImagePreview('');
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty sizes
    const validSizes = formData.sizes.filter(size => size.price.trim() !== '');

    if (!formData.name || !formData.description || !formData.category || validSizes.length === 0) {
      alert('Please fill in all required fields and at least one size with price');
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      sizes: validSizes
    };

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      updatedProducts = [...products, productData];
    }

    onUpdateProducts(updatedProducts);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      sizes: product.sizes || [
        { size: '12oz', price: '' },
        { size: '16oz', price: '' },
        { size: '20oz', price: '' }
      ]
    });
    setImagePreview(product.image);
    setIsCreating(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      onUpdateProducts(updatedProducts);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'au-lait-products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dci2zslwa/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch {
      alert('Failed to upload image. Please try again.');
    }
  };

  const updateSizePrice = (index: number, price: string) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index].price = price;
    setFormData(prev => ({ ...prev, sizes: updatedSizes }));
  };

  return (
    <div style={{
      backgroundColor: 'rgba(26, 20, 18, 0.95)',
      border: '1px solid rgba(250, 212, 91, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          color: '#FAD45B',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: 0,
          fontFamily: '"Ubuntu", sans-serif'
        }}>
          Product Management
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          style={{
            backgroundColor: '#FAD45B',
            color: '#1a1412',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: '"Ubuntu", sans-serif'
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Product Creation/Edit Form */}
      {isCreating && (
        <div style={{
          backgroundColor: 'rgba(250, 212, 91, 0.1)',
          border: '1px solid rgba(250, 212, 91, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h4 style={{
            color: '#FAD45B',
            fontSize: '1.2rem',
            marginBottom: '16px',
            fontFamily: '"Ubuntu", sans-serif'
          }}>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h4>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#FAD45B',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Ubuntu", sans-serif'
              }}>
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(26, 20, 18, 0.8)',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '6px',
                  color: '#FAD45B',
                  fontSize: '14px',
                  fontFamily: '"Ubuntu", sans-serif'
                }}
                placeholder="Enter product name"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#FAD45B',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Ubuntu", sans-serif'
              }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(26, 20, 18, 0.8)',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '6px',
                  color: '#FAD45B',
                  fontSize: '14px',
                  fontFamily: '"Ubuntu", sans-serif',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Enter product description"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#FAD45B',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Ubuntu", sans-serif'
              }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(26, 20, 18, 0.8)',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '6px',
                  color: '#FAD45B',
                  fontSize: '14px',
                  fontFamily: '"Ubuntu", sans-serif'
                }}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#FAD45B',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Ubuntu", sans-serif'
              }}>
                Product Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  backgroundColor: 'rgba(250, 212, 91, 0.2)',
                  color: '#FAD45B',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontFamily: '"Ubuntu", sans-serif',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              {imagePreview && (
                <div style={{ marginTop: '12px' }}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid rgba(250, 212, 91, 0.3)'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#FAD45B',
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Ubuntu", sans-serif'
              }}>
                Sizes & Prices *
              </label>
              <div style={{ display: 'grid', gap: '12px' }}>
                {formData.sizes.map((sizeData, index) => (
                  <div key={sizeData.size} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{
                      color: '#FAD45B',
                      fontSize: '14px',
                      fontWeight: '500',
                      minWidth: '50px',
                      fontFamily: '"Ubuntu", sans-serif'
                    }}>
                      {sizeData.size}:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={sizeData.price}
                      onChange={(e) => updateSizePrice(index, e.target.value)}
                      placeholder="0.00"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: 'rgba(26, 20, 18, 0.8)',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '6px',
                        color: '#FAD45B',
                        fontSize: '14px',
                        fontFamily: '"Ubuntu", sans-serif'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#FAD45B',
                  color: '#1a1412',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Ubuntu", sans-serif'
                }}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FAD45B',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Ubuntu", sans-serif'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div>
        <h4 style={{
          color: '#FAD45B',
          fontSize: '1.2rem',
          marginBottom: '16px',
          fontFamily: '"Ubuntu", sans-serif'
        }}>
          Existing Products ({products.length})
        </h4>

        <div style={{
          display: 'grid',
          gap: '16px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'rgba(250, 212, 91, 0.05)',
                border: '1px solid rgba(250, 212, 91, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid rgba(250, 212, 91, 0.3)'
                  }}
                />
                <div>
                  <h5 style={{
                    color: '#FAD45B',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    fontFamily: '"Ubuntu", sans-serif'
                  }}>
                    {product.name}
                  </h5>
                  <p style={{
                    color: '#f0e9e1',
                    opacity: '0.8',
                    fontSize: '12px',
                    margin: '0 0 4px 0',
                    fontFamily: '"Ubuntu", sans-serif'
                  }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map((size, index) => (
                        <span
                          key={index}
                          style={{
                            color: '#FAD45B',
                            fontSize: '11px',
                            backgroundColor: 'rgba(250, 212, 91, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: '"Ubuntu", sans-serif'
                          }}
                        >
                          {size.size}: ${size.price}
                        </span>
                      ))
                    ) : (
                      <span style={{
                        color: '#FAD45B',
                        fontSize: '11px',
                        backgroundColor: 'rgba(250, 212, 91, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: '"Ubuntu", sans-serif'
                      }}>
                        ${product.price || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    backgroundColor: 'rgba(250, 212, 91, 0.2)',
                    color: '#FAD45B',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: '"Ubuntu", sans-serif'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    color: '#dc3545',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: '"Ubuntu", sans-serif'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
