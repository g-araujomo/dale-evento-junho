/**
 * NR-1 Experience Lab - Dale Carnegie Brasília
 * Interactive JavaScript Behaviors & Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Effect
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // 2. Scroll Reveal Animation using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep layout simple
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Stats Number Counter Animation
    const statsSection = document.querySelector('.credentials');
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        
        // Ensure steps aren't too fast/slow
        const increment = Math.ceil(target / 100); 
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                clearInterval(timer);
            } else {
                element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            }
        }, 15);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                statNums.forEach(num => countUp(num));
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 4. Multi-step / Premium Form Interaction and Simulation
    const registrationForm = document.getElementById('experience-form');
    const successOverlay = document.getElementById('success-overlay');
    const formSubmitBtn = registrationForm.querySelector('button[type="submit"]');
    const successNameEl = document.getElementById('success-name');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Client-Side Validation
            const inputs = registrationForm.querySelectorAll('.form-input');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    markInvalid(input);
                } else {
                    clearInvalid(input);
                }
            });
            
            if (!isValid) return;

            // Submit Simulation (Loading State)
            const originalBtnText = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 38 38" stroke="#080e1c" style="margin-right: 8px; animation: spin 1s linear infinite;">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="3">
                            <circle stroke-opacity=".25" cx="18" cy="18" r="18"/>
                            <path d="M36 18c0-9.94-8.06-18-18-18" />
                        </g>
                    </g>
                </svg>
                Confirmando Vaga...
            `;

            // Spin animation inline-styled for button
            const styleSheet = document.createElement("style");
            styleSheet.innerText = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleSheet);
            
            // Simulate API Call / Verification
            setTimeout(() => {
                const nameValue = document.getElementById('form-name').value;
                
                // Show success screen
                successNameEl.textContent = nameValue.split(' ')[0]; // First name only for personal touch
                successOverlay.classList.add('active');
                
                // Reset button
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnText;
                
                // Reset form values
                registrationForm.reset();
            }, 1800);
        });
    }

    // Input error animations helper
    const markInvalid = (input) => {
        input.style.borderColor = 'var(--color-error)';
        input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.15)';
        
        // Add shake animation
        input.animate([
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 300,
            iterations: 1
        });
    };
    
    const clearInvalid = (input) => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    };

    // 5. Success reset / "close" simulation
    const resetFormBtn = document.getElementById('success-reset-btn');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    // 6. Partners Carousel Interaction (Quem já Confiou)
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 4500; // 4.5 seconds
        
        const showSlide = (index) => {
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            indicators.forEach(ind => {
                ind.classList.remove('active');
            });
            
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentSlide = index;
        };
        
        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };
        
        const prevSlide = () => {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        };
        
        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        };
        
        const resetSlideShow = () => {
            clearInterval(slideInterval);
            startSlideShow();
        };
        
        // Controls Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideShow();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlideShow();
            });
        }
        
        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                showSlide(i);
                resetSlideShow();
            });
        });
        
        // Pause on Hover
        const carouselContainer = document.querySelector('.partners-carousel-wrapper');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            carouselContainer.addEventListener('mouseleave', () => {
                startSlideShow();
            });
        }
        
        // Start Carousel
        startSlideShow();
    }
});
