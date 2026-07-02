document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listeners to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the target section smoothly
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20, // Offset to account for padding
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveLink(this);
            }
        });
    });
    
    // Update active link based on scroll position
    window.addEventListener('scroll', function() {
        // Debounce scroll event for better performance
        if (!window.requestAnimationFrame) {
            // For browsers that don't support requestAnimationFrame
            setTimeout(highlightCurrentSection, 300);
        } else {
            requestAnimationFrame(highlightCurrentSection);
        }
    });
    
    // Set initial active link based on page load position
    highlightCurrentSection();
    
    // Function to update active link
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Function to highlight the current section in the sidebar
    function highlightCurrentSection() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('.content-section');
        
        // Find the current section
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for better UX
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        });
        
        // If we found a current section, update the active link
        if (currentSection) {
            const currentId = currentSection.getAttribute('id');
            const currentLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
            
            updateActiveLink(currentLink);
        }
    }
});

// Add this to your existing JavaScript file to handle the background image loading

document.addEventListener('DOMContentLoaded', function() {
    // Function to set a real background image for the mission section
    function setBackgroundImage() {
        // You can replace this with your actual church image URL
        // For now, using a placeholder gradient image
        const missionSection = document.querySelector('.mission-section');
        
        if (missionSection) {
            // You can replace this with your actual church image
            // This is just a placeholder - replace with your actual image URL
            const imageUrl = '/placeholder.svg?height=800&width=1200';
            
            // Create a new image to preload
            const img = new Image();
            img.onload = function() {
                // Once image is loaded, set it as background
                missionSection.style.backgroundImage = `url('${imageUrl}')`;
            };
            img.src = imageUrl;
        }
    }
    
    // Call the function to set background image
    setBackgroundImage();
    
    // Rest of your existing JavaScript...
});

// Add this to your existing JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle parallax effect on worship section
    function handleParallax() {
        const worshipSection = document.querySelector('.worship-highlight');
        if (!worshipSection) return;
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const worshipPosition = worshipSection.getBoundingClientRect().top + scrollPosition;
            const offset = scrollPosition - worshipPosition;
            
            if (offset > -500 && offset < 500) {
                const parallaxImage = worshipSection.querySelector('.worship-image');
                if (parallaxImage) {
                    // Create subtle parallax effect
                    parallaxImage.style.transform = `translateY(${offset * 0.1}px)`;
                }
            }
        });
    }
    
    // Function to animate elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.expect-item, .sermon-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        elements.forEach(element => {
            observer.observe(element);
            // Add initial hidden state in JS to avoid flash of unstyled content
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Define the animation in JS
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            </style>
        `);
    }
    
    // Initialize functions
    handleParallax();
    animateOnScroll();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add this to your existing JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Parallax scrolling effect for ministry sections
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        function updateParallax() {
            parallaxElements.forEach(element => {
                const container = element.closest('.ministry-image-container');
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Check if element is in viewport
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calculate how far the element is from the top of the viewport
                    const scrollPosition = (rect.top - windowHeight) / (rect.height + windowHeight);
                    
                    // Apply transform based on scroll position
                    // Adjust the multiplier (30) to control the intensity of the effect
                    const translateY = scrollPosition * 30;
                    element.style.transform = `translateY(${translateY}px)`;
                }
            });
        }
        
        // Initial update
        updateParallax();
        
        // Update on scroll
        window.addEventListener('scroll', function() {
            window.requestAnimationFrame(updateParallax);
        });
    }
    
    // Intersection Observer for fade-in animations
    function initFadeInAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe ministry cards
        document.querySelectorAll('.ministry-card').forEach(card => {
            card.classList.add('fade-in');
            observer.observe(card);
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Hover effect for ministry cards
    function initHoverEffects() {
        document.querySelectorAll('.ministry-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const image = this.querySelector('.ministry-image');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const image = this.querySelector('.ministry-image');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // Add CSS for animations
    function addAnimationStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .fade-in-visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .ministry-image {
                transition: transform 0.5s ease;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Initialize all effects
    addAnimationStyles();
    initParallax();
    initFadeInAnimations();
    initSmoothScroll();
    initHoverEffects();
    
    // Update parallax on window resize
    window.addEventListener('resize', initParallax);
});

// Add this to your existing JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Parallax scrolling effect for background and feature image
    function initParallax() {
        const parallaxBackground = document.querySelector('.parallax-background');
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        function updateParallax() {
            // Parallax for background
            if (parallaxBackground) {
                const scrollPosition = window.pageYOffset;
                parallaxBackground.style.transform = `translateY(${scrollPosition * 0.05}px)`;
            }
            
            // Parallax for feature image
            parallaxElements.forEach(element => {
                const container = element.closest('.feature-image-container');
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Check if element is in viewport
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calculate how far the element is from the top of the viewport
                    const scrollPosition = (rect.top - windowHeight) / (rect.height + windowHeight);
                    
                    // Apply transform based on scroll position
                    const translateY = scrollPosition * 40;
                    element.style.transform = `translateY(${translateY}px)`;
                }
            });
        }
        
        // Initial update
        updateParallax();
        
        // Update on scroll with requestAnimationFrame for better performance
        window.addEventListener('scroll', function() {
            window.requestAnimationFrame(updateParallax);
        });
    }
    
    // Scroll animations for elements
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animation]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a slight delay for cascading effect
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Smooth hover transitions for stats container
    function initHoverEffects() {
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            statsContainer.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            });
            
            statsContainer.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            });
        }
    }
    
    // Counter animation for stats number
    function initCounterAnimation() {
        const statsNumber = document.querySelector('.stats-number');
        if (!statsNumber) return;
        
        const finalNumber = 10;
        let currentNumber = 0;
        const duration = 2000; // 2 seconds
        const interval = 20; // Update every 20ms
        const steps = duration / interval;
        const increment = finalNumber / steps;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = setInterval(() => {
                        currentNumber += increment;
                        
                        if (currentNumber >= finalNumber) {
                            currentNumber = finalNumber;
                            clearInterval(counter);
                        }
                        
                        statsNumber.textContent = Math.floor(currentNumber) + '+';
                    }, interval);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(statsNumber);
    }
    
    // Initialize all effects
    initParallax();
    initScrollAnimations();
    initHoverEffects();
    initCounterAnimation();
    
    // Update effects on window resize
    window.addEventListener('resize', initParallax);
});