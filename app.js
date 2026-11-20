// app.js - IMA Store Editorial Storefront Logic

let allProducts = getProducts();
let currentCategory = "All";
let cart = JSON.parse(localStorage.getItem("ima_store_cart") || "[]");

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

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
      <div class="col-span-full text-center py-16 bg-neutral-50 rounded-2xl">
        <p class="text-neutral-500 text-sm">No items match your search.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = filtered
    .map((p) => {
      const discount = p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
      return `
      <article class="fashion-card group flex flex-col ${!p.inStock ? 'opacity-60' : ''}">
        <div onclick="openProductModal(${p.id})" class="relative aspect-[3/4] bg-[#f5f5f7] rounded-2xl overflow-hidden cursor-pointer">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover" />
          ${p.badge ? `<span class="absolute top-3 left-3 bg-white/95 text-black text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">${p.badge}</span>` : ""}
          ${discount > 0 ? `<span class="absolute top-3 right-3 bg-[#D90429] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-${discount}%</span>` : ""}
          ${!p.inStock ? `<div class="absolute inset-0 bg-white/60 flex items-center justify-center"><span class="bg-black text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full">SOLD OUT</span></div>` : ""}

          ${p.inStock ? `
          <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
            <span class="block w-full bg-white/95 hover:bg-black hover:text-white text-black text-center text-xs font-bold py-2.5 rounded-full shadow-md transition">
              Quick View & Size
            </span>
          </div>` : ""}
        </div>

        <div class="pt-3 flex flex-col flex-1 justify-between">
          <div>
            <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">${p.category}</p>
            <h3 onclick="openProductModal(${p.id})" class="font-bold text-xs sm:text-sm text-black mt-0.5 line-clamp-1 cursor-pointer hover:underline">${p.name}</h3>
          </div>
          <div class="flex items-center justify-between mt-1.5">
            <div class="flex items-baseline gap-2">
              <span class="text-sm sm:text-base font-extrabold text-black">₹${p.price}</span>
              ${p.oldPrice > p.price ? `<span class="text-xs text-neutral-400 line-through">₹${p.oldPrice}</span>` : ""}
            </div>
            <button onclick="openProductModal(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-black flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

document.querySelectorAll(".cat-btn").forEach((btn) => {
  btn.addEventListener("click", () => filterByCategory(btn.dataset.cat));
});

function filterByCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach((b) => {
    b.className =
      b.dataset.cat === cat
        ? "cat-btn bg-black text-white px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition"
        : "cat-btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition";
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
      <div class="aspect-[4/5] sm:aspect-auto bg-neutral-100">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
      </div>
      <div class="p-6 flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-[#D90429] uppercase tracking-widest">${p.category}</span>
          <h3 class="font-display text-xl font-extrabold text-black mt-1">${p.name}</h3>
          <div class="flex items-baseline gap-2.5 mt-2">
            <span class="text-2xl font-extrabold text-black">₹${p.price}</span>
            ${p.oldPrice > p.price ? `<span class="text-sm text-neutral-400 line-through">₹${p.oldPrice}</span>` : ""}
          </div>
          <p class="text-xs text-neutral-600 mt-3 leading-relaxed">${p.desc}</p>

          <div class="mt-5">
            <label class="block text-xs font-bold text-black mb-2">Select Size / Variant</label>
            <div class="flex flex-wrap gap-2" id="sizeOptions">
              ${p.sizes
                .map(
                  (s, idx) => `
                <button type="button" onclick="pickSize('${s}', this)" class="size-pill px-3.5 py-2 rounded-full text-xs font-bold border transition ${
                    idx === 0
                      ? "bg-black border-black text-white"
                      : "bg-white border-neutral-300 text-neutral-800 hover:border-black"
                  }">${s}</button>`
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-2.5">
          <button onclick="addToCart(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-full text-xs transition">
            Add to Bag — ₹${p.price}
          </button>
          <button onclick="directWhatsAppOrder(${p.id})" ${!p.inStock ? "disabled" : ""} class="w-full bg-neutral-100 hover:bg-emerald-600 hover:text-white text-black font-bold py-3 rounded-full text-xs transition flex items-center justify-center gap-2">
            <i class="fa-brands fa-whatsapp text-sm"></i> Instant Order on WhatsApp
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
    b.className = "size-pill px-3.5 py-2 rounded-full text-xs font-bold border transition bg-white border-neutral-300 text-neutral-800 hover:border-black";
  });
  btn.className = "size-pill px-3.5 py-2 rounded-full text-xs font-bold border transition bg-black border-black text-white";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Cart
function saveCart() {
  localStorage.setItem("ima_store_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  const existing = cart.find((c) => c.id === id && c.size === selectedSize);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, size: selectedSize, qty: 1 });

  saveCart();
  closeModal();
  showToast(`Added "${p.name}" (${selectedSize}) to bag`);
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
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
      <div class="text-center py-20">
        <i class="fa-solid fa-bag-shopping text-4xl text-neutral-300 mb-3"></i>
        <p class="text-sm font-medium text-neutral-500">Your shopping bag is empty.</p>
        <button onclick="closeCart()" class="mt-4 text-xs font-bold text-black underline">Explore Collection</button>
      </div>`;
    checkoutSection.classList.add("hidden");
    return;
  }

  checkoutSection.classList.remove("hidden");
  container.innerHTML = cart
    .map(
      (item, idx) => `
    <div class="flex gap-3.5 bg-neutral-50 border border-neutral-200/80 p-3 rounded-2xl items-center">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-20 rounded-xl object-cover bg-neutral-200" />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-black truncate">${item.name}</h4>
        <p class="text-[11px] text-neutral-500 mt-0.5">Size: <strong class="text-black">${item.size}</strong></p>
        <p class="text-xs font-extrabold text-black mt-1.5">₹${item.price * item.qty}</p>
      </div>
      <div class="flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-2.5 py-1">
        <button onclick="updateQty(${idx}, -1)" class="text-neutral-500 hover:text-black text-xs font-bold px-1">-</button>
        <span class="text-xs font-bold text-black">${item.qty}</span>
        <button onclick="updateQty(${idx}, 1)" class="text-neutral-500 hover:text-black text-xs font-bold px-1">+</button>
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

function directWhatsAppOrder(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  const msg = `Hi *IMA STORE*! 👋\nI want to order:\n\n• *Product:* ${p.name}\n• *Size/Variant:* ${selectedSize}\n• *Price:* ₹${p.price}\n\nPlease confirm availability for COD / Home Delivery.`;
  window.open(`https://wa.me/${STORE_CONFIG.phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

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

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2400);
}

renderProducts();
updateCartUI();
