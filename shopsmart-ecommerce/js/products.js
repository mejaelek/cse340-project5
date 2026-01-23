 // ============================================
// PRODUCTS DATA & FUNCTIONALITY
// ============================================

// Sample product data
const productsData = [
    { id: 1, name: 'Wireless Headphones', price: 899.99, category: 'electronics', featured: true },
    { id: 2, name: 'Smart Watch', price: 1299.99, category: 'electronics', featured: true },
    { id: 3, name: 'Laptop Stand', price: 349.99, category: 'electronics', featured: false },
    { id: 4, name: 'Bluetooth Speaker', price: 599.99, category: 'electronics', featured: true },
    { id: 5, name: 'Men T-Shirt', price: 199.99, category: 'clothing', featured: false },
    { id: 6, name: 'Women Dress', price: 499.99, category: 'clothing', featured: true },
    { id: 7, name: 'Running Shoes', price: 799.99, category: 'sports', featured: true },
    { id: 8, name: 'Yoga Mat', price: 249.99, category: 'sports', featured: false },
    { id: 9, name: 'Coffee Maker', price: 1499.99, category: 'home', featured: true },
    { id: 10, name: 'Table Lamp', price: 399.99, category: 'home', featured: false },
    { id: 11, name: 'Backpack', price: 549.99, category: 'clothing', featured: false },
    { id: 12, name: 'Water Bottle', price: 129.99, category: 'sports', featured: false }
];

let currentProducts = [...productsData];

// ============================================
// INITIALIZE PRODUCTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const featuredContainer = document.getElementById('featured-products');

    if (featuredContainer) {
        displayFeaturedProducts();
    }

    if (productsContainer) {
        displayProducts(currentProducts);
        setupFilters();
    }
});

// ============================================
// DISPLAY PRODUCTS
// ============================================

function displayProducts(products) {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    container.innerHTML = products.map(product => createProductCard(product)).join('');
    attachProductListeners();
}

function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featured = productsData.filter(p => p.featured).slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
    attachProductListeners();
}

// ============================================
// CREATE PRODUCT CARD
// ============================================

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${getProductIcon(product.category)}
            </div>
            <div class="product-info">
                <p class="product-category">${capitalizeFirst(product.category)}</p>
                <h3>${product.name}</h3>
                <p class="product-price">${window.shopSmart.formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary view-details-btn" data-id="${product.id}">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// PRODUCT EVENT LISTENERS
// ============================================

function attachProductListeners() {
    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            const product = productsData.find(p => p.id === productId);
            if (product) {
                window.shopSmart.addToCart(product);
            }
        });
    });

    // View Details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            viewProductDetails(productId);
        });
    });

    // Product card click
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            viewProductDetails(productId);
        });
    });
}

// ============================================
// FILTERS & SEARCH
// ============================================

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
}

function applyFilters() {
    let filtered = [...productsData];

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter.value);
    }

    // Search filter
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    // Sort
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        switch(sortFilter.value) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    currentProducts = filtered;
    displayProducts(filtered);
}

// ============================================
// PRODUCT DETAILS
// ============================================

function viewProductDetails(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modal = createProductModal(product);
    document.body.appendChild(modal);

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }

    // Add to cart from modal
    const addToCartBtn = modal.querySelector('.modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            window.shopSmart.addToCart(product);
            modal.remove();
        });
    }
}

function createProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="modal-image">
                    ${getProductIcon(product.category)}
                </div>
                <div class="modal-details">
                    <p class="modal-category">${capitalizeFirst(product.category)}</p>
                    <h2>${product.name}</h2>
                    <p class="modal-price">${window.shopSmart.formatPrice(product.price)}</p>
                    <p class="modal-description">
                        This is a high-quality ${product.name.toLowerCase()} from our ${product.category} collection. 
                        Perfect for your daily needs with premium features and excellent durability.
                    </p>
                    <div class="modal-features">
                        <h3>Features:</h3>
                        <ul>
                            <li>Premium quality materials</li>
                            <li>1-year warranty included</li>
                            <li>Free shipping on orders over R500</li>
                            <li>30-day return policy</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary modal-add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: white;
            border-radius: 10px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        .close-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 1;
        }
        .close-modal:hover {
            color: #333;
        }
        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 2rem;
            padding: 2rem;
        }
        .modal-image {
            width: 100%;
            height: 300px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            color: white;
        }
        .modal-category {
            color: #999;
            margin-bottom: 0.5rem;
        }
        .modal-details h2 {
            color: #333;
            margin-bottom: 1rem;
        }
        .modal-price {
            font-size: 2rem;
            color: #667eea;
            font-weight: bold;
            margin: 1rem 0;
        }
        .modal-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        .modal-features h3 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        .modal-features ul {
            color: #666;
            margin-bottom: 1.5rem;
        }
        .modal-features li {
            margin: 0.5rem 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    if (!document.querySelector('style[data-modal-styles]')) {
        style.setAttribute('data-modal-styles', 'true');
        document.head.appendChild(style);
    }

    return modal;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getProductIcon(category) {
    const icons = {
        'electronics': '📱',
        'clothing': '👕',
        'home': '🏠',
        'sports': '⚽',
        'books': '📚',
        'toys': '🧸'
    };
    return icons[category.toLowerCase()] || '📦';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make functions available globally if needed
window.productsModule = {
    displayProducts,
    applyFilters,
    viewProductDetails,
    productsData
};