document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const body = document.querySelector('body');
    const sidebar = document.querySelector('.sidebar');
    
    // Create mobile toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-toggle');
    mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    body.appendChild(mobileToggle);
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = mobileToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the target section
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Close sidebar on mobile after clicking a link
            if (window.innerWidth < 993) {
                sidebar.classList.remove('active');
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Parallax effect for background images
    window.addEventListener('scroll', function() {
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        
        parallaxBgs.forEach(bg => {
            const scrollPosition = window.pageYOffset;
            const parentSection = bg.parentElement;
            const sectionTop = parentSection.offsetTop;
            const sectionHeight = parentSection.offsetHeight;
            
            // Only apply parallax if section is in view
            if (scrollPosition > sectionTop - window.innerHeight && 
                scrollPosition < sectionTop + sectionHeight) {
                const speed = 0.5; // Adjust for faster/slower parallax
                const yPos = (scrollPosition - sectionTop) * speed;
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
    
    // Parallax effect for series and speaker images
    function handleImageParallax() {
        const containers = document.querySelectorAll('.series-image-container, .speaker-image-container, .subscribe-image');
        
        containers.forEach(container => {
            const image = container.querySelector('.series-image') || 
                          container.querySelector('.speaker-image') ||
                          container.querySelector('.subscribe-bg');
            
            if (!image) return;
            
            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;
            const windowCenter = window.innerHeight / 2;
            const distanceFromCenter = containerCenter - windowCenter;
            
            // Calculate parallax amount based on distance from center of viewport
            const parallaxAmount = distanceFromCenter * 0.1;
            
            // Apply parallax effect if container is in viewport
            if (containerRect.top < window.innerHeight && containerRect.bottom > 0) {
                image.style.transform = `translateY(${parallaxAmount}px)`;
            }
        });
    }
    
    // Call on scroll and on initial load
    window.addEventListener('scroll', handleImageParallax);
    handleImageParallax();
    
    // Animate stats counter in hero section
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 16ms is roughly one frame at 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        });
    }
    
    // Trigger stats animation when hero section is in view
    const heroSection = document.querySelector('.hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // Video play button functionality
    const playButton = document.querySelector('.play-button');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (playButton && videoWrapper) {
        playButton.addEventListener('click', function() {
            // In a real implementation, this would replace the image with an iframe
            // For this example, we'll just change the appearance
            const videoPlaceholder = videoWrapper.querySelector('.video-placeholder');
            
            // Create a message to show instead of actual video (for demo purposes)
            const videoMessage = document.createElement('div');
            videoMessage.classList.add('video-message');
            videoMessage.innerHTML = `
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                            display: flex; align-items: center; justify-content: center; 
                            background-color: #000; color: #fff; text-align: center; padding: 2rem;">
                    <div>
                        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Video Player</h3>
                        <p>In a real implementation, this would load the actual sermon video.</p>
                    </div>
                </div>
            `;
            
            // Replace placeholder with message
            videoPlaceholder.style.display = 'none';
            playButton.style.display = 'none';
            videoWrapper.appendChild(videoMessage);
        });
    }
    
    // Sermon filtering functionality
    const sermonCards = document.querySelectorAll('.sermon-card');
    const seriesFilter = document.getElementById('series-filter');
    const speakerFilter = document.getElementById('speaker-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.querySelector('.search-input');
    
    function filterSermons() {
        const seriesValue = seriesFilter ? seriesFilter.value : '';
        const speakerValue = speakerFilter ? speakerFilter.value : '';
        const dateValue = dateFilter ? dateFilter.value : '';
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        
        sermonCards.forEach(card => {
            const seriesMath = !seriesValue || card.dataset.series === seriesValue;
            const speakerMatch = !speakerValue || card.dataset.speaker === speakerValue;
            const dateMatch = !dateValue || matchDateFilter(card.dataset.date, dateValue);
            
            const cardTitle = card.querySelector('.sermon-card-title').textContent.toLowerCase();
            const cardExcerpt = card.querySelector('.sermon-card-excerpt').textContent.toLowerCase();
            const searchMatch = !searchValue || 
                               cardTitle.includes(searchValue) || 
                               cardExcerpt.includes(searchValue);
            
            if (seriesMath && speakerMatch && dateMatch && searchMatch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    function matchDateFilter(cardDate, filterValue) {
        if (!filterValue) return true;
        
        const date = new Date(cardDate);
        const now = new Date();
        
        switch(filterValue) {
            case 'month':
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(now.getMonth() - 1);
                return date >= oneMonthAgo;
            case 'quarter':
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(now.getMonth() - 3);
                return date >= threeMonthsAgo;
            case 'year':
                return date.getFullYear() === now.getFullYear();
            case 'last-year':
                return date.getFullYear() === now.getFullYear() - 1;
            default:
                return true;
        }
    }
    
    // Add event listeners to filters
    if (seriesFilter) seriesFilter.addEventListener('change', filterSermons);
    if (speakerFilter) speakerFilter.addEventListener('change', filterSermons);
    if (dateFilter) dateFilter.addEventListener('change', filterSermons);
    
    // Add event listener to search input with debounce
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterSermons, 300);
        });
    }
    
    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real implementation, this would load new sermon data
            // For this example, we'll just update the active state
            paginationBtns.forEach(b => b.classList.remove('active'));
            if (!this.classList.contains('next')) {
                this.classList.add('active');
            }
            
            // Scroll back to top of sermon archive section
            const archiveSection = document.getElementById('sermon-archive');
            if (archiveSection) {
                archiveSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Scroll animations for fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop - 200 && 
                window.pageYOffset < sectionTop + sectionHeight - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Subscribe form submission handling
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const subscribeBtn = this.querySelector('.subscribe-btn');
            const originalText = subscribeBtn.textContent;
            
            subscribeBtn.textContent = 'Subscribing...';
            subscribeBtn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Reset form
                subscribeForm.reset();
                
                // Show success message
                const formContainer = subscribeForm.parentElement;
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.innerHTML = '<p style="color: #333; font-weight: 600; text-align: center; padding: 1rem; background-color: #f0f0f0; border-radius: 4px;">Thank you for subscribing! You\'ll receive our sermon updates in your inbox.</p>';
                
                // Replace form with success message
                subscribeForm.style.display = 'none';
                formContainer.appendChild(successMessage);
            }, 1500);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get the button, overlay, and close button elements
  const moreLeadersBtn = document.getElementById("more-leaders-btn")
  const leadersOverlay = document.getElementById("leaders-overlay")
  const closeOverlayBtn = document.getElementById("close-overlay")

  // Function to open the overlay
  function openOverlay() {
    leadersOverlay.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling of the background
  }

  // Function to close the overlay
  function closeOverlay() {
    leadersOverlay.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling
  }

  // Event listeners
  if (moreLeadersBtn) {
    moreLeadersBtn.addEventListener("click", openOverlay)
  }

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener("click", closeOverlay)
  }

  // Close overlay when clicking outside the content
  leadersOverlay.addEventListener("click", (event) => {
    if (event.target === leadersOverlay) {
      closeOverlay()
    }
  })

  // Close overlay when pressing Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && leadersOverlay.classList.contains("active")) {
      closeOverlay()
    }
  })

  // Apply parallax effect to speaker images in the overlay
  function handleSpeakerParallax() {
    const speakerContainers = document.querySelectorAll(".parallax-container")

    speakerContainers.forEach((container) => {
      const image = container.querySelector(".speaker-image")
      if (!image) return

      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2
      const windowCenter = window.innerHeight / 2
      const distanceFromCenter = containerCenter - windowCenter

      // Calculate parallax amount based on distance from center of viewport
      const parallaxAmount = distanceFromCenter * 0.05

      // Apply parallax effect if container is in viewport
      if (containerRect.top < window.innerHeight && containerRect.bottom > 0) {
        image.style.transform = `translateY(${parallaxAmount}px)`
      }
    })
  }

  // Call parallax function on scroll and when overlay is opened
  window.addEventListener("scroll", handleSpeakerParallax)
  moreLeadersBtn.addEventListener("click", () => {
    // Wait for overlay to be visible before applying parallax
    setTimeout(handleSpeakerParallax, 300)
  })
})

