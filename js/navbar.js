// Navigation toggle
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check if dark mode is stored in localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Toggle mobile menu
navbarToggle.addEventListener('click', function() {
    navbarToggle.classList.toggle('active');
    
    // If we're activating the menu
    if (!navbarMenu.classList.contains('active')) {
        // First display the menu (it starts with opacity 0)
        navbarMenu.classList.add('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = 'hidden';
    } else {
        // If we're closing the menu, handle the transition
        // Allow scrolling again
        document.body.style.overflow = '';
        
        // Add a small delay to let the opacity transition finish before hiding the menu
        setTimeout(() => {
            // Only remove the active class if the toggle is not active
            if (!navbarToggle.classList.contains('active')) {
                navbarMenu.classList.remove('active');
            }
        }, 300); // Match this to your transition time
    }
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target) && navbarMenu.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        // Allow scrolling again
        document.body.style.overflow = '';
        
        // Add a small delay to let the opacity transition finish
        setTimeout(() => {
            navbarMenu.classList.remove('active');
        }, 300); // Match this to your transition time
    }
});

// Toggle dark mode
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Toggle icon
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'true');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'false');
    }
});

// Active link highlighting
const navLinks = document.querySelectorAll('.navbar-link');
const sections = document.querySelectorAll('section');

// Highlight active section on scroll
window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // If at the top, highlight home
    if (pageYOffset < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#') {
                link.classList.add('active');
            }
        });
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Only for links with hash
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            let targetPosition = 0;
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                targetPosition = targetElement.offsetTop - 80; // Adjust for navbar height
            }
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking
            if (navbarMenu.classList.contains('active')) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});