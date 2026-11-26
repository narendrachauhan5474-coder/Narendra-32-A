# Q9 — RESTful product CRUD

```powershell
npm install
npm start
```

The in-memory API exposes `GET/POST /products` and `GET/PUT/DELETE /products/:id`. Data resets whenever the server restarts. Example:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3009/products -ContentType 'application/json' -Body '{"name":"Pen","price":2.5,"description":"Blue ink pen"}'
```
