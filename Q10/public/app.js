const products = document.querySelector("#products");
const status = document.querySelector("#status");
const form = document.querySelector("#product-form");

function render(items) {
  products.replaceChildren();
  for (const product of items) {
    const card = document.createElement("article");
    card.className = "product";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = `Price: $${Number(product.price).toFixed(2)}`;
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${product.rating} / 5`;
    const id = document.createElement("small");
    id.textContent = `ID: ${product.id}`;
    card.append(name, price, rating, id);
    products.append(card);
  }
}

async function loadProducts() {
  status.textContent = "Loading products…";
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error(`Could not load products (HTTP ${response.status}).`);
  render(await response.json());
  status.textContent = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  const data = new FormData(form);
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.get("name"), price: data.get("price"), rating: data.get("rating") })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Request failed (HTTP ${response.status}).`);
    form.reset();
    await loadProducts();
    status.textContent = "Product added.";
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Could not add product.";
  }
});

loadProducts().catch((error) => { status.textContent = error.message; });
