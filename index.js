


import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- DOM Elements ---
const loader = document.getElementById('loader');
const menuOverlay = document.getElementById('menu-overlay');
const header = document.querySelector('.header');
const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const customCursor = document.getElementById('custom-cursor');
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('.hero-section');


// --- Basic UI Interactivity ---

// Loader
window.addEventListener('load', () => {
    loader.classList.add('hidden');
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- Robust Mobile Menu & Smooth Scrolling ---
const toggleMenu = () => {
    const isActive = navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll', isActive);
};

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

menuOverlay.addEventListener('click', toggleMenu);

const allNavLinks = document.querySelectorAll('a[href^="#"]');
allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if it's open
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});


// --- Interactive Elements ---

// Custom Cursor
window.addEventListener('mousemove', e => {
    gsap.to(customCursor, { duration: 0.2, x: e.clientX, y: e.clientY });
});

const interactiveElements = document.querySelectorAll('a, button, .menu-card, .gallery-item, .menu-toggle');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('pointer'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('pointer'));
});


// Menu Card Glow
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Interactive Contact Form
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;

        button.textContent = 'Sending...';
        button.classList.add('sending');
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Message Sent!';
            button.classList.remove('sending');
            button.classList.add('sent');
            contactForm.reset();
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('sent');
                button.disabled = false;
            }, 2500);
        }, 1500);
    });
}

// --- GSAP Animations ---

// Animate Hero on load
const heroTitle = document.querySelector('.hero-title');
heroTitle.innerHTML = heroTitle.textContent.replace(/\S/g, "<span>$&</span>");

gsap.from(heroTitle.querySelectorAll('span'), { 
    duration: 1, 
    y: 30,
    rotation: 10, 
    opacity: 0, 
    delay: 1.2, 
    ease: 'power4.out',
    stagger: 0.05
});
gsap.from('.hero-subtitle', { duration: 1, y: 50, opacity: 0, delay: 1.4, ease: 'power3.out' });
gsap.from('.hero-cta', { duration: 1, y: 50, opacity: 0, delay: 1.6, ease: 'power3.out' });


// Parallax and Mouse tracking for Hero
if (heroSection && heroContent) {
    // Parallax effect on scroll
    gsap.to(heroContent, {
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        yPercent: 30,
        opacity: 0,
        ease: 'none',
    });

    // Mouse tracking 3D effect
    heroSection.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
        
        gsap.to(heroContent, {
            duration: 1,
            x: xPercent * 30,
            rotationY: xPercent * 5,
            rotationX: -yPercent * 5,
            ease: "power2.out"
        });
    });
}


// Section Reveal Animations
const revealElements = (selector, options = {}) => {
    const elements = gsap.utils.toArray(selector);
    const triggerEl = options.trigger || elements;

    // Separate animation properties from scrolltrigger properties
    const stOptions = {
        trigger: triggerEl,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none',
    };
    
    // remove scrolltrigger-specific options from the main options object
    const animOptions = { ...options };
    delete animOptions.trigger;
    delete animOptions.start;
    
    gsap.from(elements, {
        ...animOptions,
        y: animOptions.y ?? 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: animOptions.stagger || 0,
        scrollTrigger: stOptions,
    });
};

// General animations that are the same on all screen sizes
revealElements('.section-title');
revealElements('.menu-card', { stagger: 0.1, trigger: '.menu-grid' });
revealElements('.gallery-item', { scale: 0.8, y: 0, stagger: 0.1, trigger: '.gallery-grid' });

// Responsive animations using matchMedia
ScrollTrigger.matchMedia({
  // --- Desktop (slide-in animations) ---
  "(min-width: 769px)": function() {
    revealElements('.about-text', { x: -100, y: 0, trigger: '.about-content' });
    revealElements('.about-image', { x: 100, y: 0, trigger: '.about-content' });
    revealElements('.contact-info', { x: -100, y: 0, trigger: '.contact-grid' });
    revealElements('.contact-form', { x: 100, y: 0, trigger: '.contact-grid' });
  },
  // --- Mobile (fade-up animations) ---
  "(max-width: 768px)": function() {
    // The default reveal is a fade-up (y: 50, opacity: 0), which is perfect for mobile.
    revealElements('.about-text', { trigger: '.about-content' });
    revealElements('.about-image', { trigger: '.about-content' });
    revealElements('.contact-info', { trigger: '.contact-grid' });
    revealElements('.contact-form', { trigger: '.contact-grid' });
  },
});


// Active Nav Link on Scroll
gsap.utils.toArray('main > section[id]').forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
            if (self.isActive) {
                const currentId = `#${section.id}`;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === currentId);
                });
            }
        }
    });
});
