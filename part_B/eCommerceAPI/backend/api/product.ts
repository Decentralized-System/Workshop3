import {Request, Response, Router} from 'express';
import {validator_product} from "../utils/validators";
import {validationResult} from "express-validator";
import {Op} from "sequelize";
import {
    HTTP_BAD_REQUEST,
    HTTP_CONFLICT,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UPDATED
} from "../utils/httpCode";
import User from '../config/models/user.model';
import Product from "../config/models/product.model";
import Cart from "../config/models/cart.model";
import productOrdered from "./productOrdered";
import ProductOrdered from "../config/models/productOrdered.model";



const router = Router();

//récupère la liste de tous les produits
router.get('', async (_req: Request, res: Response): Promise<void> => {
    try {
        const products: Product[] = await Product.findAll();
        res.status(HTTP_OK).send(products);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

//récupère les infos d'un produit selon son id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findByPk(req.params.id);
        return !product ?
            res.status(HTTP_NOT_FOUND).send({error: `product with ID ${req.params.id} not found`}) :
            res.status(HTTP_OK).send(product);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

router.post('',validator_product, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_BAD_REQUEST).send({error: errors.array()});
        }
        const {name, description, category, price, quantity} = req.body;

        const newProduct = {name, description, category, price, quantity};
        const createdProduct: Product = await Product.create(newProduct);
        res.status(HTTP_CREATED).send(createdProduct);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

router.put('/:id', validator_product, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_BAD_REQUEST).send({error: errors.array()});
        }

        const product: Product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(HTTP_NOT_FOUND).send({error: `Package not found for id: ${req.params.id}`});
        }

        const {name, description, category, price, quantity} = req.body;
        const updatedProduct = {name, description, category, price, quantity};
        await product.update(updatedProduct);
        res.status(HTTP_OK).send(updatedProduct);
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const product: Product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(HTTP_NOT_FOUND).send({error: `product not found for id: ${req.params.id}`});
        }

        await ProductOrdered.destroy({ where: { productId: req.params.id } });
        await Cart.destroy({ where: { productId: req.params.id } });

        await product.destroy();

        res.status(HTTP_OK).send({message: `Product deleted for id: ${req.params.id}`});

    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

export default router;