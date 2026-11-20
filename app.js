// app.js - IMA Store Storefront Logic

let allProducts = getProducts();
let currentCategory = "All";
let cart = JSON.parse(localStorage.getItem("ima_store_cart") || "[]");

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// Render Products
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const sortBy = sortSelect.value;

  let filtered = allProducts.filter((p) => {
    const matchesCat = currentCategory === "All" || p.category === currentCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (sortBy === "low") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "high") filtered.sort((a, b) => b.price - a.price);

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <p class="text-zinc-400 text-sm">No products found matching your search.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = filtered
    .map((p) => {
      const discount = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
      return `
      <div class="product-card bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between ${!p.inStock ? 'opacity-60' : ''}">
        <div class="relative aspect-[4/5] bg-zinc-950 overflow-hidden cursor-pointer" onclick="openProductModal(${p.id})">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover" />
          ${p.badge ? `<span class="absolute top-2.5 left-2.5 bg-[#D90429] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">${p.badge}</span>` : ""}
          ${discount > 0 ? `<span class="absolute top-2.5 right-2.5 bg-black/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">-${discount}%</span>` : ""}
          ${!p.inStock ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center"><span class="bg-zinc-900 border border-zinc-700 text-white text-xs font-bold px-3 py-1 rounded-full">OUT OF STOCK</span></div>` : ""}
        </div>

        <div class="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            <span class="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">${p.category}</span>
            <h3 onclick="openProductModal(${p.id})" class="font-bold text-xs sm:text-sm text-white mt-0.5 line-clamp-2 cursor-pointer hover:text-[#ff4d6d] transition">${p.name}</h3>
          </div>

          <div class="mt-3">
            <div class="flex items-baseline gap-2 mb-2.5">
              <span class="text-base sm:text-lg font-black text-white">₹${p.price}</span>
              ${p.oldPrice > p.price ? `<span class="text-xs text-zinc-500 line-through">₹${p.oldPrice}</span>` : ""}
            </div>

            <button onclick="openProductModal(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-full py-2 rounded-xl text-xs font-bold transition ${
        p.inStock
          ? "bg-zinc-800 hover:bg-[#D90429] text-white"
          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
      }">
              ${p.inStock ? "Select Size / Buy" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

// Category Tabs
document.querySelectorAll(".cat-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    filterByCategory(btn.dataset.cat);
  });
});

function filterByCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach((b) => {
    if (b.dataset.cat === cat) {
      b.className = "cat-btn active bg-[#D90429] text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap";
    } else {
      b.className = "cat-btn bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap";
    }
  });
  renderProducts();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

// Quick View Modal
let selectedSize = "";

function openProductModal(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  selectedSize = p.sizes && p.sizes.length ? p.sizes[0] : "Standard";
  const modal = document.getElementById("productModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <div class="grid sm:grid-cols-2">
      <div class="aspect-square sm:aspect-auto bg-zinc-900">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5 flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-[#ff4d6d] uppercase tracking-wider">${p.category}</span>
          <h3 class="text-lg font-black text-white mt-1">${p.name}</h3>
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-2xl font-black text-white">₹${p.price}</span>
            ${p.oldPrice > p.price ? `<span class="text-sm text-zinc-500 line-through">₹${p.oldPrice}</span>` : ""}
          </div>
          <p class="text-xs text-zinc-400 mt-3 leading-relaxed">${p.desc}</p>

          <div class="mt-4">
            <label class="block text-xs font-bold text-zinc-300 mb-2">Select Size / Variant:</label>
            <div class="flex flex-wrap gap-2" id="sizeOptions">
              ${p.sizes
                .map(
                  (s, idx) => `
                <button type="button" onclick="pickSize('${s}', this)" class="size-pill px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    idx === 0
                      ? "bg-[#D90429] border-[#D90429] text-white"
                      : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-white"
                  }">${s}</button>`
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-2">
          <button onclick="addToCart(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-full btn-brand text-white font-bold py-3 rounded-xl text-xs">
            <i class="fa-solid fa-bag-shopping mr-1"></i> Add to Cart
          </button>
          <button onclick="directWhatsAppOrder(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition">
            <i class="fa-brands fa-whatsapp mr-1"></i> Direct Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function pickSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll("#sizeOptions .size-pill").forEach((b) => {
    b.className = "size-pill px-3 py-1.5 rounded-lg text-xs font-bold border transition bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-white";
  });
  btn.className = "size-pill px-3 py-1.5 rounded-lg text-xs font-bold border transition bg-[#D90429] border-[#D90429] text-white";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Cart Management
function saveCart() {
  localStorage.setItem("ima_store_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  const existing = cart.find((c) => c.id === id && c.size === selectedSize);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      size: selectedSize,
      qty: 1
    });
  }

  saveCart();
  closeModal();
  showToast(`Added "${p.name}" (${selectedSize}) to Cart`);
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById("navCartCount").textContent = count;
  document.getElementById("mobileCartCount").textContent = count;
  document.getElementById("cartTotal").textContent = `₹${total}`;

  const container = document.getElementById("cartItems");
  const checkoutSection = document.getElementById("checkoutSection");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <i class="fa-solid fa-bag-shopping text-4xl text-zinc-700 mb-3"></i>
        <p class="text-sm text-zinc-400">Your cart is empty.</p>
        <button onclick="closeCart()" class="mt-4 text-xs font-bold text-[#ff4d6d] underline">Continue Shopping</button>
      </div>`;
    checkoutSection.classList.add("hidden");
    return;
  }

  checkoutSection.classList.remove("hidden");
  container.innerHTML = cart
    .map(
      (item, idx) => `
    <div class="flex gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl items-center">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover" />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-white truncate">${item.name}</h4>
        <p class="text-[11px] text-zinc-400">Size: <strong class="text-zinc-200">${item.size}</strong></p>
        <p class="text-xs font-black text-[#ff4d6d] mt-1">₹${item.price * item.qty}</p>
      </div>
      <div class="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1">
        <button onclick="updateQty(${idx}, -1)" class="text-zinc-400 hover:text-white text-xs font-bold px-1">-</button>
        <span class="text-xs font-bold text-white">${item.qty}</span>
        <button onclick="updateQty(${idx}, 1)" class="text-zinc-400 hover:text-white text-xs font-bold px-1">+</button>
      </div>
    </div>`
    )
    .join("");
}

function openCart() {
  document.getElementById("cartOverlay").classList.remove("hidden");
  document.getElementById("cartDrawer").classList.add("drawer-open");
}

function closeCart() {
  document.getElementById("cartOverlay").classList.add("hidden");
  document.getElementById("cartDrawer").classList.remove("drawer-open");
}

// Direct Single-Product WhatsApp Order
function directWhatsAppOrder(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  const msg = `Hi *IMA STORE*! 👋\nI want to order this item:\n\n• *Product:* ${p.name}\n• *Size/Variant:* ${selectedSize}\n• *Price:* ₹${p.price}\n\nPlease confirm availability for COD / Home Delivery.`;
  window.open(`https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

// Full Cart COD Checkout via WhatsApp
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const payMethod = document.querySelector('input[name="payMethod"]:checked').value;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let itemsText = cart
    .map((item, i) => `${i + 1}. *${item.name}* (${item.size}) x ${item.qty} = ₹${item.price * item.qty}`)
    .join("\n");

  const message =
    `🛍️ *NEW ORDER — IMA STORE*\n` +
    `--------------------------\n` +
    `${itemsText}\n` +
    `--------------------------\n` +
    `💰 *Total Amount:* ₹${total}\n` +
    `💳 *Payment:* ${payMethod}\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📍 *Address:* ${address}\n\n` +
    `Please confirm my order!`;

  window.open(`https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(message)}`, "_blank");
});

// Toast Helper
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2400);
}

// Init
renderProducts();
updateCartUI();
                            
