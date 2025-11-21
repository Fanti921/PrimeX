// ===============================
// ELEMENTOS PRINCIPAIS
// ===============================
const darkToggle = document.getElementById('dark-toggle');
const body = document.body;

const cartBtn = document.getElementById('cart-btn');
const cart = document.getElementById('cart');
const closeCartBtn = document.getElementById('close-cart');

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');

const toast = document.getElementById('toast');

const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort');

// ===============================
// DARK MODE
// ===============================
darkToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
});

// ===============================
// CARRINHO
// ===============================
let cartItems = [];

cartBtn.addEventListener('click', () => {
  cart.classList.add('show');
});

closeCartBtn.addEventListener('click', () => {
  cart.classList.remove('show');
});

function formatPrice(price) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p>${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}</p>
      <button class="remove-btn">Remover</button>
    `;
    div.querySelector('.remove-btn').addEventListener('click', () => {
      removeFromCart(item.name);
    });
    cartItemsContainer.appendChild(div);
  });
  cartTotalEl.textContent = total.toFixed(2).replace('.', ',');
  cartCountEl.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

function addToCart(name, price) {
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cartItems.push({ name, price, quantity: 1 });
  }
  updateCart();
  showToast(`${name} adicionado ao carrinho!`);
}

function removeFromCart(name) {
  cartItems = cartItems.filter(item => item.name !== name);
  updateCart();
}

// ===============================
// BOTÕES ADICIONAR AO CARRINHO
// ===============================
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.dataset.price);
    addToCart(name, price);
  });
});

// ===============================
// CHECKOUT MODAL
// ===============================
checkoutBtn.addEventListener('click', () => {
  checkoutModal.classList.remove('hidden');
});

closeCheckout.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

document.getElementById('checkout-form').addEventListener('submit', (e) => {
  e.preventDefault();
  cartItems = [];
  updateCart();
  checkoutModal.classList.add('hidden');
  showToast('Compra finalizada com sucesso!');
});

// ===============================
// TOAST
// ===============================
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ===============================
// WISHLIST
// ===============================
const wishlists = document.querySelectorAll('.wishlist');
wishlists.forEach(w => {
  w.addEventListener('click', () => {
    w.classList.toggle('active');
  });
});

// ===============================
// FILTROS
// ===============================
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  let filtered = Array.from(productCards).filter(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    const cat = card.dataset.category;
    return name.includes(search) && (category === 'all' || cat === category);
  });

  if (sort === 'price-asc') {
    filtered.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  }

  const productList = document.querySelector('.product-list');
  productList.innerHTML = '';
  filtered.forEach(f => productList.appendChild(f));
}

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
sortSelect.addEventListener('change', filterProducts);
