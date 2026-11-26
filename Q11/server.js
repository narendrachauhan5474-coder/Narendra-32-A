require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = Number(process.env.PORT) || 3011;
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });
const Product = mongoose.model("Product", productSchema);

function validId(id) {
  return mongoose.isValidObjectId(id);
}
function productInput(body) {
  body = body && typeof body === "object" ? body : {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = Number(body.price);
  return name && description && Number.isFinite(price) && price >= 0 ? { name, price, description } : null;
}

app.get("/api/products", async (req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});
app.post("/api/products", async (req, res, next) => {
  const input = productInput(req.body);
  if (!input) return res.status(400).json({ error: "Provide a name, description, and non-negative numeric price." });
  try { res.status(201).json(await Product.create(input)); } catch (error) { next(error); }
});
app.get("/api/products/:id", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid product id." });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (error) { next(error); }
});
app.put("/api/products/:id", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid product id." });
  const input = productInput(req.body);
  if (!input) return res.status(400).json({ error: "Provide a name, description, and non-negative numeric price." });
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (error) { next(error); }
});
app.delete("/api/products/:id", async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid product id." });
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.status(204).end();
  } catch (error) { next(error); }
});
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ error: "Invalid JSON request body." });
  if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/q11_products")
  .then(() => app.listen(port, () => console.log(`Q11 API listening at http://localhost:${port}`)))
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exitCode = 1;
  });
