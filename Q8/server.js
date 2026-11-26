const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3008;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.render("home", { title: "Home", message: "Welcome to the Express and EJS lab." }));
app.get("/about", (req, res) => res.render("page", { title: "About", message: "This page is served by an Express GET route." }));
app.get("/contact", (req, res) => res.render("contact", { title: "Contact", submitted: null }));
app.post("/contact", (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
  res.render("contact", { title: "Contact", submitted: name && message ? `Thanks, ${name}. Your message was received.` : "Please provide both your name and a message." });
});
app.get("/time", (req, res) => res.render("page", { title: "Server time", message: new Date().toLocaleString() }));
app.use((req, res) => res.status(404).render("page", { title: "Not found", message: "The requested page does not exist." }));

app.listen(port, () => console.log(`Q8 server listening at http://localhost:${port}`));
