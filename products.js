// products.js - IMA Store Default Catalog & Storage Helper

const STORE_CONFIG = {
  name: "IMA STORE",
  handle: "ima_store_khurai",
  phone: "916009559821",
  displayPhone: "6009559821",
  address: "Khurai Sajor Leikai, Opp. Lamlong Oil Pump, Imphal, Manipur",
  hours: "Mon - Sun Open"
};

const DEFAULT_PRODUCTS = [
  {
    id: 101,
    name: "Premium Puffer Jacket",
    category: "Jackets",
    price: 1499,
    oldPrice: 2199,
    badge: "HOT",
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80",
    desc: "Heavyweight winter puffer jacket with warm insulated lining and sleek matte finish."
  },
  {
    id: 102,
    name: "China Bomber Jacket",
    category: "Jackets",
    price: 1350,
    oldPrice: 1899,
    badge: "NEW",
    sizes: ["M", "L", "XL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    desc: "Classic streetwear bomber jacket with ribbed cuffs and wind-resistant shell."
  },
  {
    id: 103,
    name: "All-Weather Hiking Jacket",
    category: "Jackets",
    price: 1650,
    oldPrice: 2299,
    badge: "NEW",
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    desc: "Best for hiking and riding. Water-repellent outer layer with secure zip pockets."
  },
  {
    id: 104,
    name: "Premium Boxy Double Zipper Hoodie",
    category: "Hoodies",
    price: 1199,
    oldPrice: 1699,
    badge: "TRENDING",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    desc: "Oversized boxy fit fleece hoodie with dual-way metal zipper for streetwear layering."
  },
  {
    id: 105,
    name: "Unisex Checkered Cardigan",
    category: "Hoodies",
    price: 999,
    oldPrice: 1450,
    badge: "SALE",
    sizes: ["M", "L", "XL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
    desc: "Soft knit checkered unisex cardigan. Perfect for casual winter outings."
  },
  {
    id: 106,
    name: "Cotton Waffle Henley Full-Sleeve",
    category: "Hoodies",
    price: 699,
    oldPrice: 999,
    badge: "SALE",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
    desc: "Breathable cotton waffle-knit texture with button placket. Everyday essential."
  },
  {
    id: 107,
    name: "Men's Steel Luxury Watch",
    category: "Watches",
    price: 899,
    oldPrice: 1499,
    badge: "NEW",
    sizes: ["Silver Dial", "Black Dial", "Blue Dial"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    desc: "Stainless steel strap with precision quartz movement and premium gift box."
  },
  {
    id: 108,
    name: "Ladies Watch Collection (BOGO)",
    category: "Watches",
    price: 799,
    oldPrice: 1598,
    badge: "BOGO",
    sizes: ["Gold", "Rose Gold", "Silver"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    desc: "Buy 1 Get 1 Special Offer! Elegant metallic finish watches for daily & party wear."
  },
  {
    id: 109,
    name: "Baggy Striped Track Pants",
    category: "Bottoms",
    price: 849,
    oldPrice: 1299,
    badge: "HOT",
    sizes: ["28", "30", "32", "34", "36"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80",
    desc: "Relaxed wide-leg streetwear track pants with side stripes and elastic waistband."
  },
  {
    id: 110,
    name: "Classic Comfort Kroks (Clogs)",
    category: "Kroks",
    price: 749,
    oldPrice: 1199,
    badge: "BESTSELLER",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80",
    desc: "Lightweight, waterproof, ultra-soft clogs available in multiple streetwear colors."
  }
];

function getProducts() {
  const saved = localStorage.getItem("ima_store_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...DEFAULT_PRODUCTS];
    }
  }
  localStorage.setItem("ima_store_products", JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProducts(products) {
  localStorage.setItem("ima_store_products", JSON.stringify(products));
}
