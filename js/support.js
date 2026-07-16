// Paystack Configuration
const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY'; // Replace with your actual Paystack public key
const PAYSTACK_SCRIPT = 'https://js.paystack.co/v1/inline.js';

// DOM Elements
const donationForm = document.getElementById('donationForm');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

// Load Paystack script
function loadPaystackScript() {
    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
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

// Initialize Paystack Payment
function initiatePaystackPayment(donationData) {
    if (typeof PaystackPop === 'undefined') {
        showError('Payment system is loading. Please try again.');
        return;
    }

    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: donationData.email,
        amount: donationData.amount * 100, // Paystack expects amount in kobo (cents)
        currency: 'KES',
        ref: 'DONATION_' + Math.floor(Math.random() * 1000000000 + 1), // Unique transaction reference
        metadata: {
            donor_name: donationData.name,
            donation_purpose: donationData.purpose,
            donation_type: donationData.donationType,
            is_anonymous: donationData.isAnonymous,
            custom_fields: [
                {
                    display_name: 'Donation Purpose',
                    variable_name: 'donation_purpose',
                    value: donationData.purpose || 'General Fund'
                },
                {
                    display_name: 'Donation Type',
                    variable_name: 'donation_type',
                    value: donationData.donationType
                }
            ]
        },
        onClose: function() {
            console.log('[v0] Payment window closed');
            showError('Payment cancelled. Please try again.');
        },
        onSuccess: function(response) {
            console.log('[v0] Payment successful:', response.reference);
            handlePaymentSuccess(response, donationData);
        }
    });

    handler.openIframe();
}

// Handle successful payment
function handlePaymentSuccess(response, donationData) {
    // Verify payment on backend
    verifyPaystackPayment(response.reference, donationData);
}

// Verify payment with backend
async function verifyPaystackPayment(reference, donationData) {
    try {
        const verificationData = {
            reference: reference,
            amount: donationData.amount,
            email: donationData.email,
            donor_name: donationData.name,
            donation_purpose: donationData.purpose,
            donation_type: donationData.donationType,
            is_anonymous: donationData.isAnonymous,
            timestamp: new Date().toISOString()
        };

        console.log('[v0] Verifying payment:', reference);

        // In production, call your backend API to verify the payment
        // const response = await fetch('/api/donations/verify', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content || ''
        //     },
        //     body: JSON.stringify(verificationData)
        // });

        // For now, simulate successful verification
        await simulateBackendVerification(verificationData);

        showSuccessModal(`Your donation of KES ${donationData.amount.toLocaleString()} has been received successfully! A receipt has been sent to ${donationData.email}`);
        donationForm.reset();

    } catch (error) {
        console.error('[v0] Verification error:', error);
        showError('Payment verification failed. Please contact support with reference: ' + reference);
    }
}

// Simulate backend verification (remove in production)
function simulateBackendVerification(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('[v0] Payment verified and stored:', data);
            // Send thank you email (in production)
            sendThankYouEmail(data);
            resolve();
        }, 1000);
    });
}

// Send thank you email (backend function)
function sendThankYouEmail(donationData) {
    // In production, this would be called by your backend API
    console.log('[v0] Sending thank you email to:', donationData.email);
    
    // Backend should send email with:
    // - Donation receipt
    // - Tax certificate (if applicable)
    // - Impact statement
    // - Thank you message
}

// Donation Form Submission
donationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = sanitizeInput(document.getElementById('donorName').value.trim());
    const email = document.getElementById('donorEmail').value.trim();
    const amount = parseInt(document.getElementById('donationAmount').value);
    const purpose = document.getElementById('donationPurpose').value;
    const donationType = document.querySelector('input[name="donationType"]:checked').value;
    const isAnonymous = document.getElementById('anonymousGift').checked;

    // Validate inputs
    if (!name || !email || !amount) {
        showError('Please fill in all required fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (amount < 100) {
        showError('Minimum donation amount is KES 100');
        return;
    }

    if (amount > 10000000) {
        showError('Maximum donation amount is KES 10,000,000');
        return;
    }

    // Prepare donation data
    const donationData = {
        name: isAnonymous ? 'Anonymous Donor' : name,
        email: email,
        amount: amount,
        currency: 'KES',
        purpose: purpose || 'general',
        donationType: donationType,
        isAnonymous: isAnonymous,
        timestamp: new Date().toISOString()
    };

    console.log('[v0] Initiating Paystack payment:', {
        amount: donationData.amount,
        email: donationData.email,
        purpose: donationData.purpose,
        donationType: donationData.donationType
    });

    // Initiate Paystack payment
    initiatePaystackPayment(donationData);
});

// Modal Functions
function showSuccessModal(message) {
    if (successModal) {
        const messageEl = successModal.querySelector('p') || document.createElement('p');
        messageEl.textContent = message;
        if (!successModal.querySelector('p')) {
            successModal.querySelector('.modal-content').appendChild(messageEl);
        }
        successModal.classList.add('active');
    }
}

function showErrorModal(message) {
    if (errorModal) {
        const messageEl = errorModal.querySelector('p') || document.createElement('p');
        messageEl.textContent = message;
        if (!errorModal.querySelector('p')) {
            errorModal.querySelector('.modal-content').appendChild(messageEl);
        }
        errorModal.classList.add('active');
    }
}

function showError(message) {
    console.error('[v0] Error:', message);
    showErrorModal(message);
}

function closeModal() {
    if (successModal) successModal.classList.remove('active');
}

function closeErrorModal() {
    if (errorModal) errorModal.classList.remove('active');
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
    loadPaystackScript();
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

// ============================================
// PAYSTACK CONFIGURATION
// ============================================
const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY'; // Replace with your actual Paystack public key
const PAYSTACK_SCRIPT = 'https://js.paystack.co/v1/inline.js';

// ============================================
// DOM ELEMENTS
// ============================================
const paymentForm = document.getElementById('paymentForm');
const supportPurpose = document.getElementById('supportPurpose');
const frequencySection = document.getElementById('frequencySection');
const startingSection = document.getElementById('startingSection');
const amountInput = document.getElementById('amountInput');
const donationTypeInput = document.getElementById('donationType');
const frequencyInput = document.getElementById('frequency');
const donationStartDate = document.getElementById('donationStartDate');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

// ============================================
// STATE MANAGEMENT
// ============================================
let currentDonationType = 'one-time';
let currentFrequency = 'weekly';
let currentAmount = 0;

// ============================================
// LOAD PAYSTACK SCRIPT
// ============================================
function loadPaystackScript() {
    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT;
    script.async = true;
    script.onerror = () => {
        console.warn('[v0] Paystack script failed to load. Payments may not work.');
    };
    document.body.appendChild(script);
}

// ============================================
// SUPPORT TYPE BUTTON LOGIC
// ============================================
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const donationType = btn.dataset.type;
        currentDonationType = donationType;
        donationTypeInput.value = donationType;

        // Show/Hide frequency and starting sections ONLY for recurring
        if (donationType === 'recurring') {
            frequencySection.classList.add('show');
            startingSection.classList.add('show');
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            donationStartDate.value = today;
        } else {
            // Hide for one-time donations
            frequencySection.classList.remove('show');
            startingSection.classList.remove('show');
        }
    });
});

// ============================================
// FREQUENCY BUTTON LOGIC
// ============================================
document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        currentFrequency = btn.dataset.frequency;
        frequencyInput.value = currentFrequency;
    });
});

// ============================================
// AMOUNT INPUT LOGIC
// ============================================
// Handle amount input changes
amountInput.addEventListener('change', (e) => {
    let value = parseFloat(e.target.value) || 0;
    if (value < 0) value = 0;
    currentAmount = parseFloat(value.toFixed(2));
    amountInput.value = currentAmount.toFixed(2);
});

amountInput.addEventListener('blur', (e) => {
    let value = parseFloat(e.target.value) || 0;
    if (value < 0) value = 0;
    currentAmount = parseFloat(value.toFixed(2));
    amountInput.value = currentAmount.toFixed(2);
});

// Set initial value
currentAmount = 0;
amountInput.value = '0.00';

// ============================================
// VALIDATION
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// PAYSTACK PAYMENT
// ============================================
function initiatePaystackPayment() {
    // Check if Paystack is loaded
    if (typeof PaystackPop === 'undefined') {
        console.log('[v0] Paystack not loaded yet, retrying...');
        setTimeout(initiatePaystackPayment, 500);
        return;
    }

    // For demo purposes, using a test email
    // In production, collect actual donor email
    const email = 'donor@charity.org';
    const amount = Math.round(currentAmount * 100); // Convert to cents

    console.log('[v0] Initiating Paystack payment with:', {
        amount: amount,
        email: email,
        type: currentDonationType,
        frequency: currentFrequency,
        purpose: supportPurpose.value
    });

    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount,
        currency: 'KES',
        ref: 'DONATION_' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
            donation_type: currentDonationType,
            frequency: currentFrequency,
            purpose: supportPurpose.value || 'general',
            starting_date: currentDonationType === 'recurring' ? donationStartDate.value : null
        },
        onClose: function() {
            console.log('[v0] Payment window closed');
        },
        onSuccess: function(response) {
            console.log('[v0] Payment successful:', response.reference);
            handlePaymentSuccess(response);
        }
    });

    handler.openIframe();
}

// ============================================
// HANDLE PAYMENT SUCCESS
// ============================================
function handlePaymentSuccess(response) {
    // In production, verify the payment with your backend
    console.log('[v0] Processing payment:', response.reference);
    
    // Simulate backend verification
    setTimeout(() => {
        const donationTypeText = currentDonationType === 'recurring' ? 'recurring ' : '';
        const message = `Your ${donationTypeText}donation of $${currentAmount.toFixed(2)} has been processed successfully!\n\nReference: ${response.reference}`;
        showSuccessModal(message);
        
        // Reset form
        paymentForm.reset();
        amountInput.value = '0.00';
        currentAmount = 0;
        currentDonationType = 'one-time';
        currentFrequency = 'weekly';
        
        // Reset UI
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-type="one-time"]').classList.add('active');
        frequencySection.classList.remove('show');
        startingSection.classList.remove('show');
    }, 1000);
}

// ============================================
// FORM SUBMISSION
// ============================================
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('[v0] Form submitted. Current amount:', currentAmount);

    // Validate amount - amount is required and must be greater than 0
    if (!amountInput.value || amountInput.value === '' || amountInput.value === '0.00') {
        showError('Donation amount is required. Please enter an amount greater than 0.');
        amountInput.focus();
        return;
    }

    if (currentAmount < 0.01) {
        showError('Donation amount must be greater than 0. Please enter a valid amount.');
        amountInput.focus();
        return;
    }

    // Validate purpose
    if (!supportPurpose.value) {
        showError('Please select a support purpose');
        supportPurpose.focus();
        return;
    }

    // Validate starting date for recurring donations
    if (currentDonationType === 'recurring' && !donationStartDate.value) {
        showError('Please select a starting date for recurring donation');
        donationStartDate.focus();
        return;
    }

    console.log('[v0] All validations passed. Initiating Paystack payment:', {
        amount: currentAmount,
        type: currentDonationType,
        frequency: currentFrequency,
        purpose: supportPurpose.value
    });

    // Initiate Paystack payment
    initiatePaystackPayment();
});

// ============================================
// MODAL FUNCTIONS
// ============================================
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    successModal.classList.add('active');
}

function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    errorModal.classList.add('active');
}

function closeModal() {
    successModal.classList.remove('active');
}

function closeErrorModal() {
    errorModal.classList.remove('active');
}

function showError(message) {
    console.error('[v0] Error:', message);
    showErrorModal(message);
}

// ============================================
// CLOSE MODALS ON BACKGROUND CLICK
// ============================================
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadPaystackScript();
    
    // Set default starting date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startingDate').value = today;
});

