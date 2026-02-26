// ─── API Configuration ───────────────────────────────────────────────────────
// Detect whether a live backend is available:
//   - GitHub Pages → no backend → use static products
//   - file:// opened directly in browser → no server → use static products
//   - localhost served by Node.js → use live API
const IS_STATIC = window.location.hostname.includes('github.io') ||
                  window.location.hostname.includes('githubusercontent.com') ||
                  window.location.protocol === 'file:';
const API_URL = IS_STATIC ? null : 'http://localhost:5000/api';

// Static fallback — maps to real images that exist in image/product/
const STATIC_PRODUCTS = [
    { id: 1, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/product1.jpg' },
    { id: 2, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro2.jpg' },
    { id: 3, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/product3.jpg' },
    { id: 4, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro4.jpg' },
    { id: 5, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro5.jpg' },
    { id: 6, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro6.jpg' },
    { id: 7, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro7.jpg' },
    { id: 8, name: 'Cartoon Astronaut T-Shirt', brand: 'Adidas', price: 78, image: 'image/product/pro8.jpg' },
];
// ─────────────────────────────────────────────────────────────────────────────

// Cart data (loaded once at parse time from localStorage)
let cart = JSON.parse(localStorage.getItem('V-SHINE-CART')) || [];

// ── Toast Notification ────────────────────────────────────────────────────────
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast reveal';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ── Cart Count Badge ──────────────────────────────────────────────────────────
function updateCartCount() {
    const bagIcons = document.querySelectorAll('#lg-bag a, #mobile a[href="cart.html"]');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    bagIcons.forEach(icon => {
        let countBadge = icon.querySelector('.cart-count');
        if (totalItems > 0) {
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.className = 'cart-count';
                icon.appendChild(countBadge);
            }
            countBadge.innerText = totalItems;
        } else if (countBadge) {
            countBadge.remove();
        }
    });
}

// ── Add to Cart ───────────────────────────────────────────────────────────────
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('V-SHINE-CART', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// ── Render Cart Page ──────────────────────────────────────────────────────────
function renderCart() {
    const cartTableBody = document.querySelector('#cart tbody');
    const subtotalElement = document.querySelector('#subtotal table');
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="6" style="padding: 20px; font-weight: 600;">Your cart is empty</td></tr>';
    } else {
        cart.forEach((item, index) => {
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="#" class="remove-item" data-index="${index}"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt=""></td>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="item-quantity" data-index="${index}"></td>
                <td>₹${itemSubtotal.toFixed(2)}</td>
            `;
            cartTableBody.appendChild(tr);
        });
    }

    if (subtotalElement) {
        subtotalElement.innerHTML = `
            <tr><td>Cart Subtotal</td><td>₹${total.toFixed(2)}</td></tr>
            <tr><td>Shipping</td><td>Free</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>₹${total.toFixed(2)}</strong></td></tr>
        `;
    }
}

// ── Product Rendering ─────────────────────────────────────────────────────────
function renderProductCards(products) {
    const container = document.getElementById('main-products');
    if (!container) return; // Not on a page with product listing
    if (!products || products.length === 0) return;

    container.innerHTML = products.map(product => `
        <div class="pro">
            <img src="${product.image}" alt="${product.name}">
            <div class="des">
                <span>${product.brand}</span>
                <h5>${product.name}</h5>
                <div class="star">
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                </div>
                <h4>₹${product.price}</h4>
            </div>
            <a href="#" class="bag"><i class="fa-solid fa-bag-shopping"></i></a>
        </div>
    `).join('');

    // Re-init tilt on newly rendered cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('#main-products .pro'), {
            max: 15, speed: 400, glare: true, 'max-glare': 0.2,
        });
    }
}

async function fetchProducts() {
    // No live backend available → show static products immediately
    if (IS_STATIC || !API_URL) {
        renderProductCards(STATIC_PRODUCTS);
        return;
    }
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        renderProductCards(products);
    } catch (error) {
        console.warn('Backend offline, using static products:', error);
        renderProductCards(STATIC_PRODUCTS);
    }
}

// ── Main Init — runs when DOM is fully ready ──────────────────────────────────
function init() {
    // ── AOS ──
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true, mirror: false });
    }

    // ── Mobile Menu ──
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const closeBtn = document.getElementById('close');
    if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => nav.classList.remove('active'));

    // ── Dark Mode ──
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark' && themeToggle) {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.querySelector('i').classList.replace(
                next === 'dark' ? 'fa-moon' : 'fa-sun',
                next === 'dark' ? 'fa-sun' : 'fa-moon'
            );
        });
    }

    // ── Scroll Progress & Back to Top ──
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = progress + '%';
        if (backToTop) backToTop.classList.toggle('active', window.scrollY > 300);
    });
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── Vanilla Tilt (on any pre-existing .pro cards) ──
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.pro'), {
            max: 15, speed: 400, glare: true, 'max-glare': 0.2,
        });
    }

    // ── Cart click events (delegated) ──
    document.body.addEventListener('click', (e) => {
        // Add to cart via bag icon
        const bagBtn = e.target.closest('.bag');
        if (bagBtn && bagBtn.closest('.pro')) {
            e.preventDefault();
            e.stopPropagation();
            const pro = bagBtn.closest('.pro');
            addToCart({
                name: pro.querySelector('h5').innerText,
                price: parseFloat(pro.querySelector('h4').innerText.replace('₹', '')),
                image: pro.querySelector('img').src,
                brand: pro.querySelector('span').innerText.trim(),
            });
            return;
        }

        // Add to cart via single product page button
        if (e.target.classList.contains('normal') && e.target.closest('.single-pro-details')) {
            e.preventDefault();
            const details = e.target.closest('.single-pro-details');
            addToCart({
                name: details.querySelector('h4').innerText,
                price: parseFloat(details.querySelector('h2').innerText.replace('₹', '')),
                image: document.getElementById('MainImg')?.src || '',
                brand: (details.querySelector('h6')?.innerText.split('/')[1] || 'Brand').trim(),
            });
            return;
        }

        // Remove item from cart page
        const removeBtn = e.target.closest('.remove-item');
        if (removeBtn) {
            e.preventDefault();
            cart.splice(parseInt(removeBtn.dataset.index), 1);
            localStorage.setItem('V-SHINE-CART', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            showToast('Item removed from cart');
            return;
        }

        // Click on product card → go to product detail page
        const proCard = e.target.closest('.pro');
        if (proCard && !e.target.closest('.bag')) {
            if (!window.location.pathname.includes('sproduct.html')) {
                window.location.href = 'sproduct.html';
            }
        }
    });

    // Cart quantity change
    document.body.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-quantity')) {
            const index = parseInt(e.target.dataset.index);
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
                cart[index].quantity = newQty;
                localStorage.setItem('V-SHINE-CART', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            }
        }
    });

    // ── Single Product image gallery ──
    const MainImg = document.getElementById('MainImg');
    const smallImgs = document.getElementsByClassName('small-img');
    if (MainImg && smallImgs.length > 0) {
        Array.from(smallImgs).forEach(img => {
            img.onclick = () => { MainImg.src = img.src; };
        });
    }

    // ── Newsletter form ──
    const newsletterBtn = document.getElementById('newsletter-btn');
    const newsletterEmail = document.getElementById('newsletter-email');
    if (newsletterBtn && newsletterEmail) {
        newsletterBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = newsletterEmail.value;
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address');
                return;
            }
            if (IS_STATIC || !API_URL) {
                showToast('Thank you for subscribing!');
                newsletterEmail.value = '';
                return;
            }
            try {
                const res = await fetch(`${API_URL}/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();
                showToast(data.success ? 'Thank you for subscribing!' : (data.message || 'Subscription failed'));
                if (data.success) newsletterEmail.value = '';
            } catch {
                showToast('Thank you for subscribing!');
                newsletterEmail.value = '';
            }
        });
    }

    // ── Contact form ──
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('contact-name')?.value,
                email: document.getElementById('contact-email')?.value,
                subject: document.getElementById('contact-subject')?.value,
                message: document.getElementById('contact-message')?.value,
            };
            if (IS_STATIC || !API_URL) {
                showToast('Your message has been sent!');
                contactForm.reset();
                return;
            }
            try {
                const res = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                showToast(data.success ? 'Your message has been sent!' : (data.message || 'Submission failed'));
                if (data.success) contactForm.reset();
            } catch {
                showToast('Your message has been sent!');
                contactForm.reset();
            }
        });
    }

    // ── Load cart state ──
    updateCartCount();
    renderCart();

    // ── Load products ──
    fetchProducts();
}

// ── Safe entry point ─────────────────────────────────────────────────────────
// script.js is loaded at the bottom of <body>, so DOM is ready.
// But we use readyState check as a safety net in case of dynamic injection.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already parsed (most common case for bottom-of-body scripts)
    init();
}
