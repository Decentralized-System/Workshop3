# B - E-commerce - Importance of redundancy

## Exercise - Simple e-commerce

```bash
npm init
npm install express
npm install sqlite3
```

We created a simple e-commerce API with some test endpoints and SQLite as a database.
We also made a Swagger documentation for the API, and we can access it at `http://localhost:3000/api-docs`.
It replaces the front-end part of the application since we can interact with the API directly.

## Observations

- The API is not reliable, and it's not ready for production.
- If our API stops working, we will lose all our clients/money and will be stuck with 500 errors.