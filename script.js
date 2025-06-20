// Global variables
let scene, camera, renderer, particles, particleSystem;
let isLoaded = false;

// Loading screen animation
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    init3DBackground();
    initializePortfolio();
});

// 3D Loading Screen Functions
function initLoadingScreen() {
    const progressFill = document.getElementById('progressFill');
    const progressGlow = document.querySelector('.progress-glow');
    const progressText = document.getElementById('progressText');
    const circularProgress = document.getElementById('circularProgress');
    const statusMessage = document.getElementById('statusMessage');
    const typingText = document.getElementById('typingText');
    const loadingScreen = document.getElementById('loadingScreen');

    let progress = 0;

    // Status messages array
    const statusMessages = [
        'Initializing systems...',
        'Loading creative assets...',
        'Rendering 3D elements...',
        'Optimizing user interface...',
        'Preparing portfolio data...',
        'Finalizing experience...'
    ];

    // Typing text animation
    const phrases = [
        'CREATIVE INTERFACE',
        'PORTFOLIO SYSTEM',
        'DESIGN EXPERIENCE',
        'USER INTERFACE'
    ];

    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typeText() {
        const phrase = phrases[currentPhrase];

        if (!isDeleting) {
            typingText.textContent = phrase.substring(0, currentChar + 1);
            currentChar++;

            if (currentChar === phrase.length) {
                setTimeout(() => isDeleting = true, 1500);
            }
        } else {
            typingText.textContent = phrase.substring(0, currentChar - 1);
            currentChar--;

            if (currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }
        }

        setTimeout(typeText, isDeleting ? 50 : 100);
    }

    // Start typing animation
    typeText();

    // Loading progress animation
    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress > 100) progress = 100;

        // Update progress bars
        progressFill.style.width = progress + '%';
        if (progressGlow) progressGlow.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';

        // Update circular progress
        if (circularProgress) {
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (progress / 100) * circumference;
            circularProgress.style.strokeDashoffset = offset;
        }

        // Update status message
        const expectedMessageIndex = Math.floor((progress / 100) * statusMessages.length);
        if (expectedMessageIndex !== messageIndex && expectedMessageIndex < statusMessages.length) {
            messageIndex = expectedMessageIndex;
            if (statusMessage) {
                statusMessage.style.opacity = '0';
                setTimeout(() => {
                    statusMessage.textContent = statusMessages[messageIndex];
                    statusMessage.style.opacity = '0.8';
                }, 200);
            }
        }

        // Add some visual effects at certain progress points
        if (progress > 25 && progress < 30) {
            addParticleEffect();
        }

        if (progress > 60 && progress < 65) {
            addGlowEffect();
        }

        if (progress >= 100) {
            clearInterval(loadingInterval);
            if (statusMessage) statusMessage.textContent = 'Welcome to the experience!';

            // Final loading complete effect
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    isLoaded = true;
                    startAnimations();
                }, 800);
            }, 1000);
        }
    }, 150);

    // Add particle effect function
    function addParticleEffect() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.transform += ' scale(1.5)';
                particle.style.opacity = '1';
                setTimeout(() => {
                    particle.style.transform = particle.style.transform.replace(' scale(1.5)', '');
                    particle.style.opacity = '0.7';
                }, 300);
            }, index * 100);
        });
    }

    // Add glow effect function
    function addGlowEffect() {
        const cube = document.querySelector('.holographic-cube');
        if (cube) {
            cube.style.filter = 'brightness(1.5) drop-shadow(0 0 30px var(--neon-cyan))';
            setTimeout(() => {
                cube.style.filter = '';
            }, 1000);
        }
    }

    // Add random cube face effects
    const cubeInterval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(cubeInterval);
            return;
        }

        const faces = document.querySelectorAll('.cube-face');
        if (faces.length > 0) {
            const randomFace = faces[Math.floor(Math.random() * faces.length)];
            randomFace.style.boxShadow = 'inset 0 0 30px rgba(255, 255, 255, 0.3), 0 0 50px var(--neon-cyan)';

            setTimeout(() => {
                randomFace.style.boxShadow = 'inset 0 0 20px rgba(0, 212, 255, 0.2), 0 0 30px rgba(0, 212, 255, 0.3)';
            }, 800);
        }
    }, 2000);

    // Add orbital dot effects
    const orbitalDots = document.querySelectorAll('.orbital-dot');
    orbitalDots.forEach((dot, index) => {
        setInterval(() => {
            if (progress < 100) {
                const colors = ['cyan', 'purple', 'pink'];
                dot.style.boxShadow = `0 0 20px var(--neon-${colors[index % colors.length]})`;
                setTimeout(() => {
                    dot.style.boxShadow = '0 0 10px var(--neon-cyan)';
                }, 500);
            }
        }, 3000 + index * 1000);
    });
}

// Enhanced 3D Background with Three.js
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particle system
    createParticleSystem();

    // Position camera
    camera.position.z = 5;

    // Start animation loop
    animate3D();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Initialize interactive 3D elements
    init3DInteractions();
}

function createParticleSystem() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Neon colors
    const neonColors = [
        new THREE.Color(0x00d4ff), // cyan
        new THREE.Color(0xb537f2), // purple
        new THREE.Color(0xff0080), // pink
        new THREE.Color(0x00ff88), // green
    ];

    for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Random colors from neon palette
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Enhanced particle material with mouse interaction
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            mouseX: { value: 0 },
            mouseY: { value: 0 },
            mouseInfluence: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            uniform float mouseX;
            uniform float mouseY;
            uniform float mouseInfluence;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Enhanced floating animation with mouse interaction
                float mouseDistance = distance(position.xy, vec2(mouseX * 10.0, mouseY * 10.0));
                float mouseEffect = 1.0 / (1.0 + mouseDistance * 0.1);
                
                mvPosition.y += sin(time + position.x * 0.01) * (10.0 + mouseEffect * 5.0);
                mvPosition.x += cos(time + position.z * 0.01) * (5.0 + mouseEffect * 3.0);
                mvPosition.z += sin(time + position.y * 0.01) * mouseEffect * 2.0;
                
                // Dynamic size based on mouse influence
                float dynamicSize = size * (1.0 + mouseInfluence * 0.5);
                gl_PointSize = dynamicSize * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            uniform float mouseInfluence;
            
            void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                
                // Enhanced glow effect with mouse interaction
                float intensity = 0.8 + mouseInfluence * 0.4;
                vec3 finalColor = vColor * intensity;
                
                gl_FragColor = vec4(finalColor, alpha * intensity);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function animate3D() {
    requestAnimationFrame(animate3D);

    if (particleSystem) {
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;

        // Update uniforms for enhanced shader animation
        if (particleSystem.material.uniforms) {
            particleSystem.material.uniforms.time.value += 0.01;

            // Update mouse position uniforms if available
            if (window.currentMouseX !== undefined) {
                particleSystem.material.uniforms.mouseX.value = window.currentMouseX;
                particleSystem.material.uniforms.mouseY.value = window.currentMouseY;
                particleSystem.material.uniforms.mouseInfluence.value =
                    Math.sqrt(window.currentMouseX * window.currentMouseX + window.currentMouseY * window.currentMouseY);
            }
        }
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Interactive 3D Background Elements
function init3DInteractions() {
    const geoShapes = document.querySelectorAll('.geo-shape');
    const neuralNodes = document.querySelectorAll('.neural-node');
    const gridLines = document.querySelectorAll('.grid-line');

    let mouseX = 0;
    let mouseY = 0;

    // Mouse movement handler
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Store global mouse coordinates for Three.js
        window.currentMouseX = mouseX;
        window.currentMouseY = mouseY;

        // Update geometric shapes based on mouse position
        geoShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const offsetX = mouseX * 20 * speed;
            const offsetY = mouseY * 20 * speed;

            shape.style.transform = `translate(${offsetX}px, ${offsetY}px) ${shape.style.transform || ''}`;
        });

        // Update neural network nodes
        neuralNodes.forEach((node, index) => {
            const speed = (index + 1) * 0.3;
            const offsetX = mouseX * 15 * speed;
            const offsetY = mouseY * 15 * speed;

            node.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + Math.abs(mouseX) * 0.2})`;
        });

        // Update grid lines
        gridLines.forEach((line, index) => {
            const intensity = Math.abs(mouseX) + Math.abs(mouseY);
            line.style.opacity = 0.1 + intensity * 0.2;
        });
    });

    // Add scroll-based animations
    window.addEventListener('scroll', () => {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);

        // Rotate geometric shapes based on scroll
        geoShapes.forEach((shape, index) => {
            const rotation = scrollPercent * 360 * (index + 1);
            shape.style.transform += ` rotate(${rotation}deg)`;
        });

        // Adjust neural network opacity based on scroll
        const networkOpacity = Math.max(0.2, 0.6 - scrollPercent);
        document.querySelector('.neural-network').style.opacity = networkOpacity;
    });

    // Add periodic pulse effects
    setInterval(() => {
        // Random neural node activation
        const randomNode = neuralNodes[Math.floor(Math.random() * neuralNodes.length)];
        randomNode.style.boxShadow = '0 0 40px var(--neon-cyan), 0 0 80px var(--neon-cyan)';
        randomNode.style.transform += ' scale(2)';

        setTimeout(() => {
            randomNode.style.boxShadow = '0 0 20px var(--neon-cyan)';
            randomNode.style.transform = randomNode.style.transform.replace(' scale(2)', '');
        }, 1000);

        // Random geometric shape glow
        const randomShape = geoShapes[Math.floor(Math.random() * geoShapes.length)];
        randomShape.style.filter = 'brightness(2) drop-shadow(0 0 30px currentColor)';

        setTimeout(() => {
            randomShape.style.filter = '';
        }, 1500);

    }, 3000);

    // Add connection line animations
    const connections = document.querySelectorAll('.neural-connection');
    connections.forEach((connection, index) => {
        setInterval(() => {
            connection.style.background = `linear-gradient(90deg, 
                transparent, 
                var(--neon-${['cyan', 'purple', 'pink', 'green'][index % 4]}), 
                transparent)`;
        }, 2000 + index * 500);
    });
}

// Enhanced particle interaction
function updateParticleInteraction() {
    if (particleSystem && particleSystem.material.uniforms) {
        const mouseInfluence = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        particleSystem.material.uniforms.mouseInfluence = { value: mouseInfluence };
    }
}

// Portfolio initialization
function initializePortfolio() {
    initNavigation();
    initScrollEffects();
    initThemeToggle();
    initMobileMenu();
    initInteractiveElements();
    initDesignerCursor();
    initContactForm();
}

// Navigation functions
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
        }

        // Update scroll to top button
        const scrollToTop = document.getElementById('scrollToTop');
        if (window.scrollY > 500) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        const scrollToTop = document.getElementById('scrollToTop');
        if (window.scrollY > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    const scrollToTop = document.getElementById('scrollToTop');
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = themeToggle.querySelector('.theme-label');
    const body = document.body;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeLabel.textContent = 'Light';
    } else {
        themeLabel.textContent = 'Dark';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        // Update theme label and save preference
        if (body.classList.contains('light-theme')) {
            themeLabel.textContent = 'Light';
            localStorage.setItem('portfolio-theme', 'light');

            // Add light theme animations
            gsap.to('.theme-toggle-thumb', {
                x: 24,
                duration: 0.3,
                ease: 'power2.out'
            });

        } else {
            themeLabel.textContent = 'Dark';
            localStorage.setItem('portfolio-theme', 'dark');

            // Add dark theme animations
            gsap.to('.theme-toggle-thumb', {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        // Add toggle feedback animation
        gsap.to(themeToggle, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
        });

        // Show notification for theme change
        showNotification(
            `Switched to ${body.classList.contains('light-theme') ? 'Light' : 'Dark'} theme`,
            'info'
        );
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

// Interactive elements
function initInteractiveElements() {
    // Mouse movement parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        // Move floating cards based on mouse position
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 10;
            const y = (mouseY - 0.5) * speed * 10;

            card.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Update particle system rotation based on mouse
        if (particleSystem) {
            particleSystem.rotation.y = mouseX * 0.1;
            particleSystem.rotation.x = mouseY * 0.1;
        }
    });

    // Floating cards hover effects
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn, .resume-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { y: -3, duration: 0.3, ease: 'power2.out' });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
}

// Start animations when page is loaded
function startAnimations() {
    // Hero section animations
    gsap.timeline()
        .from('.status-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' })
        .from('.hero-title .word', {
            opacity: 0,
            y: 100,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.hero-description', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' }, '-=0.2')
        .from('.hero-buttons .btn', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.hero-stats .stat-item', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.2');

    // Avatar animations
    gsap.timeline()
        .from('.avatar-container', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power2.out',
            delay: 0.5
        })
        .from('.floating-card', {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.5');

    // Scroll indicator animation
    gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.5
    });
}

// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Intersection Observer for section animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Cursor trail effect
let mouseX = 0,
    mouseY = 0;
let trailElements = [];

function createCursorTrail() {
    for (let i = 0; i < 10; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #00d4ff, #b537f2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
}

function updateCursorTrail() {
    trailElements.forEach((trail, index) => {
        setTimeout(() => {
            trail.style.left = mouseX + 'px';
            trail.style.top = mouseY + 'px';
            trail.style.opacity = (10 - index) / 10;
            trail.style.transform = `translate(-50%, -50%) scale(${(10 - index) / 10})`;
        }, index * 20);
    });
}

// Initialize cursor trail
document.addEventListener('DOMContentLoaded', () => {
    createCursorTrail();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCursorTrail();
    });
});

// Performance optimization: Reduce animations on low-end devices
function checkPerformance() {
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || window.innerWidth < 768;

    if (isLowEndDevice) {
        // Reduce particle count
        const particleCount = 500;

        // Disable some animations
        document.body.classList.add('reduced-motion');
    }
}

// Initialize performance check
checkPerformance();

// Designer Cursor System
function initDesignerCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorTrail = document.querySelector('.cursor-trail');
    const trailsContainer = document.querySelector('.cursor-trails');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Create trail particles
        createTrailParticle(mouseX, mouseY);
    });

    // Smooth cursor following animation
    function animateCursor() {
        // Smooth following for cursor elements
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;

        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        // Update positions
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .resume-btn, .theme-toggle, .work-item, .skill-item');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            element.classList.add('magnetic');
            createRippleEffect(mouseX, mouseY);
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            element.classList.remove('magnetic');
        });
    });

    // Click effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        createClickExplosion(mouseX, mouseY);
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Text input cursor
    const textElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');

    textElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('text');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('text');
        });
    });

    // Create trail particles
    function createTrailParticle(x, y) {
        if (Math.random() > 0.7) { // Only create particles occasionally
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            // Random neon color
            const colors = ['var(--neon-cyan)', 'var(--neon-purple)', 'var(--neon-pink)', 'var(--neon-green)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            trailsContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 600);
        }
    }

    // Create ripple effect on hover
    function createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Create click explosion effect
    function createClickExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = 'var(--neon-pink)';

            // Random direction for explosion
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const finalX = x + Math.cos(angle) * distance;
            const finalY = y + Math.sin(angle) * distance;

            particle.style.setProperty('--final-x', finalX + 'px');
            particle.style.setProperty('--final-y', finalY + 'px');

            // Add explosion animation
            particle.style.animation = 'clickExplosion 0.5s ease-out forwards';

            trailsContainer.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 500);
        }
    }

    // Add magnetic effect to elements
    hoverElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (element.classList.contains('magnetic')) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * 0.3;
                const deltaY = (e.clientY - centerY) * 0.3;

                element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// Add click explosion animation CSS
const explosionCSS = `
@keyframes clickExplosion {
    0% {
        transform: scale(1) translate(-50%, -50%);
        opacity: 1;
    }
    100% {
        transform: scale(0) translate(var(--final-x), var(--final-y));
        opacity: 0;
    }
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = explosionCSS;
document.head.appendChild(style);

// Contact Form with Email Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Create email content
            const emailSubject = `Portfolio Contact: ${subject}`;
            const emailBody = `Hello Saurabh,\n\nYou have received a new message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nBest regards,\n${name}`;

            // Create mailto link
            const mailtoLink = `mailto:saurabhyadavrry@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

            // Try to open email client
            try {
                window.location.href = mailtoLink;

                // Show success message
                showNotification('Email client opened! Please send the message.', 'success');

                // Reset form after a delay
                setTimeout(() => {
                    this.reset();
                }, 2000);

            } catch (error) {
                // Fallback: show modal with email details
                showEmailModal(emailSubject, emailBody);
            }
        });

        // Add form field animations
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check if field has value on load
            if (input.value.trim()) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

// Show email details for manual copying
function showEmailDetails(name, email, subject, message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        backdrop-filter: blur(10px);
    `;

    modal.innerHTML = `
        <div style="
            background: var(--bg-secondary);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            color: var(--text-primary);
            position: relative;
        ">
            <h3 style="margin: 0 0 1rem 0; color: var(--neon-cyan);">Email Details</h3>
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">Please copy these details and send manually to:</p>
            <p style="margin-bottom: 1rem; color: var(--neon-cyan); font-weight: 600;">saurabhyadavrry@gmail.com</p>
            
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; margin: 1rem 0; font-family: monospace; font-size: 0.9rem;">
                <strong>From:</strong> ${name} (${email})<br>
                <strong>Subject:</strong> ${subject}<br><br>
                <strong>Message:</strong><br>
                ${message}
            </div>
            
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: var(--gradient-primary);
                border: none;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 1rem;
            ">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 350px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, var(--neon-green), #00cc66)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, var(--neon-pink), #ff3366)';
    } else {
        notification.style.background = 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))';
    }

    // Add notification content styles
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Alternative simple email function (fallback)
function sendSimpleEmail() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    const mailtoLink = `mailto:saurabhyadavrry@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
    
    window.open(mailtoLink);
    showNotification('Opening your email client to send the message...', 'info');
}

// New Interactive Features JavaScript

// 1. Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 2. Testimonials Carousel
function initTestimonials() {
    // Clear any existing testimonials setup
    const existingTestimonials = document.querySelectorAll('.testimonial-prev[data-initialized], .testimonial-next[data-initialized]');
    if (existingTestimonials.length > 0) {
        console.log('Testimonials already initialized, skipping...');
        return;
    }

    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    console.log('=== TESTIMONIALS INITIALIZATION ===');
    console.log('Items found:', testimonialItems.length);
    console.log('Dots found:', dots.length);
    console.log('Prev button found:', !!prevBtn);
    console.log('Next button found:', !!nextBtn);

    if (!testimonialItems.length || !prevBtn || !nextBtn) {
        console.error('❌ Missing required elements for testimonials');
        return;
    }

    let currentSlide = 0;
    let autoPlayInterval;

    // Mark buttons as initialized
    prevBtn.setAttribute('data-initialized', 'true');
    nextBtn.setAttribute('data-initialized', 'true');

    function showSlide(slideIndex) {
        console.log(`🔄 Switching to slide ${slideIndex}`);
        
        // Hide all testimonials
        testimonialItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === slideIndex) {
                item.classList.add('active');
                console.log(`✅ Activated slide ${index}`);
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === slideIndex) {
                dot.classList.add('active');
            }
        });

        currentSlide = slideIndex;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonialItems.length;
        console.log(`➡️ Next: ${currentSlide} → ${nextIndex}`);
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length;
        console.log(`⬅️ Prev: ${currentSlide} → ${prevIndex}`);
        showSlide(prevIndex);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
        console.log('▶️ Auto-play started');
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('⏸️ Auto-play stopped');
        }
    }

    // Add event listeners with multiple methods for reliability
    console.log('🔗 Adding event listeners...');
    
    // Method 1: Try onclick first
    try {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Next button clicked (onclick)');
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
            return false;
        };
        console.log('✅ Next button onclick set');
    } catch (error) {
        console.error('❌ Next button onclick failed:', error);
    }

    try {
        prevBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Prev button clicked (onclick)');
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
            return false;
        };
        console.log('✅ Prev button onclick set');
    } catch (error) {
        console.error('❌ Prev button onclick failed:', error);
    }

    // Method 2: Add event listeners as backup
    try {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Next button clicked (addEventListener)');
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
        console.log('✅ Next button addEventListener set');
    } catch (error) {
        console.error('❌ Next button addEventListener failed:', error);
    }

    try {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Prev button clicked (addEventListener)');
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
        console.log('✅ Prev button addEventListener set');
    } catch (error) {
        console.error('❌ Prev button addEventListener failed:', error);
    }

    // Method 3: Direct attribute setting as final backup
    try {
        nextBtn.setAttribute('onclick', `
            console.log('🖱️ Next button clicked (attribute)');
            window.testimonialsTest.next();
            return false;
        `);
        console.log('✅ Next button attribute set');
    } catch (error) {
        console.error('❌ Next button attribute failed:', error);
    }

    try {
        prevBtn.setAttribute('onclick', `
            console.log('🖱️ Prev button clicked (attribute)');
            window.testimonialsTest.prev();
            return false;
        `);
        console.log('✅ Prev button attribute set');
    } catch (error) {
        console.error('❌ Prev button attribute failed:', error);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        try {
            dot.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ Dot ${index} clicked`);
                showSlide(index);
                stopAutoPlay();
                startAutoPlay();
                return false;
            };
            
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ Dot ${index} clicked (addEventListener)`);
                showSlide(index);
                stopAutoPlay();
                startAutoPlay();
            });
            
            console.log(`✅ Dot ${index} handlers set`);
        } catch (error) {
            console.error(`❌ Dot ${index} handlers failed:`, error);
        }
    });

    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.onmouseenter = stopAutoPlay;
        carousel.onmouseleave = startAutoPlay;
    }

    // Initialize
    showSlide(0);
    startAutoPlay();

    console.log('✅ Testimonials initialized successfully');
    
    // Global test functions
    window.testimonialsTest = {
        next: nextSlide,
        prev: prevSlide,
        show: showSlide,
        current: () => currentSlide,
        forceNext: () => {
            console.log('🔧 Force next triggered');
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        },
        forcePrev: () => {
            console.log('🔧 Force prev triggered');
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        }
    };

    // Ultimate fallback - direct button access
    setTimeout(() => {
        const nextButton = document.querySelector('.testimonial-next');
        const prevButton = document.querySelector('.testimonial-prev');
        
        if (nextButton && prevButton) {
            console.log('🔧 Setting up direct button handlers as fallback');
            
            // Remove any existing handlers first
            nextButton.onclick = null;
            prevButton.onclick = null;
            
            // Set new handlers
            nextButton.onclick = function(e) {
                console.log('🔧 Direct next handler triggered');
                e.preventDefault();
                window.testimonialsTest.forceNext();
                return false;
            };
            
            prevButton.onclick = function(e) {
                console.log('🔧 Direct prev handler triggered');
                e.preventDefault();
                window.testimonialsTest.forcePrev();
                return false;
            };
            
            console.log('✅ Direct button handlers set');
        } else {
            console.error('❌ Could not find buttons for direct fallback');
        }
    }, 500);
}

// 3. Project Modal
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Project data
    const projectData = {
        'mera-bestie': {
            title: 'Mera Bestie - Gift Shop',
            description: 'A vibrant and elegant gift shop UI design celebrating friendships with intuitive user experience. Features bright, cheerful colors and playful elements that resonate with the theme of friendship. Includes user-friendly navigation and responsive design across devices.',
            image: 'images/Work/Mera Bestie/Home Page Desktop.jpg',
            tech: ['Figma', 'UI/UX Design', 'E-commerce', 'Responsive Design'],
            liveUrl: 'https://www.figma.com/@Saurabhyadav26',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'code-d-code-website': {
            title: 'CODE_D_CODE Website',
            description: 'Official website design for The Society CODE_D_CODE with modern interface and clean responsive UI. Features intuitive site structure for tech community with dedicated sections for study materials, events, and community updates. Designed to enhance user experience for aspiring developers.',
            image: 'images/Work/Code_d_Code Official Website UI Design (1)/Home Page.jpg',
            tech: ['Figma', 'Web Design', 'Community Platform', 'UI/UX'],
            liveUrl: 'https://lnkd.in/gjrKTvkB',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'candidate-page-design': {
            title: 'Candidate Page Design',
            description: 'Professional candidate profile page design featuring clean layout, intuitive navigation, and modern UI elements for enhanced user experience. Designed with focus on readability, professional presentation, and user-friendly interface for recruitment platforms.',
            image: 'images/Work/Candidate page of design.png',
            tech: ['UI/UX Design', 'Web Design', 'Profile Page', 'Professional Layout'],
            liveUrl: 'images/Work/Candidate page of design.png',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'lsg-fan-website': {
            title: 'LSG Fan Website',
            description: 'Lucknow Super Giants fan website design with modern sports-themed interface, team colors, and engaging user experience for cricket enthusiasts. Features dynamic layouts, team information, match updates, and fan community sections.',
            image: 'images/Work/LSG-FAN-PAGE IMG/Screenshot 2025-01-21 204819.png',
            tech: ['Figma', 'Sports Design', 'Fan Website', 'UI/UX'],
            liveUrl: 'https://www.figma.com/@Saurabhyadav26',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'code-d-code-poster': {
            title: 'CODE_D_CODE Society Poster',
            description: 'Creative poster design for CODE_D_CODE coding society featuring modern typography, vibrant colors, and engaging visual elements to promote the coding community. Designed to attract students and showcase the technical society\'s activities.',
            image: 'images/Work/Code_d_code coding society Poster.jpg',
            tech: ['Graphic Design', 'Poster Design', 'Typography', 'Visual Communication'],
            liveUrl: 'images/Work/Code_d_code coding society Poster.jpg',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'campus-vault-logo': {
            title: 'Campus Vault Logo',
            description: 'Professional logo design for Campus Vault featuring clean, modern aesthetics with strategic use of colors and typography for strong brand identity. Created to represent a campus-focused platform with trust and reliability.',
            image: 'images/Work/Campus Vault Logo.png',
            tech: ['Logo Design', 'Brand Identity', 'Vector Graphics', 'Corporate Design'],
            liveUrl: 'images/Work/Campus Vault Logo.png',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        },
        'code-d-code-logo': {
            title: 'CODE_D_CODE Logo',
            description: 'Brand logo design for CODE_D_CODE community combining technical elements with modern design principles to represent the coding society\'s identity. Features elements that symbolize programming and community collaboration.',
            image: 'images/Work/Code_d_Code Logo.jpg',
            tech: ['Logo Design', 'Branding', 'Tech Identity', 'Community Design'],
            liveUrl: 'images/Work/Code_d_Code Logo.jpg',
            codeUrl: 'https://www.figma.com/@Saurabhyadav26'
        }
    };

    function openModal(projectId) {
        const project = projectData[projectId];
        if (!project) return;

        // Populate modal content
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalImage').src = project.image;
        
        // Populate tech stack
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = project.tech.map(tech => 
            `<span>${tech}</span>`
        ).join('');
        
        // Update links
        document.getElementById('modalLive').href = project.liveUrl;
        document.getElementById('modalCode').href = project.codeUrl;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add click handlers to project cards
    document.querySelectorAll('.work-item').forEach((item, index) => {
        const projectIds = ['mera-bestie', 'code-d-code-website', 'candidate-page-design', 'lsg-fan-website', 'code-d-code-poster', 'campus-vault-logo', 'code-d-code-logo'];
        
        item.addEventListener('click', (e) => {
            // Prevent modal opening if clicking on overlay links
            if (e.target.closest('.work-link')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            openModal(projectIds[index]);
        });
        
        // Add cursor pointer
        item.style.cursor = 'pointer';
    });
}

// 4. Chat Widget
function initChatWidget() {
    const chatButton = document.getElementById('chatButton');
    const chatWidget = document.getElementById('chatWidget');
    
    console.log('🗨️ Initializing chat widget...');
    console.log('Chat button found:', !!chatButton);
    console.log('Chat widget found:', !!chatWidget);
    
    if (!chatButton) {
        console.error('❌ Chat button not found!');
        return;
    }
    
    // Add click handler
    chatButton.addEventListener('click', function() {
        console.log('💬 Chat button clicked!');
        
        // Create chat message
        const message = "Hi Saurabh! I'm interested in discussing a project with you. Let's connect!";
        const subject = "Project Inquiry from Portfolio";
        
        // Show options to user
        const userChoice = confirm("Choose your preferred contact method:\nOK = WhatsApp\nCancel = Email");
        
        if (userChoice) {
            // WhatsApp option
            console.log('📱 Opening WhatsApp...');
            const phoneNumber = "919876543210"; // Your WhatsApp number without + and spaces  
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            try {
                const whatsappWindow = window.open(whatsappUrl, '_blank');
                if (!whatsappWindow) {
                    console.log('Popup blocked, trying alternative...');
                    window.location.href = whatsappUrl;
                }
            } catch (error) {
                console.error('WhatsApp failed:', error);
                // Fallback to email
                openEmail(subject, message);
            }
        } else {
            // Email option
            console.log('📧 Opening email...');
            openEmail(subject, message);
        }
    });
    
    function openEmail(subject, message) {
        const emailUrl = `mailto:saurabhyadavrry@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        try {
            window.location.href = emailUrl;
        } catch (error) {
            console.error('Email failed:', error);
            // Final fallback - copy email to clipboard
            navigator.clipboard.writeText('saurabhyadavrry@gmail.com').then(() => {
                alert('Email address copied to clipboard: saurabhyadavrry@gmail.com');
            }).catch(() => {
                alert('Please contact: saurabhyadavrry@gmail.com');
            });
        }
    }
    
    // Add hover effect
    if (chatWidget) {
        chatWidget.addEventListener('mouseenter', function() {
            console.log('🖱️ Chat widget hovered');
        });
    }
    
    console.log('✅ Chat widget initialized successfully');
}

// 5. Animated Statistics Counter
function initStatsCounter() {
    const statsNumbers = document.querySelectorAll('.hero-stats .stat-number');
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 40);
    }

    // Animate when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target) || 50;
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });

    statsNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// 6. Interactive Skill Bars
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill-progress');
                const percentage = entry.target.dataset.skill || '90';
                
                if (skillBar) {
                    setTimeout(() => {
                        skillBar.style.width = percentage + '%';
                        
                        // Add percentage text
                        const percentText = document.createElement('span');
                        percentText.className = 'skill-percent';
                        percentText.textContent = percentage + '%';
                        entry.target.appendChild(percentText);
                    }, 200);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => {
        // Add progress bar if not exists
        if (!item.querySelector('.skill-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'skill-progress';
            item.appendChild(progressBar);
        }
        
        observer.observe(item);
    });
}

// 7. Real-time Form Validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form?.querySelectorAll('input, textarea');
    
    inputs?.forEach(input => {
        input.addEventListener('input', validateField);
        input.addEventListener('blur', validateField);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove existing validation
        field.classList.remove('valid', 'invalid');
        const existingMessage = field.parentNode.querySelector('.validation-message');
        if (existingMessage) existingMessage.remove();

        // Validation rules
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = isValid ? 'Valid email address' : 'Please enter a valid email address';
                break;
            case 'text':
                isValid = value.length >= 2;
                message = isValid ? 'Looks good!' : 'Please enter at least 2 characters';
                break;
            case 'textarea':
                isValid = value.length >= 10;
                message = isValid ? 'Great message!' : 'Please enter at least 10 characters';
                break;
        }

        // Apply validation styling
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
            
            const messageEl = document.createElement('div');
            messageEl.className = `validation-message ${isValid ? 'valid' : 'invalid'}`;
            messageEl.textContent = message;
            field.parentNode.appendChild(messageEl);
        }
    }
}

// 8. Scroll-triggered Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .work-item, .skill-item, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Initializing portfolio...');
    
    // Initialize existing portfolio features
    initPortfolio();
    
    // Initialize testimonials immediately after DOM is ready
    setTimeout(() => {
        console.log('🔄 Starting feature initialization...');
        initScrollProgress();
        initTestimonials();
        initProjectModal();
        initChatWidget();
        initStatsCounter();
        initSkillBars();
        initFormValidation();
        initScrollAnimations();
    }, 200);
});

// Force testimonials initialization if page is already loaded
if (document.readyState === 'complete') {
    console.log('🔥 Page already loaded - Force initializing testimonials...');
    setTimeout(() => {
        initTestimonials();
    }, 100);
}