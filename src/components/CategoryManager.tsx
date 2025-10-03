'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

export default function CategoryManager({ categories, onUpdateCategories }: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      description: formData.description
    };

    let updatedCategories: Category[];
    if (editingCategory) {
      updatedCategories = categories.map(c => c.id === editingCategory.id ? categoryData : c);
    } else {
      updatedCategories = [...categories, categoryData];
    }

    onUpdateCategories(updatedCategories);
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setIsCreating(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      onUpdateCategories(updatedCategories);
    }
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
          Category Management
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
          + Add Category
        </button>
      </div>

      {/* Category Creation/Edit Form */}
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
            {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                Category Name *
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
                placeholder="Enter category name"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
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
                placeholder="Enter category description"
                required
              />
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
                {editingCategory ? 'Update Category' : 'Create Category'}
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

      {/* Categories List */}
      <div>
        <h4 style={{
          color: '#FAD45B',
          fontSize: '1.2rem',
          marginBottom: '16px',
          fontFamily: '"Ubuntu", sans-serif'
        }}>
          Existing Categories ({categories.length})
        </h4>

        <div style={{
          display: 'grid',
          gap: '16px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {categories.map((category) => (
            <div
              key={category.id}
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
              <div>
                <h5 style={{
                  color: '#FAD45B',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  fontFamily: '"Ubuntu", sans-serif'
                }}>
                  {category.name}
                </h5>
                <p style={{
                  color: '#f0e9e1',
                  opacity: '0.8',
                  fontSize: '12px',
                  margin: 0,
                  fontFamily: '"Ubuntu", sans-serif'
                }}>
                  {category.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(category)}
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
                  onClick={() => handleDelete(category.id)}
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
