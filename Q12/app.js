const initialProducts = [
  { id: "p1", name: "Linen market tote", description: "A sturdy everyday bag made for market runs and day trips.", price: 28 },
  { id: "p2", name: "Stoneware mug", description: "A hand-finished mug with a soft, speckled glaze.", price: 19 },
  { id: "p3", name: "Pocket notebook", description: "A compact recycled-paper notebook for ideas on the go.", price: 9.5 }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}
let products = readStorage("q12-products", initialProducts);
let cart = readStorage("q12-cart", []);
let orders = readStorage("q12-orders", []);
const productGrid = document.querySelector("#products");
const cartItems = document.querySelector("#cart-items");
const sellerProducts = document.querySelector("#seller-products");
const orderList = document.querySelector("#order-list");
const checkoutStatus = document.querySelector("#checkout-status");
const productForm = document.querySelector("#product-form");

function saveStorage() {
  localStorage.setItem("q12-products", JSON.stringify(products));
  localStorage.setItem("q12-cart", JSON.stringify(cart));
  localStorage.setItem("q12-orders", JSON.stringify(orders));
}
function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function renderProducts() {
  productGrid.replaceChildren();
  for (const product of products) {
    const card = makeElement("article", undefined, "product-card");
    card.append(makeElement("h3", product.name), makeElement("p", product.description));
    card.append(makeElement("p", `$${Number(product.price).toFixed(2)}`, "price"));
    const add = makeElement("button", "Add to cart");
    add.type = "button";
    add.addEventListener("click", () => {
      const item = cart.find((entry) => entry.id === product.id);
      if (item) item.quantity += 1;
      else cart.push({ id: product.id, quantity: 1 });
      saveStorage();
      renderCart();
    });
    card.append(add);
    productGrid.append(card);
  }
  renderSellerProducts();
}
function renderCart() {
  cartItems.replaceChildren();
  let total = 0;
  let count = 0;
  for (const item of cart) {
    const product = products.find((entry) => entry.id === item.id);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    total += product.price * item.quantity;
    count += item.quantity;
    const row = makeElement("div", undefined, "cart-row");
    row.append(makeElement("span", `${product.name} · $${Number(product.price).toFixed(2)}`));
    const controls = makeElement("div", undefined, "cart-controls");
    const minus = makeElement("button", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", `Remove one ${product.name}`);
    minus.addEventListener("click", () => {
      item.quantity -= 1;
      if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id);
      saveStorage();
      renderCart();
    });
    controls.append(minus, makeElement("span", String(item.quantity)), makeElement("span", `× $${Number(product.price * item.quantity).toFixed(2)}`));
    row.append(controls);
    cartItems.append(row);
  }
  if (count === 0) cartItems.append(makeElement("p", "Your cart is empty.", "muted"));
  document.querySelector("#cart-count").textContent = String(count);
  document.querySelector("#cart-total").textContent = `Total: $${total.toFixed(2)}`;
}
function renderOrders() {
  orderList.replaceChildren();
  if (!orders.length) {
    orderList.append(makeElement("p", "Your completed demo orders will appear here.", "muted"));
    return;
  }
  for (const order of [...orders].reverse()) {
    const card = makeElement("article", undefined, "order-card");
    card.append(makeElement("strong", `Order ${order.id}`), makeElement("p", `Placed by ${order.customer} · ${order.email}`));
    card.append(makeElement("p", order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")));
    card.append(makeElement("strong", `Paid (demo): $${Number(order.total).toFixed(2)}`));
    orderList.append(card);
  }
}
function renderSellerProducts() {
  sellerProducts.replaceChildren();
  for (const product of products) {
    const row = makeElement("div", undefined, "seller-row");
    row.append(makeElement("span", `${product.name} · $${Number(product.price).toFixed(2)}`));
    const actions = makeElement("div", undefined, "seller-actions");
    const edit = makeElement("button", "Edit", "secondary");
    edit.type = "button";
    edit.addEventListener("click", () => {
      productForm.elements.id.value = product.id;
      productForm.elements.name.value = product.name;
      productForm.elements.description.value = product.description;
      productForm.elements.price.value = product.price;
      document.querySelector("#product-form-title").textContent = "Edit product";
      document.querySelector("#cancel-edit").hidden = false;
      productForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const remove = makeElement("button", "Delete");
    remove.type = "button";
    remove.addEventListener("click", () => {
      products = products.filter((entry) => entry.id !== product.id);
      cart = cart.filter((entry) => entry.id !== product.id);
      saveStorage();
      renderProducts();
      renderCart();
    });
    actions.append(edit, remove);
    row.append(actions);
    sellerProducts.append(row);
  }
}
function resetProductForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  document.querySelector("#product-form-title").textContent = "Add a product";
  document.querySelector("#cancel-edit").hidden = true;
}

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.length) {
    checkoutStatus.textContent = "Add at least one product before checkout.";
    return;
  }
  const data = new FormData(event.currentTarget);
  const items = cart.map((entry) => {
    const product = products.find((item) => item.id === entry.id);
    return product ? { name: product.name, price: product.price, quantity: entry.quantity } : null;
  }).filter(Boolean);
  if (!items.length) {
    checkoutStatus.textContent = "Your cart no longer contains available products.";
    return;
  }
  const customer = String(data.get("customer")).trim();
  const email = String(data.get("email")).trim();
  if (!customer || !email) {
    checkoutStatus.textContent = "Please enter your name and email.";
    return;
  }
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = { id: `DEMO-${Date.now()}`, customer, email, items, total, createdAt: new Date().toISOString() };
  orders.push(order);
  cart = [];
  saveStorage();
  renderCart();
  renderOrders();
  event.currentTarget.reset();
  checkoutStatus.textContent = "Demo order placed successfully. No payment was processed.";
});
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const name = String(data.get("name")).trim();
  const description = String(data.get("description")).trim();
  const price = Number(data.get("price"));
  if (!name || !description || !Number.isFinite(price) || price <= 0) return;
  const id = String(data.get("id"));
  if (id) {
    products = products.map((product) => product.id === id ? { id, name, description, price } : product);
  } else {
    products.push({ id: `p-${Date.now()}`, name, description, price });
  }
  saveStorage();
  resetProductForm();
  renderProducts();
  renderCart();
});
document.querySelector("#cancel-edit").addEventListener("click", resetProductForm);
renderProducts();
renderCart();
renderOrders();
