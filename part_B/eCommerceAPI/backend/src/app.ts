import { Express } from 'express';
import * as express from 'express';
import setupRoutes from '../config/routes';
import User from "../config/models/user.model";
import Product from "../config/models/product.model";
import Cart from "../config/models/cart.model";
import Order from "../config/models/order.model";
import ProductOrdered from "../config/models/productOrdered.model";
import { Sequelize } from 'sequelize';

var cors = require('cors')

const app: Express = express();
const PORT: string | 3000 = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));
const sequelize = new Sequelize('ecommerce', 'postgres', 'Password1*', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connecté à la base de données PostgreSQL avec succès.');

        // Initialiser les modèles et synchroniser la base de données uniquement si la connexion à la base de données est établie avec succès
        User.initModel(sequelize);
        Product.initModel(sequelize);
        Cart.initModel(sequelize);
        Order.initModel(sequelize);
        ProductOrdered.initModel(sequelize);

        await sequelize.sync();
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
        process.exit(1); // Arrêter le processus Node.js en cas d'erreur de connexion à la base de données
    }
})();

setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
