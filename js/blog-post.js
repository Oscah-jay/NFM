// Sample blog posts data - same as in blog-page-improved.js
const blogPosts = [
    {
        id: 1,
        slug: "transforming-lives-with-education",
        title: "Transforming Lives with Education",
        category: "Education",
        date: "May 20, 2024",
        author: "Sarah Johnson",
        authorRole: "Communications Director",
        authorAvatar: "https://via.placeholder.com/40?text=SJ",
        image: "https://via.placeholder.com/1200x600?text=Education",
        excerpt: "Providing children and youth with access to quality education and learning resources.",
        content: `
            <h2>Transforming Lives with Education</h2>
            <p>Education is the foundation of progress, and it has the power to transform individual lives and entire communities. Our organization is dedicated to providing quality education and learning resources to children and youth who might otherwise lack access to these opportunities.</p>
            
            <h3>The Challenge</h3>
            <p>In many parts of the world, children face significant barriers to education. Whether due to poverty, geographic isolation, or lack of infrastructure, millions of young people are denied the opportunity to learn and develop their potential. This educational gap perpetuates cycles of poverty and limits economic opportunities for individuals and their communities.</p>
            
            <h3>Our Approach</h3>
            <p>We believe that every child deserves access to quality education. Our programs focus on:</p>
            <ul>
                <li><strong>Building Schools:</strong> We construct and renovate educational facilities in underserved communities, creating safe and conducive learning environments.</li>
                <li><strong>Teacher Training:</strong> We provide professional development to educators, equipping them with modern teaching methods and resources.</li>
                <li><strong>Learning Materials:</strong> We distribute textbooks, supplies, and digital resources to ensure students have the tools they need to succeed.</li>
                <li><strong>Scholarship Programs:</strong> We provide financial assistance to talented students who might otherwise drop out due to economic constraints.</li>
            </ul>
            
            <h3>Impact Stories</h3>
            <p>Over the past five years, our education initiatives have reached over 50,000 students. Many have gone on to pursue higher education and achieve their dreams. One success story is that of Maria, who received a scholarship through our program and is now studying engineering at a university.</p>
            
            <blockquote>
                "Without this opportunity, I never would have believed I could pursue my dreams. Education changed my life." - Maria, Scholarship Recipient
            </blockquote>
            
            <h3>Looking Forward</h3>
            <p>Education is an investment in the future. By providing quality learning opportunities today, we are building a brighter tomorrow for countless children. We invite you to join us in this mission to transform lives through education.</p>
            
            <p>Together, we can ensure that every child, regardless of their circumstances, has the opportunity to learn, grow, and achieve their full potential.</p>
        `
    },
    {
        id: 2,
        slug: "fighting-hunger-spreading-hope",
        title: "Fighting Hunger, Spreading Hope",
        category: "Food Security",
        date: "May 20, 2024",
        author: "Michael Chen",
        authorRole: "Community Programs Manager",
        authorAvatar: "https://via.placeholder.com/40?text=MC",
        image: "https://via.placeholder.com/1200x600?text=Food+Security",
        excerpt: "Providing children and youth with access to quality education and learning resources.",
        content: `
            <h2>Fighting Hunger, Spreading Hope</h2>
            <p>Food insecurity remains one of the most pressing challenges facing vulnerable communities. Hunger not only affects physical health but also impacts educational performance, mental well-being, and economic productivity. Our food security programs are designed to address immediate hunger while building long-term solutions for sustainable nutrition.</p>
            
            <h3>The Scope of Hunger</h3>
            <p>Millions of people worldwide struggle to access adequate nutrition. Children who experience hunger are more likely to underperform in school, miss classes due to illness, and face developmental challenges. Addressing food insecurity is crucial for breaking cycles of poverty.</p>
            
            <h3>Our Food Programs</h3>
            <ul>
                <li><strong>School Feeding Programs:</strong> We provide nutritious meals to students, ensuring they have the energy to learn and grow.</li>
                <li><strong>Emergency Food Relief:</strong> During crises, we distribute food packages to families in need.</li>
                <li><strong>Agricultural Training:</strong> We teach communities sustainable farming practices to improve food production.</li>
                <li><strong>Nutrition Education:</strong> We raise awareness about healthy eating habits and nutrition.</li>
            </ul>
            
            <h3>Success in Action</h3>
            <p>Our food security initiatives have helped thousands of families move toward self-sufficiency. Community gardens established through our programs now produce fresh vegetables year-round, improving nutrition while generating income for local farmers.</p>
            
            <blockquote>
                "This program gave us hope when we had nothing. Now we can feed our families and help our neighbors." - Community Leader
            </blockquote>
            
            <h3>Join the Fight Against Hunger</h3>
            <p>Hunger is a solvable problem when communities come together. Your support helps us provide meals, build sustainable food systems, and give hope to those facing food insecurity.</p>
        `
    },
    {
        id: 3,
        slug: "healthcare-access-for-all-communities",
        title: "Healthcare Access for All Communities",
        category: "Healthcare",
        date: "May 15, 2024",
        author: "Dr. Emma Williams",
        authorRole: "Health Program Director",
        authorAvatar: "https://via.placeholder.com/40?text=EW",
        image: "https://via.placeholder.com/1200x600?text=Healthcare",
        excerpt: "Ensuring that quality healthcare is accessible to even the most remote communities.",
        content: `
            <h2>Healthcare Access for All Communities</h2>
            <p>Health is a fundamental human right, yet millions lack access to basic medical care. Geographic barriers, poverty, and limited resources prevent many communities from receiving preventive and curative healthcare services. Our healthcare initiatives aim to bridge this gap.</p>
            
            <h3>Barriers to Healthcare</h3>
            <p>In many regions, the nearest clinic may be hours away. Medications are expensive, and trained healthcare providers are scarce. Maternal and child mortality rates remain high in underserved areas due to lack of prenatal care and emergency medical services.</p>
            
            <h3>Our Healthcare Solutions</h3>
            <ul>
                <li><strong>Mobile Clinics:</strong> We bring medical services to remote areas through mobile health units.</li>
                <li><strong>Training Programs:</strong> We train community health workers to provide basic healthcare and health education.</li>
                <li><strong>Medicine Supply:</strong> We provide essential medicines at affordable prices.</li>
                <li><strong>Maternal Health:</strong> We focus on prenatal care, safe deliveries, and postnatal support.</li>
            </ul>
            
            <h3>Health Impact</h3>
            <p>Through our programs, thousands have received timely medical treatment. Vaccination campaigns have protected children from preventable diseases, and maternal health programs have reduced complications during pregnancy and childbirth.</p>
            
            <h3>Your Support Makes a Difference</h3>
            <p>Every contribution helps us extend healthcare to more people. Together, we can ensure that quality healthcare is truly accessible to all.</p>
        `
    }
];

// Get post slug from URL parameter
function getPostSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug') || 'transforming-lives-with-education';
}

// Find post data by slug
function getPostBySlug(slug) {
    return blogPosts.find(post => post.slug === slug);
}

// Render blog post
function renderBlogPost() {
    const postSlug = getPostSlugFromUrl();
    const post = getPostBySlug(postSlug);

    if (!post) {
        document.getElementById('blogPostContainer').innerHTML = '<p>Post not found.</p>';
        return;
    }

    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = post.title;

    // Update post header
    document.getElementById('postCategory').textContent = post.category;
    document.getElementById('postDate').textContent = post.date;
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('authorName').textContent = post.author;
    document.getElementById('authorRole').textContent = post.authorRole;
    document.getElementById('authorAvatar').src = post.authorAvatar;
    document.getElementById('authorAvatar').alt = post.author;

    // Update featured image
    document.getElementById('featuredImage').src = post.image;
    document.getElementById('featuredImage').alt = post.title;

    // Update content
    document.getElementById('postContent').innerHTML = post.content;

    // Update page title
    document.title = post.title + ' - Latest Updates';

    // Render related posts
    renderRelatedPosts(post.slug);
}

// Render related posts
function renderRelatedPosts(currentPostSlug) {
    const relatedPosts = blogPosts.filter(post => post.slug !== currentPostSlug).slice(0, 3);
    const container = document.getElementById('relatedPostsGrid');

    if (relatedPosts.length === 0) {
        container.innerHTML = '<p>No related posts found.</p>';
        return;
    }

    container.innerHTML = relatedPosts.map(post => `
        <div class="related-post-card" onclick="navigateToPost('${post.slug}')">
            <div class="related-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="related-post-content">
                <span class="related-post-category">${post.category}</span>
                <h3 class="related-post-title">${post.title}</h3>
                <p class="related-post-date">${post.date}</p>
            </div>
        </div>
    `).join('');
}

// Navigate to post
function navigateToPost(slug) {
    window.location.href = `./blog-post.html?slug=${slug}`;
}

// Share functionality
function setupShareButtons() {
    const currentUrl = window.location.href;
    const postTitle = document.getElementById('postTitle').textContent;

    const shareButtons = {
        facebook: () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
        },
        twitter: () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
        },
        linkedin: () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
        },
        copy: () => {
            navigator.clipboard.writeText(currentUrl).then(() => {
                const btn = document.querySelector('.share-btn.copy');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        }
    };

    document.querySelector('.share-btn.facebook').addEventListener('click', shareButtons.facebook);
    document.querySelector('.share-btn.twitter').addEventListener('click', shareButtons.twitter);
    document.querySelector('.share-btn.linkedin').addEventListener('click', shareButtons.linkedin);
    document.querySelector('.share-btn.copy').addEventListener('click', shareButtons.copy);
}

// Back to blog navigation
function setupNavigation() {
    document.querySelector('.breadcrumb-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './blog.html';
    });
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.location.href = './blog.html';
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBlogPost();
    setupShareButtons();
    setupNavigation();
    setupKeyboardNavigation();

    // Scroll to top on load
    window.scrollTo(0, 0);
});
