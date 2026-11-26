const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const port = process.env.PORT || 3010;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
let products = [
  { id: randomUUID(), name: "Canvas backpack", price: 39.99, rating: 4.7 },
  { id: randomUUID(), name: "Travel mug", price: 14.5, rating: 4.3 },
  { id: randomUUID(), name: "Wireless mouse", price: 22, rating: 4.5 }
];

app.get("/api/products", (req, res) => res.json(products));
app.post("/api/products", (req, res) => {
  const { name, price, rating } = req.body && typeof req.body === "object" ? req.body : {};
  const parsedPrice = Number(price);
  const parsedRating = Number(rating);
  if (typeof name !== "string" || !name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0 ||
      !Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
    return res.status(400).json({ error: "Provide a name, non-negative price, and rating from 0 to 5." });
  }
  const product = { id: randomUUID(), name: name.trim(), price: parsedPrice, rating: parsedRating };
  products.push(product);
  res.status(201).json(product);
});
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ error: "Invalid JSON request body." });
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => console.log(`Q10 app listening at http://localhost:${port}`));
