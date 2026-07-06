// Blog Page Improved JavaScript

// Sample Blog Data
const blogPosts = [
  {
    id: 1,
    title: "Transforming Lives with Education",
    description: "Providing children and youth with access to quality education and learning resources that shape their future.",
    category: "Education",
    date: "May 20, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "transforming-lives-with-education"
  },
  {
    id: 2,
    title: "Fighting Hunger, Spreading Hope",
    description: "Our comprehensive food security program ensures no child goes hungry while building sustainable community resources.",
    category: "Healthcare",
    date: "May 18, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "fighting-hunger-spreading-hope"
  },
  {
    id: 3,
    title: "Clean Water Initiative",
    description: "Bringing clean, safe drinking water to remote communities with our state-of-the-art water purification systems.",
    category: "Healthcare",
    date: "May 15, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "clean-water-initiative"
  },
  {
    id: 4,
    title: "Building Skills for Tomorrow",
    description: "Our vocational training programs equip youth with practical skills needed for sustainable employment opportunities.",
    category: "Education",
    date: "May 12, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "building-skills-for-tomorrow"
  },
  {
    id: 5,
    title: "Healthcare Access for All",
    description: "Mobile clinics and health camps bringing essential medical services to underserved populations in rural areas.",
    category: "Healthcare",
    date: "May 10, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "healthcare-access-for-all"
  },
  {
    id: 6,
    title: "Community Development Report",
    description: "Quarterly update on our community development projects and the positive impact they're creating in local areas.",
    category: "Community",
    date: "May 08, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "community-development-report"
  },
  {
    id: 7,
    title: "Women Empowerment Success Stories",
    description: "Celebrating the achievements of women entrepreneurs participating in our economic empowerment initiative.",
    category: "Community",
    date: "May 05, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "women-empowerment-success-stories"
  },
  {
    id: 8,
    title: "Educational Scholarship Winners",
    description: "Meet the brilliant young minds selected for our 2024 scholarship program for underprivileged students.",
    category: "Education",
    date: "May 02, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "educational-scholarship-winners"
  },
  {
    id: 9,
    title: "Environmental Conservation Efforts",
    description: "Join us in our mission to protect the environment through sustainable practices and community involvement programs.",
    category: "Community",
    date: "April 28, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "environmental-conservation-efforts"
  },
  {
    id: 10,
    title: "Mental Health Awareness Campaign",
    description: "Understanding mental health challenges and promoting wellness in communities through education and support services.",
    category: "Healthcare",
    date: "April 25, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "mental-health-awareness-campaign"
  },
  {
    id: 11,
    title: "Youth Leadership Program",
    description: "Developing the next generation of leaders through mentorship, training, and hands-on community projects.",
    category: "Education",
    date: "April 22, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "youth-leadership-program"
  },
  {
    id: 12,
    title: "Nutrition & Well-being Initiative",
    description: "A comprehensive program addressing malnutrition and promoting healthy lifestyles in vulnerable communities.",
    category: "Healthcare",
    date: "April 19, 2024",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eH8QUUwCi1Gysh4NyzUZg7JiY7yPYT.png",
    slug: "nutrition-wellbeing-initiative"
  }
];

// State variables
let filteredPosts = [...blogPosts];
let displayedCount = 6;
const postsPerPage = 6;
let currentPage = 1;
let selectedCategories = [];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('searchInput');
const categoriesList = document.getElementById('categoriesList');
const clearFiltersBtn = document.getElementById('clearFilters');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const pagination = document.getElementById('pagination');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  renderBlogPosts();
  setupEventListeners();
});

// Initialize category filters
function initializeFilters() {
  const categories = [...new Set(blogPosts.map(post => post.category))].sort();
  
  categoriesList.innerHTML = categories.map(category => {
    const count = blogPosts.filter(p => p.category === category).length;
    return `
      <label class="category-item">
        <input 
          type="checkbox" 
          class="category-checkbox" 
          value="${category}"
          aria-label="Filter by ${category}"
        />
        <span class="category-label">${category}</span>
        <span class="category-count">(${count})</span>
      </label>
    `;
  });
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener('input', function(e) {
    currentPage = 1;
    displayedCount = 6;
    handleFilter();
  });

  // Category checkboxes
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      currentPage = 1;
      displayedCount = 6;
      handleFilter();
    });
  });

  // Clear filters button
  clearFiltersBtn.addEventListener('click', function() {
    searchInput.value = '';
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    selectedCategories = [];
    currentPage = 1;
    displayedCount = 6;
    handleFilter();
  });

  // Load More button
  loadMoreBtn.addEventListener('click', function() {
    displayedCount += postsPerPage;
    renderBlogPosts();
  });

  // Pagination
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('pagination-number')) {
      currentPage = parseInt(e.target.dataset.page);
      displayedCount = (currentPage - 1) * postsPerPage + postsPerPage;
      renderBlogPosts();
      blogGrid.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.target.classList.contains('pagination-btn')) {
      const direction = e.target.dataset.direction;
      if (direction === 'prev' && currentPage > 1) {
        currentPage--;
      } else if (direction === 'next') {
        currentPage++;
      }
      displayedCount = (currentPage - 1) * postsPerPage + postsPerPage;
      renderBlogPosts();
      blogGrid.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Read More links
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more-link')) {
      e.preventDefault();
      const postSlug = e.target.dataset.slug;
      // Replace with your actual blog post page URL
      // window.location.href = `/blog/${postSlug}`;
      console.log('[v0] Read More clicked for:', postSlug);
    }
  });
}

// Handle filtering
function handleFilter() {
  selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
  
  const searchTerm = searchInput.value.toLowerCase();
  
  filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                         post.description.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category);
    
    return matchesSearch && matchesCategory;
  });

  currentPage = 1;
  displayedCount = 6;
  renderBlogPosts();
  
  // Update clear filters button visibility
  clearFiltersBtn.style.display = (searchTerm || selectedCategories.length > 0) ? 'block' : 'none';
}

// Render blog posts
function renderBlogPosts() {
  const postsToDisplay = filteredPosts.slice(0, displayedCount);
  
  // Update results count
  if (filteredPosts.length === 0) {
    resultsCount.textContent = 'No articles found';
    noResults.style.display = 'block';
    blogGrid.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    pagination.innerHTML = '';
  } else {
    resultsCount.textContent = `Showing ${Math.min(displayedCount, filteredPosts.length)} of ${filteredPosts.length} articles`;
    noResults.style.display = 'none';
    
    // Render grid
    blogGrid.innerHTML = postsToDisplay.map(post => `
      <article class="blog-card">
        <div class="blog-image-wrapper">
          <img 
            src="${post.image}" 
            alt="${post.title}"
            class="blog-image"
            loading="lazy"
          />
          <span class="category-badge">${post.category}</span>
        </div>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-description">${post.description}</p>
        <div class="blog-card-meta">
          <time class="blog-date" datetime="${post.date}">${post.date}</time>
          <a href="#" class="read-more-link" data-slug="${post.slug}">Read More</a>
        </div>
      </article>
    `).join('');

    // Update load more button
    loadMoreBtn.style.display = displayedCount < filteredPosts.length ? 'block' : 'none';
    loadMoreBtn.disabled = displayedCount >= filteredPosts.length;

    // Render pagination
    renderPagination();
  }
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <button 
      class="pagination-btn" 
      data-direction="prev"
      ${currentPage === 1 ? 'disabled' : ''}
      aria-label="Previous page"
    >
      ← Previous
    </button>
  `;

  // Page numbers (show max 5 pages)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  if (startPage > 1) {
    paginationHTML += `<button class="pagination-number" data-page="1">1</button>`;
    if (startPage > 2) paginationHTML += `<span style="color: #999; padding: 0 8px;">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button 
        class="pagination-number ${i === currentPage ? 'active' : ''}" 
        data-page="${i}"
        aria-label="Go to page ${i}"
        aria-current="${i === currentPage ? 'page' : ''}"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) paginationHTML += `<span style="color: #999; padding: 0 8px;">...</span>`;
    paginationHTML += `<button class="pagination-number" data-page="${totalPages}">${totalPages}</button>`;
  }

  // Next button
  paginationHTML += `
    <button 
      class="pagination-btn" 
      data-direction="next"
      ${currentPage === totalPages ? 'disabled' : ''}
      aria-label="Next page"
    >
      Next →
    </button>
  `;

  pagination.innerHTML = paginationHTML;
}