'use client';

import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../lib/cloudinary';

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

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
}

export default function MenuSection({ products, categories }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const menuGridRef = React.useRef<HTMLDivElement>(null);

  const filteredProducts = activeCategory === 'all' || !products
    ? products || []
    : products.filter(product => product.category === activeCategory);

  // Desktop: Always show 6 products (2 rows of 3) with carousel functionality for consistency
  // Mobile: Show all products in horizontal scroll
  const productsPerPage = isMobile ? filteredProducts.length : 6;
  const displayedProducts = isMobile
    ? filteredProducts
    : filteredProducts.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Update mobile state
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to beginning when category changes on mobile
  React.useEffect(() => {
    if (isMobile && menuGridRef.current) {
      menuGridRef.current.scrollLeft = 0;
    }
  }, [activeCategory, isMobile]);

  // For future expansion if needed
  const loadMoreProducts = () => {
    // Could implement "load more" functionality here if needed
    console.log('Load more products clicked');
  };

  return (
    <section id="menu" style={{
      padding: isMobile ? '40px 0 60px 0' : '20px 0 60px 0'
    }}>
      <div className="container" style={{ opacity: 1, transform: 'translateY(0)' }}>
        {/* Debug info */}
        <div style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', background: 'red' }} id="menu-debug"></div>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#FAD45B',
          fontFamily: '"Ubuntu", sans-serif'
        }}>
          Our Menu
        </h2>

        {/* Category Tabs */}
        <div
          className="category-tabs-container"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '8px',
            marginBottom: '20px',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '0 20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maxWidth: '1000px',
            margin: '0 auto 20px auto',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            zIndex: 10,
            cursor: 'grab'
          }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget;
              container.style.cursor = 'grabbing';
              const startX = e.clientX;
              const scrollLeft = container.scrollLeft;

            const handleMouseMove = (e: MouseEvent) => {
              e.preventDefault();
              const x = e.clientX - startX;
              container.scrollLeft = scrollLeft - x;
            };

            const handleMouseUp = () => {
              container.style.cursor = 'grab';
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <button
            onClick={() => {
              setActiveCategory('all');
              setCurrentPage(0);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeCategory === 'all' ? '#FAD45B' : 'rgba(250, 212, 91, 0.1)',
              color: activeCategory === 'all' ? '#1a1412' : '#FAD45B',
              border: '1px solid #FAD45B',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: '"Ubuntu", sans-serif',
              fontSize: '15px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            All Items
            <span style={{
              backgroundColor: activeCategory === 'all' ? 'rgba(26, 20, 18, 0.2)' : 'rgba(250, 212, 91, 0.2)',
              color: activeCategory === 'all' ? '#FAD45B' : '#1a1412',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '700'
            }}>
              {products ? products.length : 0}
            </span>
          </button>
          {categories && categories.map((category) => {
            const categoryProductCount = products ? products.filter(product => product.category === category.id).length : 0;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(0);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: activeCategory === category.id ? '#FAD45B' : 'rgba(250, 212, 91, 0.1)',
                  color: activeCategory === category.id ? '#1a1412' : '#FAD45B',
                  border: '1px solid #FAD45B',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Ubuntu", sans-serif',
                  fontSize: '9px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {category.name}
                <span style={{
                  backgroundColor: activeCategory === category.id ? 'rgba(26, 20, 18, 0.2)' : 'rgba(250, 212, 91, 0.2)',
                  color: activeCategory === category.id ? '#FAD45B' : '#1a1412',
                  padding: '1px 4px',
                  borderRadius: '8px',
                  fontSize: '8px',
                  fontWeight: '700',
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {categoryProductCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Carousel Container - Always use for consistency */}
        {!isMobile ? (
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '0 20px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              ref={menuGridRef}
              className="menu-carousel-container"
              style={{
                display: 'flex',
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: `translateX(calc(-100% * ${currentPage}))`,
                cursor: 'grab',
                userSelect: 'none'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                const container = e.currentTarget;
                container.style.cursor = 'grabbing';

                const startX = e.clientX;
                const startPage = currentPage;
                const containerWidth = container.offsetWidth;
                let lastDeltaX = 0;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  lastDeltaX = deltaX;
                  const progress = deltaX / containerWidth;

                  // Calculate bounded progress
                  let boundedProgress = progress;
                  if (startPage === 0 && progress > 0) {
                    // At beginning, resist dragging right
                    boundedProgress = progress * 0.3;
                  } else if (startPage === totalPages - 1 && progress < 0) {
                    // At end, resist dragging left
                    boundedProgress = progress * 0.3;
                  }

                  // Update transform for smooth dragging with boundaries
                  const newTransform = Math.max(0, Math.min(totalPages - 1, startPage - boundedProgress));
                  container.style.transform = `translateX(calc(-100% * ${newTransform}))`;
                };

                const handleMouseUp = () => {
                  setIsDragging(false);
                  const threshold = 0.15; // 15% threshold for page change
                  const progress = lastDeltaX / containerWidth;

                  // Determine if we should change page based on drag distance and direction
                  if (Math.abs(progress) > threshold) {
                    if (progress > 0 && currentPage > 0) {
                      // Dragged right - go to previous page
                      setCurrentPage(currentPage - 1);
                    } else if (progress < 0 && currentPage < totalPages - 1) {
                      // Dragged left - go to next page
                      setCurrentPage(currentPage + 1);
                    }
                  }

                  container.style.cursor = 'grab';
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => {
                const pageProducts = filteredProducts.slice(
                  pageIndex * productsPerPage,
                  (pageIndex + 1) * productsPerPage
                );

                return (
                  <div
                    key={pageIndex}
                    className="menu-carousel-page"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px',
                      minWidth: '100%',
                      flexShrink: 0
                    }}
                  >
                    {pageProducts.map((product: Product) => (
                      <div
                        key={product.id}
                        className="menu-card"
                        style={{
                          backgroundColor: 'rgba(26, 20, 18, 0.8)',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'default',
                          position: 'relative',
                          width: '100%',
                          maxWidth: '300px',
                          minHeight: '320px',
                          height: '320px',
                          display: 'flex',
                          flexDirection: 'column',
                          pointerEvents: 'auto'
                        }}
                      >
                        <div
                          className="menu-card-image"
                          style={{
                            height: '160px',
                            backgroundImage: `url(${getOptimizedImageUrl(product.image, 400, 300)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative'
                          }}
                        />
                        <div className="menu-card-content" style={{
                          padding: '16px',
                          backgroundColor: 'rgba(26, 20, 18, 0.95)',
                          position: 'relative'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px'
                          }}>
                            <h3 style={{
                              fontSize: '1.1rem',
                              fontWeight: '600',
                              color: '#FAD45B',
                              marginBottom: '4px',
                              flex: 1,
                              marginRight: '10px',
                              fontFamily: '"Ubuntu", sans-serif'
                            }}>
                              {product.name}
                            </h3>
                            <span style={{
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: '#FAD45B',
                              whiteSpace: 'nowrap',
                              fontFamily: '"Ubuntu", sans-serif'
                            }}>
                              ${product.sizes && product.sizes.length > 0
                                ? `From ${Math.min(...product.sizes.map(s => parseFloat(s.price)))}`
                                : product.price || 'N/A'
                              }
                            </span>
                          </div>

                          <p style={{
                            color: '#f0e9e1',
                            opacity: '0.7',
                            marginBottom: '16px',
                            lineHeight: '1.3',
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontFamily: '"Ubuntu", sans-serif'
                          }}>
                            {product.description}
                          </p>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                          }}>
                            <span style={{
                              fontSize: '10px',
                              color: '#FAD45B',
                              opacity: '0.6',
                              textTransform: 'capitalize',
                              fontFamily: '"Ubuntu", sans-serif'
                            }}>
                              {product.category.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mobile Layout */
          <div
            ref={menuGridRef}
            className="menu-grid"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '0 20px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget;
              container.style.cursor = 'grabbing';
              const startX = e.clientX;
              const scrollLeft = container.scrollLeft;

              const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault();
                const x = e.clientX - startX;
                container.scrollLeft = scrollLeft - x;
              };

              const handleMouseUp = () => {
                container.style.cursor = 'grab';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {displayedProducts && displayedProducts.map((product: Product) => (
              <div
                key={product.id}
                className="menu-card"
                style={{
                  backgroundColor: 'rgba(26, 20, 18, 0.8)',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  width: '280px',
                  minWidth: '280px',
                  height: '280px',
                  maxWidth: '300px',
                  pointerEvents: 'auto',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  className="menu-card-image"
                  style={{
                    height: '160px',
                    backgroundImage: `url(${getOptimizedImageUrl(product.image, 400, 300)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative'
                  }}
                />
                <div className="menu-card-content" style={{
                  padding: '16px',
                  backgroundColor: 'rgba(26, 20, 18, 0.95)',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#FAD45B',
                      marginBottom: '4px',
                      flex: 1,
                      marginRight: '10px',
                      fontFamily: '"Ubuntu", sans-serif'
                    }}>
                      {product.name}
                    </h3>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#FAD45B',
                      whiteSpace: 'nowrap',
                      fontFamily: '"Ubuntu", sans-serif'
                    }}>
                      ${product.sizes && product.sizes.length > 0
                        ? `From ${Math.min(...product.sizes.map(s => parseFloat(s.price)))}`
                        : product.price || 'N/A'
                      }
                    </span>
                  </div>

                  <p style={{
                    color: '#f0e9e1',
                    opacity: '0.7',
                    marginBottom: '16px',
                    lineHeight: '1.3',
                    fontSize: '0.85rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontFamily: '"Ubuntu", sans-serif'
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      color: '#FAD45B',
                      opacity: '0.6',
                      textTransform: 'capitalize',
                      fontFamily: '"Ubuntu", sans-serif'
                    }}>
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Carousel Navigation - Show for all desktop categories */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginTop: '30px'
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                backgroundColor: currentPage === 0 ? 'rgba(250, 212, 91, 0.3)' : '#FAD45B',
                color: currentPage === 0 ? 'rgba(250, 212, 91, 0.6)' : '#1a1412',
                border: `2px solid ${currentPage === 0 ? 'rgba(250, 212, 91, 0.3)' : '#FAD45B'}`,
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontFamily: '"Ubuntu", sans-serif'
              }}
            >
              ‹
            </button>

            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  style={{
                    width: currentPage === index ? '12px' : '8px',
                    height: currentPage === index ? '12px' : '8px',
                    borderRadius: '50%',
                    backgroundColor: currentPage === index ? '#FAD45B' : 'rgba(250, 212, 91, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              style={{
                backgroundColor: currentPage === totalPages - 1 ? 'rgba(250, 212, 91, 0.3)' : '#FAD45B',
                color: currentPage === totalPages - 1 ? 'rgba(250, 212, 91, 0.6)' : '#1a1412',
                border: `2px solid ${currentPage === totalPages - 1 ? 'rgba(250, 212, 91, 0.3)' : '#FAD45B'}`,
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontFamily: '"Ubuntu", sans-serif'
              }}
            >
              ›
            </button>
          </div>
        )}

        {/* Desktop Carousel Instruction - Show for all desktop categories */}
        {!isMobile && (
          <div style={{
            textAlign: 'center',
            marginTop: '15px',
            color: '#FAD45B',
            opacity: '0.7',
            fontSize: '14px',
            fontFamily: '"Ubuntu", sans-serif'
          }}>
            ← Drag or use arrows to see more items →
          </div>
        )}

        {/* Drag instruction - Mobile only */}
        {isMobile && filteredProducts.length > 4 && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#FAD45B',
            opacity: '0.7',
            fontSize: '14px',
            fontFamily: '"Ubuntu", sans-serif'
          }}>
            ← Drag to see more items →
          </div>
        )}

      </div>
    </section>
  );
}
