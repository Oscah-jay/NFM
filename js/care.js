// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Trigger counter animation when elements come into view
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    observer.observe(stat);
});

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            entry.target.setAttribute('data-animated', 'true');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => counterObserver.observe(stat));

// Prayer Form Submission
document.getElementById('prayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('prayerName').value;
    const request = document.getElementById('prayerRequest').value;
    const isPublic = document.getElementById('prayerPublic').checked;
    
    if (isPublic) {
        // Create new prayer item
        const prayerWall = document.querySelector('.prayer-wall-grid');
        const newPrayer = document.createElement('div');
        newPrayer.className = 'prayer-item';
        newPrayer.innerHTML = `
            <p class="prayer-text">"${request}"</p>
            <p class="prayer-author">- ${name}</p>
        `;
        
        prayerWall.insertBefore(newPrayer, prayerWall.firstChild);
    }
    
    // Show success message
    alert('Thank you for sharing your prayer request. Our community is lifting you up in prayer.');
    
    // Reset form
    this.reset();
});

// Care Request Form Submission
document.getElementById('careRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('careRequestName').value;
    const phone = document.getElementById('careRequestPhone').value;
    const email = document.getElementById('careRequestEmail').value;
    const category = document.getElementById('careRequestCategory').value;
    const details = document.getElementById('careRequestDetails').value;
    
    // Here you would typically send this data to a server
    console.log('Care Request Submitted:', {
        name, phone, email, category, details
    });
    
    alert('Your care request has been submitted. Our care team will contact you within 24 hours.');
    
    this.reset();
});

// Quick Care Request Modal
function openCareRequest(packageType) {
    const modal = document.getElementById('careModal');
    const packageNames = {
        'new-birth': 'New Baby Pack',
        'wedding': 'Wedding Pack',
        'school': 'Back to School Pack',
        'food': 'Food & Comfort Pack',
        'recovery': 'Recovery & Healing Pack',
        'grief': 'Grief Support Pack',
        'job-loss': 'Job Transition Pack',
        'hospitality': 'Hospitality Pack'
    };
    
    document.getElementById('quickPackage').value = packageNames[packageType] || packageType;
    modal.classList.add('active');
}

function closeCareRequest() {
    const modal = document.getElementById('careModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('careModal');
    if (event.target === modal) {
        closeCareRequest();
    }
});

// Quick Care Form Submission
document.getElementById('quickCareForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('quickName').value;
    const phone = document.getElementById('quickPhone').value;
    const email = document.getElementById('quickEmail').value;
    const packageType = document.getElementById('quickPackage').value;
    const message = document.getElementById('quickMessage').value;
    
    console.log('Quick Care Request:', {
        name, phone, email, packageType, message
    });
    
    alert(`Thank you! Your request for ${packageType} has been submitted. We'll contact you soon.`);
    
    closeCareRequest();
    this.reset();
});

// Testimonials Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(slide => slide.classList.remove('active'));
    
    // Show current testimonial
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }
    
    // Update dots
    updateDots();
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function updateDots() {
    const dotsContainer = document.getElementById('testimonialDots');
    dotsContainer.innerHTML = '';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === currentTestimonial) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
        dotsContainer.appendChild(dot);
    });
}

// Initialize testimonials
updateDots();
showTestimonial(0);

// Auto-rotate testimonials every 8 seconds
setInterval(() => {
    nextTestimonial();
}, 8000);

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(element => {
        let scrollPosition = window.pageYOffset;
        element.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
});

// Responsive sidebar toggle (if using with navbar.js)
const sidebarToggle = document.querySelector('.mobile-toggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        }
    });
});

console.log('Care ministry page loaded successfully!');
