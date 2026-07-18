// ============================================
// PAYSTACK GIVING PAGE - CLEAN & UNIFIED JS
// ============================================

// Configuration
const PAYSTACK_CONFIG = {
    PUBLIC_KEY: 'pk_test_745a86335b6e3a7bd1861b7531505c64fc3ddbf7',
    SCRIPT_URL: 'https://js.paystack.co/v1/inline.js'
};

// State Management
let donationState = {
    type: 'onetime',
    frequency: 'month',
    amount: 0,
    purpose: '',
    name: '',
    email: '',
    anonymous: false,
    startingDate: ''
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function generateReference() {
    return 'DONATION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatAmountDisplay() {
    const input = document.getElementById('donationAmountInput');
    const value = parseFloat(input.value) || 0;
    donationState.amount = value;
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetForm();
    }
}

function closeDonationModal(event) {
    if (event && event.target.id !== 'donationModal') {
        return;
    }
    
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function showSuccessModal(donationData) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    
    if (modal && message) {
        message.textContent = `Thank you for your donation of KES ${donationData.amount.toLocaleString()}! A confirmation email has been sent to ${donationData.email}.`;
        modal.classList.add('active');
        
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showErrorModal(errorMessage) {
    const modal = document.getElementById('errorModal');
    const message = document.getElementById('errorMessage');
    
    if (modal && message) {
        message.textContent = errorMessage || 'An error occurred. Please try again.';
        modal.classList.add('active');
    }
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// FORM MANAGEMENT FUNCTIONS
// ============================================

function resetForm() {
    donationState = {
        type: 'onetime',
        frequency: 'month',
        amount: 0,
        purpose: '',
        name: '',
        email: '',
        anonymous: false,
        startingDate: ''
    };
    
    const elements = {
        amount: 'donationAmountInput',
        purpose: 'supportPurpose',
        name: 'donorName',
        email: 'donorEmail',
        anonymous: 'anonymousGift',
        startingDate: 'startingDate'
    };
    
    for (const [key, id] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = false;
            } else if (id === 'startingDate') {
                el.value = new Date().toISOString().split('T')[0];
            } else {
                el.value = '';
            }
        }
    }
    
    setDonationType('onetime');
    setFrequency('month');
}

function setDonationType(type) {
    donationState.type = type;
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    const frequencySection = document.getElementById('frequencySection');
    const startingSection = document.getElementById('startingSection');
    
    if (type === 'recurring') {
        if (frequencySection) frequencySection.classList.remove('hidden');
        if (startingSection) startingSection.classList.remove('hidden');
    } else {
        if (frequencySection) frequencySection.classList.add('hidden');
        if (startingSection) startingSection.classList.add('hidden');
    }
}

function setFrequency(frequency) {
    donationState.frequency = frequency;
    
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.frequency === frequency);
    });
}

function validateForm() {
    const errors = [];
    
    if (!donationState.amount || donationState.amount < 0.01) {
        errors.push('Please enter a donation amount');
    }
    
    const purpose = document.getElementById('supportPurpose').value;
    if (!purpose) {
        errors.push('Please select a support purpose');
    } else {
        donationState.purpose = purpose;
    }
    
    const name = document.getElementById('donorName').value.trim();
    if (!name) {
        errors.push('Please enter your full name');
    } else {
        donationState.name = sanitizeInput(name);
    }
    
    const email = document.getElementById('donorEmail').value.trim();
    if (!email || !isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    } else {
        donationState.email = email;
    }
    
    if (donationState.type === 'recurring') {
        const startingDate = document.getElementById('startingDate').value;
        if (!startingDate) {
            errors.push('Please select a starting date for recurring donations');
        } else {
            donationState.startingDate = startingDate;
        }
    }
    
    const anonCheckbox = document.getElementById('anonymousGift');
    if (anonCheckbox) {
        donationState.anonymous = anonCheckbox.checked;
    }
    
    return errors;
}

// ============================================
// FORM SUBMISSION & PAYMENT
// ============================================

function handleDonationSubmit(event) {
    event.preventDefault();
    
    const errors = validateForm();
    
    if (errors.length > 0) {
        showErrorModal(errors.join('\n'));
        return;
    }
    
    closeDonationModal();
    
    setTimeout(() => {
        initializePaystackPayment();
    }, 300);
}

function initializePaystackPayment() {
    console.log('Initiating Paystack payment:', {
        amount: donationState.amount,
        email: donationState.email,
        type: donationState.type,
        purpose: donationState.purpose
    });
    
    if (typeof PaystackPop === 'undefined') {
        const script = document.createElement('script');
        script.src = PAYSTACK_CONFIG.SCRIPT_URL;
        script.onload = openPaystackCheckout;
        document.body.appendChild(script);
    } else {
        openPaystackCheckout();
    }
}

function openPaystackCheckout() {
    const handler = PaystackPop.setup({
        key: PAYSTACK_CONFIG.PUBLIC_KEY,
        email: donationState.email,
        amount: Math.round(donationState.amount * 100),
        currency: 'KES',
        ref: generateReference(),
        metadata: {
            donor_name: donationState.anonymous ? 'Anonymous Donor' : donationState.name,
            donation_purpose: donationState.purpose,
            donation_type: donationState.type,
            frequency: donationState.frequency,
            is_anonymous: donationState.anonymous,
            starting_date: donationState.startingDate
        },
        onClose: function() {
            console.log('Payment window closed');
        },
        onSuccess: function(response) {
            console.log('[v0] Payment successful:', response.reference);
            handlePaymentSuccess(response);
        }
    });
    
    handler.openIframe();
}

function handlePaymentSuccess(response) {
    console.log('Processing successful payment');
    
    const donationData = {
        reference: response.reference,
        amount: donationState.amount,
        currency: 'KES',
        email: donationState.email,
        name: donationState.anonymous ? 'Anonymous Donor' : donationState.name,
        purpose: donationState.purpose,
        type: donationState.type,
        frequency: donationState.type === 'recurring' ? donationState.frequency : null,
        startingDate: donationState.type === 'recurring' ? donationState.startingDate : null,
        anonymous: donationState.anonymous,
        timestamp: new Date().toISOString()
    };
    
    verifyPayment(response.reference, donationData);
}

function verifyPayment(reference, donationData) {
    console.log('Verifying payment reference:', reference);
    
    // TODO: Implement backend verification
    // const response = await fetch('/api/donations/verify', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ reference, ...donationData })
    // });
    
    showSuccessModal(donationData);
}

// ============================================
// PAGE FEATURES & ANIMATIONS
// ============================================

function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    if (faqAnswer) faqAnswer.style.display = 'none';
                }
            });
            
            item.classList.toggle('active');
            if (answer) {
                answer.style.display = isActive ? 'none' : 'block';
            }
        });
    });
}

function animateCounters() {
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

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function updateSidebarNavigation() {
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
}

function setupMobileNavbar() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
            });
        });
    }
}

function setupModalHandlers() {
    const modals = [
        { id: 'donationModal', handler: closeDonationModal },
        { id: 'successModal', handler: closeSuccessModal },
        { id: 'errorModal', handler: closeErrorModal }
    ];
    
    modals.forEach(({ id, handler }) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    handler(e);
                }
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[v0] Initializing giving page');
    
    // Setup form
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmit);
    }
    
    // Setup amount input
    const amountInput = document.getElementById('donationAmountInput');
    if (amountInput) {
        amountInput.addEventListener('input', formatAmountDisplay);
    }
    
    // Setup page features
    setupFAQ();
    animateCounters();
    setupScrollAnimations();
    updateSidebarNavigation();
    setupMobileNavbar();
    setupModalHandlers();
    
    console.log('[v0] Giving page initialization complete');
});


function goToNextStep() {
    const amountInput = document.getElementById("donationAmountInput");
    const error = document.getElementById("amountError");

    if (amountInput.value.trim() === "" || Number(amountInput.value) <= 0) {
        error.textContent = "Please enter a donation amount.";

        amountInput.focus();
        amountInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    error.textContent = "";

    // Move to the next step
    nextStep();
}
