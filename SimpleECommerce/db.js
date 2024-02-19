const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json'); // This will create a file named db.json
const db = low(adapter);

// Set some defaults
db.defaults({ products: [], orders: [], carts: {} }).write();

module.exports = db;
