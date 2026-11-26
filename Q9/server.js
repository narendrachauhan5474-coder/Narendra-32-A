const express = require("express");
const { randomUUID } = require("crypto");

const app = express();
const port = process.env.PORT || 3009;
app.use(express.json());
let products = [
  { id: randomUUID(), name: "Notebook", price: 4.5, description: "A ruled paper notebook." },
  { id: randomUUID(), name: "Desk lamp", price: 24.99, description: "An adjustable LED desk lamp." }
];

function validateProduct(body) {
  body = body && typeof body === "object" ? body : {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = Number(body.price);
  if (!name || !description || !Number.isFinite(price) || price < 0) {
    return { error: "Provide a non-empty name and description and a non-negative numeric price." };
  }
  return { value: { name, price, description } };
}

app.get("/", (req, res) => res.type("text").send("Q9 Product REST API. Use /products (GET, POST) and /products/:id (GET, PUT, DELETE)."));
app.get("/products", (req, res) => res.json(products));
app.post("/products", (req, res) => {
  const result = validateProduct(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  const product = { id: randomUUID(), ...result.value };
  products.push(product);
  res.status(201).json(product);
});
app.get("/products/:id", (req, res) => {
  const product = products.find((entry) => entry.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json(product);
});
app.put("/products/:id", (req, res) => {
  const index = products.findIndex((entry) => entry.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Product not found." });
  const result = validateProduct(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  products[index] = { id: req.params.id, ...result.value };
  res.json(products[index]);
});
app.delete("/products/:id", (req, res) => {
  const index = products.findIndex((entry) => entry.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Product not found." });
  products.splice(index, 1);
  res.status(204).end();
});
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ error: "Invalid JSON request body." });
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => console.log(`Q9 API listening at http://localhost:${port}`));
