import userApi from '../api/user';
import orderApi from '../api/order';
import productApi from '../api/product';
import productOrderedApi from '../api/productOrdered';
import cartApi from '../api/cart';
import {Express} from 'express';
const setupRoutes = (app: Express): void => {
    app.use('/products', productApi);
    app.use('/cart', cartApi);
    app.use('/user', userApi);
    app.use('/orders', orderApi);
};

export default setupRoutes;