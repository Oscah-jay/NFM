function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "block";
    }
}

const $list=document.querySelectorAll('li');

function activeLink() {
    $list.forEach(($li) => {
        $li.classList.remove('active')
    });
    this.classList.add('active');
}
$list.forEach(($li) => {
    $li.addEventListener(
        'click',
         activeLink,
         );
});

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        document.querySelectorAll('.card').forEach(c => {
            c.style.animationPlayState = 'paused';
        });
    });

    card.addEventListener('mouseleave', () => {
        document.querySelectorAll('.card').forEach(c => {
            c.style.animationPlayState = 'running';
        });
    });
});


function goToLeadersPage() {
    window.location.href = 'leaders.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add hover effect
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '2';
        });
    });
    
    // Handle mobile view
    function handleResponsiveLayout() {
        const timeline = document.querySelector('.timeline');
        const isMobile = window.innerWidth <= 480;
        
        if (isMobile) {
            // Calculate height for vertical timeline
            let totalHeight = 0;
            timelineItems.forEach(item => {
                totalHeight += item.offsetHeight + 40; // item height + margin
            });
            timeline.style.height = (totalHeight + 50) + 'px';
        } else {
            timeline.style.height = window.innerWidth <= 768 ? '350px' : '400px';
        }
    }
    
    // Run on load and resize
    window.addEventListener('resize', handleResponsiveLayout);
    handleResponsiveLayout();
    
    // For touch devices
    if ('ontouchstart' in window) {
        document.querySelector('.timeline-container').style.overflowX = 'scroll';
    }
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the hero content element
    const heroContent = document.querySelector('.hero-content');
    const video = document.getElementById('background-video');
    
    // Ensure video plays
    video.play().catch(function(error) {
        console.log("Video play failed:", error);
        
        // If autoplay fails (common on mobile), add a play button
        if (error.name === "NotAllowedError") {
            const playButton = document.createElement('button');
            playButton.textContent = "Click to Play";
            playButton.className = "video-play-button";
            document.querySelector('.hero-section').appendChild(playButton);
            
            playButton.addEventListener('click', function() {
                video.play();
                playButton.style.display = 'none';
            });
        }
    });
    
    // Simple fade-in animation for content
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1.5s ease-in-out';
        heroContent.style.opacity = '1';
    }, 300);
});


document.addEventListener('DOMContentLoaded', function() {
    // Fade-in animation for content
    const aboutContent = document.querySelector('.about-content');
    const aboutImage = document.querySelector('.about-image');
    
    // Set initial opacity
    aboutContent.style.opacity = 0;
    aboutImage.style.opacity = 0;
    
    // Add transition property
    aboutContent.style.transition = 'opacity 1s ease, transform 1s ease';
    aboutImage.style.transition = 'opacity 1s ease, transform 1s ease';
    
    // Set initial transform for slide-in effect
    aboutContent.style.transform = 'translateX(-20px)';
    aboutImage.style.transform = 'translateX(20px)';
    
    // Trigger animation after a short delay
    setTimeout(() => {
        aboutContent.style.opacity = 1;
        aboutContent.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            aboutImage.style.opacity = 1;
            aboutImage.style.transform = 'translateX(0)';
        }, 300);
    }, 300);
    
    // Optional: Add hover effect to the Read More button
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    readMoreBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    readMoreBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Fade-in animation for content
    const leadershipContent = document.querySelector('.leadership-content');
    const leadershipImage = document.querySelector('.leadership-image');
    
    // Set initial opacity
    leadershipContent.style.opacity = 0;
    leadershipImage.style.opacity = 0;
    
    // Add transition property
    leadershipContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    leadershipImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Set initial transform for slide-in effect
    leadershipContent.style.transform = 'translateY(20px)';
    leadershipImage.style.transform = 'translateY(20px)';
    
    // Trigger animation after a short delay
    setTimeout(() => {
        leadershipContent.style.opacity = 1;
        leadershipContent.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            leadershipImage.style.opacity = 1;
            leadershipImage.style.transform = 'translateY(0)';
        }, 200);
    }, 300);
    
    // Navigation arrows functionality
    // This is a placeholder for actual slider functionality
    // You would need to add more leaders to make this work
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    prevButton.addEventListener('click', function() {
        console.log('Previous leader');
        // Add your slider functionality here
        alert('Navigate to previous leader');
    });
    
    nextButton.addEventListener('click', function() {
        console.log('Next leader');
        // Add your slider functionality here
        alert('Navigate to next leader');
    });
    
    // Button hover effect
    const leadershipBtn = document.querySelector('.leadership-btn');
    
    leadershipBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
    
    leadershipBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

//footer

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

document.addEventListener("DOMContentLoaded", () => {
    // Parallax effect for sermon section background
    function handleSermonsParallax() {
      const sermonsSection = document.querySelector(".sermons-preview-section")
      if (!sermonsSection) return
  
      const parallaxBg = sermonsSection.querySelector(".parallax-bg")
      if (!parallaxBg) return
  
      const scrollPosition = window.pageYOffset
      const sectionTop = sermonsSection.offsetTop
      const sectionHeight = sermonsSection.offsetHeight
  
      // Only apply parallax if section is in view
      if (scrollPosition > sectionTop - window.innerHeight && scrollPosition < sectionTop + sectionHeight) {
        const speed = 0.4 // Adjust for faster/slower parallax
        const yPos = (scrollPosition - sectionTop) * speed
        parallaxBg.style.transform = `translateY(${yPos}px)`
      }
    }
  
    // Call on scroll and on initial load
    window.addEventListener("scroll", handleSermonsParallax)
    handleSermonsParallax()
  
    // Animate sermon cards on hover
    const sermonCards = document.querySelectorAll(".sermon-card")
  
    sermonCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        const image = this.querySelector(".sermon-image")
        if (image) {
          image.style.transform = "scale(1.1)"
        }
      })
  
      card.addEventListener("mouseleave", function () {
        const image = this.querySelector(".sermon-image")
        if (image) {
          image.style.transform = "scale(1)"
        }
      })
    })
  })

  document.addEventListener("DOMContentLoaded", () => {
    // Countdown Timer for Conference
    let countdownInterval // Declare countdownInterval
    function updateCountdown() {
      // Set the date we're counting down to (November 24, 2023)
      const countdownDate = new Date("June 24, 2025 09:00:00").getTime()
      const now = new Date().getTime()
      const distance = countdownDate - now
  
      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
      // Display the result
      document.getElementById("countdown-days").textContent = days.toString().padStart(2, "0")
      document.getElementById("countdown-hours").textContent = hours.toString().padStart(2, "0")
      document.getElementById("countdown-minutes").textContent = minutes.toString().padStart(2, "0")
      document.getElementById("countdown-seconds").textContent = seconds.toString().padStart(2, "0")
  
      // If the countdown is finished, display a message
      if (distance < 0) {
        clearInterval(countdownInterval)
        document.getElementById("countdown-days").textContent = "00"
        document.getElementById("countdown-hours").textContent = "00"
        document.getElementById("countdown-minutes").textContent = "00"
        document.getElementById("countdown-seconds").textContent = "00"
  
        const countdownContainer = document.querySelector(".countdown-container")
        if (countdownContainer) {
          countdownContainer.innerHTML = '<h3 class="event-live">Event In Progress!</h3>'
        }
      }
    }
  
    // Update the countdown every 1 second
    if (document.getElementById("conference-countdown")) {
      updateCountdown() // Run once immediately
      countdownInterval = setInterval(updateCountdown, 1000)
    }
  
    // Newsletter form submission
    const newsletterForm = document.querySelector(".newsletter-form")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        const emailInput = this.querySelector('input[type="email"]')
        const email = emailInput.value
  
        // Simulate form submission
        const subscribeBtn = this.querySelector(".subscribe-btn")
        const originalText = subscribeBtn.textContent
  
        subscribeBtn.textContent = "Subscribing..."
        subscribeBtn.disabled = true
  
        // Simulate API call with timeout
        setTimeout(() => {
          // Reset form
          newsletterForm.reset()
  
          // Show success message
          const formGroup = document.querySelector(".form-group")
          const successMessage = document.createElement("div")
          successMessage.classList.add("success-message")
          successMessage.innerHTML = "<p>Thank you for subscribing! You will now receive our weekly updates.</p>"
  
          formGroup.innerHTML = ""
          formGroup.appendChild(successMessage)
  
          // Hide consent checkbox
          document.querySelector(".form-consent").style.display = "none"
        }, 1500)
      })
    }
  
    // Animate elements on scroll
    const fadeElements = document.querySelectorAll(".fade-in")
  
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )
  
    fadeElements.forEach((element) => {
      fadeObserver.observe(element)
    })
  })

// ============================================
// DONATION SECTION - VANILLA JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const donateButton = document.getElementById('donateBtn');
    const donationSection = document.getElementById('donationSection');

    if (!donateButton) return;

    // Button Click Handler
    donateButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add ripple effect
        createRipple(e, donateButton);
        
        // Donate action - Replace with your actual donation link
        handleDonation('./support.html');
    });

    // Keyboard Accessibility
    donateButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            donateButton.click();
        }
    });

    // Create ripple effect on button click
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        ripple.style.transformOrigin = 'center';

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Handle donation action
    function handleDonation() {
        // Option 1: Show alert (for demo)
        console.log('Donation button clicked!');

        window.location.href = './support.html'; // Redirect to donation page

        
        // Option 3: Open in new tab (uncomment below)
        // window.open('https://your-donation-page.com', '_blank');
        
        // Option 4: Trigger custom event for external handling (uncomment below)
        // const event = new CustomEvent('donationInitiated', { detail: { timestamp: new Date() } });
        // window.dispatchEvent(event);
    }

    // Add ripple animation keyframes to document if not already present
    if (!document.getElementById('rippleStyles')) {
        const style = document.createElement('style');
        style.id = 'rippleStyles';
        style.innerHTML = `
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Intersection Observer for scroll animations (optional)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (donationSection) {
            observer.observe(donationSection);
        }
    }
});

// Strip Section - Progress Bar Animation

document.addEventListener('DOMContentLoaded', function() {
  // Animate progress bar on page load
  const progressBar = document.querySelector('.progress-bar-fill');
  
  if (progressBar) {
    // Trigger animation by ensuring the element is in the DOM first
    setTimeout(() => {
      progressBar.style.transition = 'width 1.2s ease-out';
    }, 100);
  }

  // Intersection Observer for scroll-triggered animation
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.progress-bar-fill');
        if (progressBar && !progressBar.classList.contains('animated')) {
          progressBar.classList.add('animated');
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  const stripSection = document.querySelector('.strip-section');
  if (stripSection) {
    observer.observe(stripSection);
  }
});

// Optional: Add click handlers for badges or other interactions
document.addEventListener('DOMContentLoaded', function() {
  const badge = document.querySelector('.campaign-badge');
  
  if (badge) {
    badge.addEventListener('click', function() {
      console.log('Healthcare campaign selected');
      // Add your custom logic here
    });

    badge.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
});

// Charity Services Section JavaScript

// Get quote button functionality
const quoteBtn = document.getElementById('quoteBtn');

if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
        // Replace with your actual quote/contact page URL
        console.log('Support Our Mission clicked');
        window.location.href = './support.html';
        // Or open a modal, form, etc.
    });

    // Keyboard accessibility for button
    quoteBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            quoteBtn.click();
        }
    });
}

// Intersection Observer for scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observe service cards for animation on scroll
const charityServices = document.getElementById('charityServices');
if (charityServices) {
    const cards = charityServices.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.8s ease-out ${0.3 + index * 0.1}s forwards`;
    });
}

// Gallery Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
  const galleryTrack = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  
  let currentPosition = 0;
  let itemWidth = 0;
  let gap = 24;
  let visibleItems = 2;
  let totalItems = 0;

  // Initialize gallery
  function initGallery() {
    const items = galleryTrack.querySelectorAll('.gallery-item');
    totalItems = items.length;
    
    if (items.length > 0) {
      itemWidth = items[0].offsetWidth;
    }
    
    updateResponsiveness();
  }

  // Update responsiveness based on screen size
  function updateResponsiveness() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
      visibleItems = 1;
      gap = 12;
    } else if (screenWidth <= 768) {
      visibleItems = 1;
      gap = 16;
    } else if (screenWidth <= 1024) {
      visibleItems = 2;
      gap = 20;
    } else {
      visibleItems = 2;
      gap = 24;
    }

    // Recalculate item width
    const items = galleryTrack.querySelectorAll('.gallery-item');
    if (items.length > 0) {
      itemWidth = items[0].offsetWidth;
    }

    // Reset position if needed
    const maxScroll = Math.max(0, (totalItems - visibleItems) * (itemWidth + gap));
    if (currentPosition > maxScroll) {
      currentPosition = maxScroll;
      updateGalleryPosition();
    }

    updateButtonStates();
  }

  // Update gallery position
  function updateGalleryPosition() {
    const offset = -currentPosition;
    galleryTrack.style.transform = `translateX(${offset}px)`;
  }

  // Update button states
  function updateButtonStates() {
    const maxScroll = Math.max(0, (totalItems - visibleItems) * (itemWidth + gap));
    
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= maxScroll;
    
    prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentPosition >= maxScroll ? '0.5' : '1';
  }

  // Scroll to next
  function scrollNext() {
    const maxScroll = Math.max(0, (totalItems - visibleItems) * (itemWidth + gap));
    const nextPosition = Math.min(
      currentPosition + (itemWidth + gap),
      maxScroll
    );
    
    if (nextPosition !== currentPosition) {
      currentPosition = nextPosition;
      updateGalleryPosition();
      updateButtonStates();
    }
  }

  // Scroll to previous
  function scrollPrev() {
    const prevPosition = Math.max(0, currentPosition - (itemWidth + gap));
    
    if (prevPosition !== currentPosition) {
      currentPosition = prevPosition;
      updateGalleryPosition();
      updateButtonStates();
    }
  }

  // Event listeners
  nextBtn.addEventListener('click', scrollNext);
  prevBtn.addEventListener('click', scrollPrev);

  // Handle keyboard navigation
  nextBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollNext();
    }
  });

  prevBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollPrev();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    updateResponsiveness();
  });

  // Initialize on load
  initGallery();
  updateButtonStates();
});
  
  
  
  