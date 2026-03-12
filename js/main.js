document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-menu .btn');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('translate-x-full');
        if (mobileMenu.classList.contains('translate-x-full')) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    menuToggle?.addEventListener('click', toggleMenu);
    menuClose?.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Vietnam Map Interactivity
    const markers = document.querySelectorAll('.map-marker');
    const regionInfos = document.querySelectorAll('.region-info');
    const regions = ['north', 'central', 'south'];
    let currentRegionIdx = 0;
    let mapInterval;

    const activateRegion = (regionId) => {
        // Update index
        currentRegionIdx = regions.indexOf(regionId);
        
        // Reset
        markers.forEach(m => m.classList.remove('active'));
        regionInfos.forEach(info => info.classList.remove('active'));

        // Activate
        const marker = document.querySelector(`.map-marker.${regionId}`);
        const info = document.getElementById(`info-${regionId}`);
        
        marker?.classList.add('active');
        info?.classList.add('active');
    };

    const startMapRotation = () => {
        clearInterval(mapInterval);
        mapInterval = setInterval(() => {
            currentRegionIdx = (currentRegionIdx + 1) % regions.length;
            activateRegion(regions[currentRegionIdx]);
        }, 4000);
    };

    const stopMapRotation = () => {
        clearInterval(mapInterval);
    };

    // Event listeners for markers
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const region = marker.getAttribute('data-region');
            activateRegion(region);
            startMapRotation(); // Reset timer
        });
        
        marker.addEventListener('mouseenter', () => {
            const region = marker.getAttribute('data-region');
            activateRegion(region);
            stopMapRotation();
        });
        
        marker.addEventListener('mouseleave', () => {
            startMapRotation();
        });
    });

    // Event listeners for info boxes
    regionInfos.forEach(info => {
        const regionId = info.id.replace('info-', '');
        
        info.addEventListener('click', () => {
            activateRegion(regionId);
            startMapRotation(); // Reset timer
        });
        
        info.addEventListener('mouseenter', () => {
            activateRegion(regionId);
            stopMapRotation();
        });
        
        info.addEventListener('mouseleave', () => {
            startMapRotation();
        });
    });

    // Initial start
    activateRegion(regions[0]);
    startMapRotation();

    // Form Handling
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simple UI feedback
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Đang gửi...';
        btn.disabled = true;

        setTimeout(() => {
            // Replace alert with a custom toast
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce-in';
            toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-emerald-400 text-xl">✓</span>
                    <p class="font-medium">Cảm ơn bạn đã liên hệ! DigiWater sẽ phản hồi sớm nhất có thể.</p>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('animate-bounce-out');
                setTimeout(() => toast.remove(), 500);
            }, 4000);

            contactForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });

    // Particle/Water Effect in Hero (Simple Canvas)
    const initHeroParticles = () => {
        const container = document.getElementById('hero-canvas-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height, particles;

        const resize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    };

    initHeroParticles();

    // Scientific Section Particles
    const initScientificParticles = () => {
        const container = document.getElementById('scientific-canvas-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height, particles;

        const resize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    };

    initScientificParticles();

    // Testimonial Slider Logic (Loop back to start)
    const initTestimonialSlider = () => {
        const container = document.querySelector('.testimonial-slider-container');
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('testimonial-dots');
        
        if (!track || !container) return;

        const slides = Array.from(track.children);
        const slideCount = slides.length;
        
        let currentIndex = 0;
        let isPaused = false;
        let interval;
        let isTransitioning = false;

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = `w-2 h-2 rounded-full bg-slate-300 transition-all duration-300 hover:bg-sky-400`;
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    currentIndex = i;
                    updateSlider();
                    stopAutoSlide();
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateSlider = (smooth = true) => {
            const containerWidth = container.offsetWidth;
            if (slides.length === 0) return;
            const slideWidth = slides[0].offsetWidth;
            
            if (slideWidth === 0) return;

            if (smooth) {
                track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }

            // Calculate offset to center the current slide
            const offset = (containerWidth / 2) - (slideWidth / 2) - (currentIndex * slideWidth);
            track.style.transform = `translateX(${offset}px)`;

            // Update active state
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.classList.add('is-active');
                } else {
                    slide.classList.remove('is-active');
                }
            });

            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.children;
                Array.from(dots).forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('bg-sky-500', 'w-6');
                        dot.classList.remove('bg-slate-300', 'w-2');
                    } else {
                        dot.classList.remove('bg-sky-500', 'w-6');
                        dot.classList.add('bg-slate-300', 'w-2');
                    }
                });
            }
            
            // Allow next transition after current one finishes
            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        };

        const nextSlide = () => {
            if (isPaused || isTransitioning) return;
            isTransitioning = true;
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
        };

        const startAutoSlide = () => {
            clearInterval(interval);
            interval = setInterval(nextSlide, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(interval);
        };

        // Click to center
        slides.forEach((slide, index) => {
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex = index;
                updateSlider();
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Pause on hover
        container.addEventListener('mouseenter', () => isPaused = true);
        container.addEventListener('mouseleave', () => isPaused = false);

        // Initial setup
        setTimeout(() => {
            updateSlider(false);
            startAutoSlide();
        }, 100);

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateSlider(false);
            }, 250);
        });
    };

    initTestimonialSlider();

    // Why DigiWater Card Rotation
    const initWhyDigiWaterRotation = () => {
        const cards = document.querySelectorAll('.why-card');
        const grid = document.getElementById('why-digiwater-grid');
        if (!cards.length || !grid) return;

        let currentIndex = -1;
        let interval;
        let isPaused = false;

        const highlightNext = () => {
            if (isPaused) return;
            
            // Remove active from all
            cards.forEach(card => card.classList.remove('is-active'));
            
            // Increment and highlight
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].classList.add('is-active');
        };

        const startRotation = () => {
            clearInterval(interval);
            interval = setInterval(highlightNext, 4000);
            highlightNext(); // Immediate first highlight
        };

        grid.addEventListener('mouseenter', () => {
            isPaused = true;
            clearInterval(interval);
            cards.forEach(card => card.classList.remove('is-active'));
        });

        grid.addEventListener('mouseleave', () => {
            isPaused = false;
            // Reset index so it starts from the beginning or continues?
            // User said "tiếp tục", so let's just restart the interval.
            startRotation();
        });

        // Start initially
        startRotation();
    };

    initWhyDigiWaterRotation();
});
