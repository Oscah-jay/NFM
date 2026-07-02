document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to footer links
    const footerLinks = document.querySelectorAll('.footer-column ul li a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '5px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '0';
        });
    });
    
    // Mobile menu toggle for responsive design
    const footerHeadings = document.querySelectorAll('.footer-column h3');
    
    if (window.innerWidth < 768) {
        footerHeadings.forEach(heading => {
            heading.addEventListener('click', function() {
                const columnContent = this.nextElementSibling;
                
                if (columnContent.style.display === 'none' || columnContent.style.display === '') {
                    columnContent.style.display = 'block';
                    this.style.color = '#f7941d';
                } else {
                    columnContent.style.display = 'none';
                    this.style.color = '#333';
                }
            });
        });
    }
});