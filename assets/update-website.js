// Utility script to update website with new Cloudinary asset URLs
export function updateWebsiteAssets(assetResults) {
    const updates = {
        heroVideo: assetResults.heroVideo,
        productImages: assetResults.productImages,
        galleryImages: assetResults.galleryImages,
        lastUpdated: new Date().toISOString()
    };

    // Store URLs in localStorage for persistence
    localStorage.setItem('goldenBeanAssets', JSON.stringify(updates));

    // Trigger immediate real-time update across all open tabs
    window.dispatchEvent(new CustomEvent('goldenBeanAssetsUpdated', {
        detail: updates
    }));

    console.log('Website assets updated:', updates);
    return updates;
}

// Function to get stored asset URLs
export function getStoredAssetUrls() {
    const stored = localStorage.getItem('goldenBeanAssets');
    return stored ? JSON.parse(stored) : null;
}

// Function to get stored content
export function getStoredContent() {
    const stored = localStorage.getItem('goldenBeanContent');
    if (stored) {
        return JSON.parse(stored);
    }

    // Default content fallback
    return {
        hero: {
            title: 'A Taste of Liquid Gold',
            subtitle: 'Experience coffee that transcends the ordinary. Crafted with passion, brewed to perfection.',
            cta: 'Explore Our Menu',
            video: ''
        },
        about: {
            title: 'Our Philosophy',
            content: 'At Golden Bean, we see coffee as an art form. We meticulously source the world\'s finest beans from sustainable, high-altitude farms. Each batch is roasted with precision to unlock a complex symphony of flavors. Our mission is to deliver not just a beverage, but a luxurious moment of pause and pleasure in your day.',
            image: ''
        },
        contact: {
            address: '123 Liquid Gold Ave, Metropolis, NY 10001',
            phone: '(555) 123-4567',
            email: 'contact@goldenbean.brews',
            hours: 'Mon - Fri: 6 AM - 8 PM\nSat - Sun: 7 AM - 7 PM'
        },
        gallery: {
            title: 'Moments at Golden Bean',
            images: []
        },
                settings: {
                    siteTitle: 'Golden Bean Brews - A Taste of Luxury',
                    description: 'Premium coffee shop offering exceptional coffee experiences with sustainable, high-quality beans.',
                    favicon: ''
                },
        products: []
    };
}

// Function to apply stored content to the current page
export function applyStoredContent() {
    const content = getStoredContent();

    console.log('Applying content to website:', content);

    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle) {
        heroTitle.textContent = content.hero.title;
        console.log('Updated hero title:', content.hero.title);
    }
    if (heroSubtitle) {
        heroSubtitle.textContent = content.hero.subtitle;
        console.log('Updated hero subtitle:', content.hero.subtitle);
    }
    if (heroCta) {
        heroCta.textContent = content.hero.cta;
        console.log('Updated hero CTA:', content.hero.cta);
    }

    // Update about section
    const aboutTitle = document.querySelector('.about-text .section-title');
    const aboutContent = document.querySelector('.about-text p');
    const aboutImage = document.querySelector('.about-image img');

    if (aboutTitle) {
        aboutTitle.textContent = content.about.title;
        console.log('Updated about title:', content.about.title);
    }
    if (aboutContent) {
        aboutContent.textContent = content.about.content;
        console.log('Updated about content:', content.about.content);
    }
    if (aboutImage && content.about.image) {
        aboutImage.src = content.about.image;
        console.log('Updated about image:', content.about.image);
    }

    // Update contact info
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.innerHTML = `
            <h3>Visit Us</h3>
            <p>${content.contact.address}</p>
            <h3>Call Us</h3>
            <p>${content.contact.phone}</p>
            <h3>Email Us</h3>
            <p>${content.contact.email}</p>
            <h3>Hours</h3>
            <p>${content.contact.hours}</p>
        `;
        console.log('Updated contact info');
    }

    // Update gallery
    const galleryTitle = document.querySelector('#gallery .section-title');
    const galleryGrid = document.querySelector('#gallery-container');

    if (galleryTitle) {
        galleryTitle.textContent = content.gallery.title;
        console.log('Updated gallery title:', content.gallery.title);
    }
    if (galleryGrid) {
        if (content.gallery.images.length > 0) {
            galleryGrid.innerHTML = content.gallery.images.map((img, index) =>
                `<div class="gallery-item"><img src="${img}" alt="Gallery image ${index + 1}" loading="lazy"></div>`
            ).join('');
            console.log('Updated gallery with', content.gallery.images.length, 'images');
        } else {
            console.log('No gallery images to update');
        }
    }

    // Update menu section with dynamic products
    const menuTitle = document.querySelector('#menu .section-title');
    const menuGrid = document.querySelector('#menu-container');

    if (menuTitle) {
        menuTitle.textContent = 'Our Menu';
        console.log('Updated menu title');
    }
    if (menuGrid) {
        if (content.products.length > 0) {
            menuGrid.innerHTML = content.products.map(product => `
                <div class="menu-card glass-card">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=687&auto=format&fit=crop'}" alt="${product.name}" class="menu-card-img">
                    <div class="menu-card-body">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span class="price">$${product.price}</span>
                    </div>
                </div>
            `).join('');
            console.log('Updated menu with', content.products.length, 'products');
        } else {
            // Show default products if none are set
            menuGrid.innerHTML = `
                <div class="menu-card glass-card">
                    <img src="https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=687&auto=format&fit=crop" alt="Golden Espresso" class="menu-card-img">
                    <div class="menu-card-body">
                        <h3>Golden Espresso</h3>
                        <p>A rich, intense shot with notes of dark chocolate and a golden crema.</p>
                        <span class="price">$3.50</span>
                    </div>
                </div>
                <div class="menu-card glass-card">
                    <img src="https://images.unsplash.com/photo-1655012735888-fd03a5c31c53?q=80&w=1170&auto=format&fit=crop" alt="Silken Latte" class="menu-card-img">
                    <div class="menu-card-body">
                        <h3>Silken Latte</h3>
                        <p>Velvety steamed milk poured over our signature espresso.</p>
                        <span class="price">$5.00</span>
                    </div>
                </div>
                <div class="menu-card glass-card">
                    <img src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1169&auto=format&fit=crop" alt="Amber Cold Brew" class="menu-card-img">
                    <div class="menu-card-body">
                        <h3>Amber Cold Brew</h3>
                        <p>Slow-steeped for 20 hours for a smooth, low-acid, and bold flavor.</p>
                        <span class="price">$4.75</span>
                    </div>
                </div>
            `;
            console.log('Loaded default products');
        }
    }

    // Update document title
    if (content.settings.siteTitle) {
        document.title = content.settings.siteTitle;
        console.log('Updated page title:', content.settings.siteTitle);
    }

    // Update favicon if provided
    if (content.settings.favicon) {
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
            existingFavicon.href = content.settings.favicon;
            console.log('Updated favicon');
        }
    }

    console.log('Applied stored content to website - All updates completed');
}

// Function to apply stored URLs to the current page
export function applyStoredAssets() {
    const assets = getStoredAssetUrls();
    if (!assets) return;

    // Update hero video (background video)
    if (assets.heroVideo && assets.heroVideo.optimizedUrl) {
        const heroVideo = document.querySelector('.hero-video');
        const heroVideoSource = document.querySelector('.hero-video source');

        if (heroVideo && heroVideoSource) {
            console.log('Updating hero video to:', assets.heroVideo.optimizedUrl);

            // Pause current video
            heroVideo.pause();
            heroVideo.currentTime = 0;

            // Update the source element
            heroVideoSource.src = assets.heroVideo.optimizedUrl;
            heroVideoSource.type = 'video/mp4';

            // Force video reload with multiple methods
            heroVideo.load();

            // Enhanced fallback methods for background videos
            heroVideo.addEventListener('error', function() {
                console.log('Video load error, trying fallback methods');

                // Method 1: Direct src update - FIX: Use URL string, not object
                const videoUrl = assets.heroVideo.optimizedUrl;
                console.log('Fallback: Setting video src to:', videoUrl);
                heroVideo.src = videoUrl;
                heroVideo.load();

                // Method 2: Recreate source element
                setTimeout(() => {
                    if (heroVideo.error) {
                        const oldSource = heroVideo.querySelector('source');
                        if (oldSource) {
                            oldSource.remove();
                        }

                        const newSource = document.createElement('source');
                        newSource.src = videoUrl; // FIX: Use URL string
                        newSource.type = 'video/mp4';
                        heroVideo.appendChild(newSource);
                        heroVideo.load();
                        console.log('Recreated source element with URL:', videoUrl);
                    }
                }, 1500);
            }, { once: true });

            // Method 3: Force play after successful load
            heroVideo.addEventListener('loadeddata', function() {
                console.log('Video loaded successfully, attempting to play');
                heroVideo.play().catch(e => {
                    console.log('Autoplay failed, but video is ready:', e);
                });
            }, { once: true });

            // Method 4: Final fallback - recreate entire video element
            setTimeout(() => {
                if (heroVideo.error || heroVideo.networkState === 3) {
                    console.log('Final fallback: recreating video element');

                    const oldVideo = heroVideo;
                    const parent = oldVideo.parentNode;

                    const newVideo = document.createElement('video');
                    newVideo.className = 'hero-video';
                    newVideo.autoplay = true;
                    newVideo.loop = true;
                    newVideo.muted = true;
                    newVideo.playsInline = true;

                    const newSource = document.createElement('source');
                    newSource.src = videoUrl; // FIX: Use URL string, not object
                    newSource.type = 'video/mp4';

                    newVideo.appendChild(newSource);
                    newVideo.innerHTML += 'Your browser does not support the video tag.';

                    parent.replaceChild(newVideo, oldVideo);

                    newVideo.load();
                    newVideo.play().catch(e => console.log('Final fallback autoplay failed:', e));
                }
            }, 2000);

            console.log('Hero video update initiated');
        } else {
            console.log('Hero video elements not found');
        }
    }

    // Update product images
    if (assets.productImages && assets.productImages.length > 0) {
        const productImageElements = document.querySelectorAll('.menu-card-img');
        assets.productImages.forEach((imageResult, index) => {
            if (productImageElements[index] && imageResult.optimizedUrl) {
                productImageElements[index].src = imageResult.optimizedUrl;
            }
        });
    }

    // Update gallery images
    if (assets.galleryImages && assets.galleryImages.length > 0) {
        const galleryImageElements = document.querySelectorAll('.gallery-item img');
        assets.galleryImages.forEach((imageResult, index) => {
            if (galleryImageElements[index] && imageResult.optimizedUrl) {
                galleryImageElements[index].src = imageResult.optimizedUrl;
            }
        });
    }

    console.log('Applied stored assets to website');
}

// Function to clear all stored assets
export function clearStoredAssets() {
    localStorage.removeItem('goldenBeanAssets');
    console.log('All stored assets cleared');
}

// Function to get asset statistics
export function getAssetStats() {
    const assets = getStoredAssetUrls();
    if (!assets) return null;

    return {
        heroVideo: assets.heroVideo ? 1 : 0,
        productImages: assets.productImages ? assets.productImages.length : 0,
        galleryImages: assets.galleryImages ? assets.galleryImages.length : 0,
        lastUpdated: assets.lastUpdated
    };
}
