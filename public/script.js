// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Mobile Menu
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark' && themeToggle) {
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    });
}

// Scroll Progress & Back to Top Logic
const backToTop = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    // Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';

    // Back to Top Button
    if (window.scrollY > 300) {
        if (backToTop) backToTop.classList.add('active');
    } else {
        if (backToTop) backToTop.classList.remove('active');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Vanilla-Tilt (3D Effect on Product Cards)
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".pro"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });
}

// Cart Logic
let cart = JSON.parse(localStorage.getItem('V-SHINE-CART')) || [];

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

// Handle Click Events for Add to Cart and Product Redirection
document.body.addEventListener('click', (e) => {
    // 1. Bag icon on product cards (Add to Cart)
    const bagBtn = e.target.closest('.bag');
    if (bagBtn) {
        e.preventDefault();
        e.stopPropagation(); // Stop if there's a listener on the parent
        const proElement = bagBtn.closest('.pro');
        const product = {
            name: proElement.querySelector('h5').innerText,
            price: parseFloat(proElement.querySelector('h4').innerText.replace('₹', '')),
            image: proElement.querySelector('img').src,
            brand: proElement.querySelector('span').innerText
        };
        addToCart(product);
        return; // Exit after handling
    }
    
    // 2. Add to Cart button on sproduct.html (Main Button)
    if (e.target.classList.contains('normal') && e.target.closest('.single-pro-details')) {
        e.preventDefault();
        const details = e.target.closest('.single-pro-details');
        const product = {
            name: details.querySelector('h4').innerText,
            price: parseFloat(details.querySelector('h2').innerText.replace('₹', '')),
            image: document.getElementById('MainImg').src,
            brand: details.querySelector('h6').innerText.split('/')[1]?.trim() || 'Brand'
        };
        addToCart(product);
        return; // Exit after handling
    }

    // 3. Click on product card (Redirect to sproduct.html)
    const proCard = e.target.closest('.pro');
    if (proCard && !bagBtn) {
        // Only redirect if not on sproduct.html itself (optional, but good for consistency)
        if (!window.location.pathname.includes('sproduct.html')) {
            window.location.href = 'sproduct.html';
        }
    }
});

// Render Cart Items
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

    // Update Totals
    if (subtotalElement) {
        subtotalElement.innerHTML = `
            <tr>
                <td>Cart Subtotal</td>
                <td>₹${total.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td>Free</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>₹${total.toFixed(2)}</strong></td>
            </tr>
        `;
    }
}

// Global Event Listeners for Cart management
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

document.body.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn) {
        e.preventDefault();
        const index = parseInt(removeBtn.dataset.index);
        cart.splice(index, 1);
        localStorage.setItem('V-SHINE-CART', JSON.stringify(cart));
        renderCart();
        updateCartCount();
        showToast('Item removed from cart');
    }
});

// Product Fetching & Rendering
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const container = document.getElementById('main-products');
        if (container && products.length > 0) {
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
                
                // Re-initialize tilt if needed
                if (typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(document.querySelectorAll(".pro"), {
                        max: 15,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.2,
                    });
                }
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Sync Cart Count and Render on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    fetchProducts();
});

// Simulation: Toast Notification
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

// Single Product Page Logic
const MainImg = document.getElementById("MainImg");
const smallimg = document.getElementsByClassName("small-img");

if (MainImg && smallimg.length > 0) {
    Array.from(smallimg).forEach((img) => {
        img.onclick = function() {
            MainImg.src = img.src;
        }
    });
}
// Backend Integration
const API_URL = 'http://localhost:5000/api';

// Newsletter Form Submission
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

        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                showToast('Thank you for subscribing!');
                newsletterEmail.value = '';
            } else {
                showToast(data.message || 'Subscription failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Unable to connect to server');
        }
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });
            const data = await response.json();
            if (data.success) {
                showToast('Your message has been sent!');
                contactForm.reset();
            } else {
                showToast(data.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Unable to connect to server');
        }
    });
}
