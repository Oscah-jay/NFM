document.addEventListener('DOMContentLoaded', function() {
    // Remove EmailJS initialization since we're using Web3Forms
    // Animate cards on page load
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach(card => {
        const delay = card.getAttribute('data-delay') || 0;
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.8s ease forwards';
        }, delay);
    });
    
    // Modal functionality
    const modal = document.getElementById('contactModal');
    const buttons = document.querySelectorAll('.contact-button');
    const closeBtn = document.querySelector('.close-modal');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the card title to customize the modal
            const cardTitle = this.closest('.card-content').querySelector('.card-title').textContent;
            document.querySelector('.modal-title').textContent = `Contact Us - ${cardTitle}`;
            
            // Set the department in the hidden field
            const departmentField = document.getElementById('department-field');
            if (departmentField) {
                departmentField.value = cardTitle;
            }
            
            // Show modal with animation
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Add button press effect
            this.classList.add('pressed');
            setTimeout(() => {
                this.classList.remove('pressed');
            }, 200);
        });
    });
    
    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 300);
    }
    
    // Form submission with Web3Forms
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Update button state
            const submitButton = document.querySelector('.submit-button');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get the department from the modal title or hidden field
            const department = document.getElementById('department-field').value;
            
            // Prepare form data for Web3Forms
            const formData = new FormData(this);
            
            // Send the form data to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('SUCCESS!', data);
                
                if (data.success) {
                    // Create success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Your message has been sent successfully! We\'ll get back to you soon. Thank you for walking the path of righteousness!';
                    
                    // Replace form with success message
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                    
                    // Show success message with animation
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 100);
                    
                    // Close modal after a delay
                    setTimeout(() => {
                        closeModal();
                        
                        // Reset form after modal is closed
                        setTimeout(() => {
                            resetContactForm();
                        }, 500);
                    }, 2000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('FAILED...', error);
                
                // Show error message
                alert('Failed to send email. Please try again later or contact us directly at newlifefountainmin@gmail.com');
                
                // Reset button state
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            });
        });
    }

    // Function to reset the contact form
    function resetContactForm() {
        if (!contactForm) return;
        
        contactForm.innerHTML = `
            <!-- Web3Forms required fields -->
            <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
            <input type="checkbox" name="botcheck" style="display: none;">
            <input type="hidden" name="from_name" value="Newlife Fountain Ministries Contact Form">
            <input type="hidden" name="subject" value="New Contact Form Submission">
            
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" autocomplete="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email" required>
            </div>
            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" autocomplete="off" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" autocomplete="off" required></textarea>
            </div>
            <!-- Hidden field to capture which department was selected -->
            <input type="hidden" name="department" id="department-field">
            <button type="submit" class="submit-button">Send Message</button>
        `;
        
        // Make sure the form has the correct action
        contactForm.setAttribute('action', 'https://api.web3forms.com/submit');
        contactForm.setAttribute('method', 'POST');
    }

    // Add hover effects for buttons
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add CSS for animations and effects
    const style = document.createElement('style');
    style.textContent = `
        /* Card animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .contact-card {
            opacity: 0;
        }
        
        /* Button effects */
        .contact-button {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .contact-button.pressed {
            transform: scale(0.95);
        }
        
        /* Modal styles */
        .contact-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .contact-modal.show {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
        }
        
        .success-message {
            padding: 2rem;
            text-align: center;
            font-size: 1.2rem;
            color: #4CAF50;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .success-message.show {
            opacity: 1;
        }
        
        /* Pulse animation for icons */
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .contact-icon.pulse {
            animation: pulse 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards for scroll animations
    document.querySelectorAll('.contact-card').forEach(card => {
        observer.observe(card);
    });
    
    // Animation for Get In Touch section
    function initGetInTouchAnimations() {
        const contactColumns = document.querySelectorAll('.contact-info-column');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        contactColumns.forEach(column => {
            observer.observe(column);
        });
    }
    
    // Hover effects for contact columns
    function initContactHoverEffects() {
        const contactColumns = document.querySelectorAll('.contact-info-column');
        
        contactColumns.forEach(column => {
            // Add floating animation on hover
            column.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            column.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // Add pulse animation to icon on hover
            const icon = column.querySelector('.contact-icon');
            if (icon) {
                column.addEventListener('mouseenter', function() {
                    icon.classList.add('pulse');
                });
                
                column.addEventListener('mouseleave', function() {
                    icon.classList.remove('pulse');
                });
            }
        });
    }
    
    // Initialize Get In Touch section effects
    if (document.querySelectorAll('.contact-info-column').length > 0) {
        initGetInTouchAnimations();
        initContactHoverEffects();
    }
});