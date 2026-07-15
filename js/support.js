// Initialize Stripe (replace with your actual publishable key)
const stripe = Stripe('pk_test_51234567890abcdef'); // Replace with your Stripe publishable key
let cardElement = null;

// DOM Elements
const localTab = document.getElementById('local-tab');
const internationalTab = document.getElementById('international-tab');
const localForm = document.getElementById('localPaymentForm');
const internationalForm = document.getElementById('internationalPaymentForm');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

let currentPaymentMethod = 'mpesa';
let currentInternationalMethod = 'card';
let isLocalPaymentShowing = false;
let isInternationalPaymentShowing = false;

// Initialize Stripe Card Element for International Tab
function initStripeCard() {
    if (!cardElement) {
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#333',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                },
                invalid: {
                    color: '#dc2626',
                },
            },
        });
        
        const cardContainer = document.getElementById('card-element');
        if (cardContainer) {
            cardElement.mount('#card-element');
            
            cardElement.on('change', (event) => {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
    }
}

// Tab Switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        const tab = button.dataset.tab;
        
        if (tab === 'local') {
            localTab.style.display = 'block';
            internationalTab.style.display = 'none';
            resetPaymentSelection();
            isLocalPaymentShowing = false;
            isInternationalPaymentShowing = false;
        } else {
            localTab.style.display = 'none';
            internationalTab.style.display = 'block';
            resetPaymentSelection();
            isLocalPaymentShowing = false;
            isInternationalPaymentShowing = false;
            setTimeout(() => initStripeCard(), 100);
        }
    });
});

// Payment Method Selection - Local
document.querySelectorAll('#local-tab .payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('#local-tab .payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        currentPaymentMethod = card.dataset.method;
        const methodName = card.querySelector('h3').textContent;
        document.getElementById('selectedMethodTitle').textContent = methodName + ' Payment';
        
        showLocalPaymentForm();
    });
});

// Payment Method Selection - International
document.querySelectorAll('#international-tab .payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('#international-tab .payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        currentInternationalMethod = card.dataset.method;
        const methodName = card.querySelector('h3').textContent;
        document.getElementById('selectedMethodTitleIntl').textContent = methodName + ' Payment';
        
        // Show/hide card element based on method
        const cardContainer = document.getElementById('card-element-container');
        if (currentInternationalMethod === 'card') {
            cardContainer.style.display = 'block';
            initStripeCard();
        } else {
            cardContainer.style.display = 'none';
        }
        
        showInternationalPaymentForm();
    });
});

function showLocalPaymentForm() {
    document.querySelectorAll('#local-tab .payment-method-card').forEach(card => {
        card.style.display = 'none';
    });
    localForm.style.display = 'block';
    isLocalPaymentShowing = true;
}

function showInternationalPaymentForm() {
    document.querySelectorAll('#international-tab .payment-method-card').forEach(card => {
        card.style.display = 'none';
    });
    internationalForm.style.display = 'block';
    isInternationalPaymentShowing = true;
}

function resetPaymentSelection() {
    document.querySelectorAll('#local-tab .payment-method-card').forEach(card => {
        card.classList.remove('selected');
        card.style.display = 'block';
    });
    document.querySelectorAll('#international-tab .payment-method-card').forEach(card => {
        card.classList.remove('selected');
        card.style.display = 'block';
    });
    localForm.style.display = 'none';
    internationalForm.style.display = 'none';
    isLocalPaymentShowing = false;
    isInternationalPaymentShowing = false;
}

function cancelPayment() {
    resetPaymentSelection();
    document.querySelector('.tab-button.active').click();
}

function cancelPaymentIntl() {
    resetPaymentSelection();
    document.querySelector('.tab-button.active').click();
}

// Local Payment Form Submission
localForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('donorName').value;
    const phone = document.getElementById('donorPhone').value;
    const email = document.getElementById('donorEmail').value;
    const amount = document.getElementById('donationAmount').value;
    const purpose = document.getElementById('donationPurpose').value;
    const anonymous = document.getElementById('anonymousGift').checked;
    const recurring = document.getElementById('recurringGift').checked;
    
    // Validate inputs
    if (!name || !phone || !email || !amount) {
        showError('Please fill in all required fields');
        return;
    }
    
    // Validate phone number format
    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
        showError('Please enter a valid phone number');
        return;
    }
    
    if (amount < 50) {
        showError('Minimum donation amount is KES 50');
        return;
    }
    
    // Simulate payment processing
    try {
        const paymentData = {
            method: currentPaymentMethod,
            name: anonymous ? 'Anonymous' : name,
            email: email,
            phone: phone,
            amount: amount,
            currency: 'KES',
            purpose: purpose || 'general',
            recurring: recurring,
            timestamp: new Date().toISOString(),
        };
        
        console.log('[v0] Processing local payment:', paymentData);
        
        // Simulate API call to your backend
        await simulatePaymentProcessing(paymentData);
        
        showSuccessModal(`Your donation of KES ${amount} via ${currentPaymentMethod.toUpperCase()} has been received. A receipt has been sent to ${email}`);
        localForm.reset();
        resetPaymentSelection();
        
    } catch (error) {
        console.error('[v0] Payment error:', error);
        showError('Payment processing failed. Please try again.');
    }
});

// International Payment Form Submission
internationalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('intlDonorName').value;
    const email = document.getElementById('intlDonorEmail').value;
    const amount = document.getElementById('intlDonationAmount').value;
    const purpose = document.getElementById('intlDonationPurpose').value;
    const anonymous = document.getElementById('intlAnonymousGift').checked;
    const recurring = document.getElementById('intlRecurringGift').checked;
    
    // Validate inputs
    if (!name || !email || !amount) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (amount < 1) {
        showError('Minimum donation amount is USD $1');
        return;
    }
    
    try {
        if (currentInternationalMethod === 'card') {
            // Use Stripe for card payment
            const {token, error} = await stripe.createToken(cardElement);
            
            if (error) {
                console.error('[v0] Stripe error:', error);
                showError(error.message);
                return;
            }
            
            const paymentData = {
                method: 'card',
                name: anonymous ? 'Anonymous' : name,
                email: email,
                amount: amount,
                currency: 'USD',
                purpose: purpose || 'general',
                recurring: recurring,
                stripeToken: token.id,
                timestamp: new Date().toISOString(),
            };
            
            console.log('[v0] Processing Stripe card payment:', paymentData);
            await simulatePaymentProcessing(paymentData);
            
        } else if (currentInternationalMethod === 'applepay' || currentInternationalMethod === 'googlepay') {
            // Simulate Apple Pay / Google Pay
            const paymentData = {
                method: currentInternationalMethod,
                name: anonymous ? 'Anonymous' : name,
                email: email,
                amount: amount,
                currency: 'USD',
                purpose: purpose || 'general',
                recurring: recurring,
                timestamp: new Date().toISOString(),
            };
            
            console.log(`[v0] Processing ${currentInternationalMethod} payment:`, paymentData);
            await simulatePaymentProcessing(paymentData);
            
        } else if (currentInternationalMethod === 'paypal') {
            // Simulate PayPal
            const paymentData = {
                method: 'paypal',
                name: anonymous ? 'Anonymous' : name,
                email: email,
                amount: amount,
                currency: 'USD',
                purpose: purpose || 'general',
                recurring: recurring,
                timestamp: new Date().toISOString(),
            };
            
            console.log('[v0] Processing PayPal payment:', paymentData);
            await simulatePaymentProcessing(paymentData);
        }
        
        showSuccessModal(`Your donation of USD $${amount} via ${currentInternationalMethod.toUpperCase()} has been received. A receipt has been sent to ${email}`);
        internationalForm.reset();
        resetPaymentSelection();
        
    } catch (error) {
        console.error('[v0] Payment error:', error);
        showError('Payment processing failed. Please try again.');
    }
});

// Simulate Payment Processing (replace with actual API call)
function simulatePaymentProcessing(paymentData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // In production, this would call your backend API
            // POST to /api/donations or similar endpoint
            
            // Random success/failure for demo (remove in production)
            if (Math.random() > 0.95) {
                reject(new Error('Simulated payment failure'));
            } else {
                // Here you would send paymentData to your backend
                console.log('[v0] Payment processed successfully:', paymentData);
                resolve({success: true});
            }
        }, 2000);
    });
}

// Modal Functions
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    successModal.classList.add('active');
}

function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    errorModal.classList.add('active');
}

function showError(message) {
    showErrorModal(message);
}

function closeModal() {
    successModal.classList.remove('active');
}

function closeErrorModal() {
    errorModal.classList.remove('active');
}

// Scroll to Payment Section
function scrollToPayment() {
    document.getElementById('payment-section').scrollIntoView({behavior: 'smooth'});
}

// Counter Animation for Stats
function animateCounter() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let current = 0;
                
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 30);
                
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        
        // Close other items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            if (faqItem !== item) {
                faqItem.querySelector('.faq-answer').style.display = 'none';
                faqItem.querySelector('.faq-question').classList.remove('active');
            }
        });
        
        // Toggle current item
        question.classList.toggle('active');
        if (answer.style.display === 'none') {
            answer.style.display = 'block';
        } else {
            answer.style.display = 'none';
        }
    });
});

// Fade-in animations on scroll
function handleScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, {threshold: 0.1});
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    handleScrollAnimations();
    
    // Navbar functionality
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Close menu when link clicked
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });
});

// Sidebar Navigation Active State
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const id = section.id;
        
        if (rect.top <= 300 && rect.bottom > 300) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});

// Security Best Practices
// Never log sensitive data in production
function logPaymentSecurely(data) {
    const sanitized = {
        method: data.method,
        amount: data.amount,
        currency: data.currency,
        timestamp: data.timestamp,
        // Never include card details, tokens, or phone numbers in logs
    };
    console.log('[v0] Payment processed:', sanitized);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}