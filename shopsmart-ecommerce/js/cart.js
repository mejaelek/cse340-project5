// ============================================
// CART PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeCart();
    setupCartEventListeners();
});

// ============================================
// CART INITIALIZATION
// ============================================

function initializeCart() {
    displayCartItems();
    updateCartSummary();
}

// ============================================
// DISPLAY CART ITEMS
// ============================================

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cart = window.shopSmart.getCart();

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    document.querySelector('.cart-summary').style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                ${getProductIcon(item.category)}
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-category">${item.category}</p>
                <p class="cart-item-price">${window.shopSmart.formatPrice(item.price)}</p>
                
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
            <div class="cart-item-total">
                <strong>${window.shopSmart.formatPrice(item.price * item.quantity)}</strong>
            </div>
        </div>
    `).join('');

    attachCartItemListeners();
}

// ============================================
// CART ITEM EVENT LISTENERS
// ============================================

function attachCartItemListeners() {
    // Increase quantity
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const cart = window.shopSmart.getCart();
            const item = cart.find(i => i.id === id);
            if (item) {
                window.shopSmart.updateQuantity(id, item.quantity + 1);
                displayCartItems();
                updateCartSummary();
            }
        });
    });

    // Decrease quantity
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const cart = window.shopSmart.getCart();
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                window.shopSmart.updateQuantity(id, item.quantity - 1);
                displayCartItems();
                updateCartSummary();
            }
        });
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            if (confirm('Are you sure you want to remove this item?')) {
                window.shopSmart.removeFromCart(id);
                displayCartItems();
                updateCartSummary();
                window.shopSmart.showNotification('Item removed from cart');
            }
        });
    });
}

// ============================================
// UPDATE CART SUMMARY
// ============================================

function updateCartSummary() {
    const cart = window.shopSmart.getCart();

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over R500
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + shipping + tax;

    // Update DOM
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = window.shopSmart.formatPrice(subtotal);
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'FREE' : window.shopSmart.formatPrice(shipping);
    }
    if (taxElement) taxElement.textContent = window.shopSmart.formatPrice(tax);
    if (totalElement) totalElement.textContent = window.shopSmart.formatPrice(total);
}

// ============================================
// CHECKOUT & PROMO CODE
// ============================================

function setupCartEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const cart = window.shopSmart.getCart();
            if (cart.length === 0) {
                window.shopSmart.showNotification('Your cart is empty!', 'error');
                return;
            }

            window.shopSmart.showNotification('Redirecting to checkout...', 'success');
            setTimeout(() => {
                // Here you would redirect to actual checkout page
                alert('Checkout functionality will be implemented here!');
            }, 1000);
        });
    }

    // Promo code
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function () {
            const promoInput = document.getElementById('promo-input');
            const code = promoInput.value.trim().toUpperCase();

            if (!code) {
                window.shopSmart.showNotification('Please enter a promo code', 'error');
                return;
            }

            // Example promo codes
            const validCodes = {
                'SAVE10': 0.10,
                'SAVE20': 0.20,
                'WELCOME': 0.15
            };

            if (validCodes[code]) {
                const discount = validCodes[code] * 100;
                window.shopSmart.showNotification(`Promo code applied! ${discount}% off`, 'success');
                promoInput.value = '';
                // Here you would apply the discount to the total
            } else {
                window.shopSmart.showNotification('Invalid promo code', 'error');
            }
        });
    }
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

// Clear cart function (can be called from console or by admin)
function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        window.shopSmart.saveCart([]);
        displayCartItems();
        updateCartSummary();
        window.shopSmart.showNotification('Cart cleared successfully');
    }
}

// Make clearCart available globally
window.clearCart = clearCart;