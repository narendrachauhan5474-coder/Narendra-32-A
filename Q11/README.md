# Q11 — MongoDB product CRUD

Requires Node.js and a local MongoDB server or an authorized MongoDB connection string.

```powershell
npm install
Copy-Item .env.example .env
npm start
```

Set `MONGODB_URI` in `.env` before starting if MongoDB is not available at the local default URI. The REST API exposes `GET/POST /api/products` and `GET/PUT/DELETE /api/products/:id`. Never commit the `.env` file.
