import {Request, Response, Router} from 'express';
import {validator_cart} from "../utils/validators";
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
import Cart from "../config/models/cart.model";
import Product from "../config/models/product.model";

const router = Router();

//recupère les infos d'une commande en fonction de l'id d'une order
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const cartUser: Cart[] = await Cart.findAll({
            where: {userId: req.params.userId}
        });
        const poIds = [];
        for (let i = 0; i<cartUser.length; i++)
        {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails: Product[] = await Product.findAll({
            where: {productId: {
                    [Op.in]: poIds
                }}
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i<cartUser.length; i++)
        {
            for(let j = 0; j<productsDetails.length; j++)
            {
                if(cartUser[i].productId==productsDetails[j].productId)
                {
                    const dict1 = {
                        'id':productsDetails[j].productId,
                        'name':productsDetails[j].name,
                        'price':productsDetails[j].price,
                        'quantity':cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity*productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'cart detail': finalDetails,
            'total price': totalprice
        }
        //return !order ?
        //res.status(HTTP_NOT_FOUND).send({error: `order made by user with ID ${req.params.orderId} not found`});
        res.status(HTTP_OK).send(dict); // Correction: Remplacez Order par order
    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

router.post('/:userId',validator_cart, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_BAD_REQUEST).send({error: errors.array()});
        }
        const {productId, userId, quantity} = req.body;
        const newCart = {productId, userId, quantity};
        const createdCart: Cart = await Cart.create(newCart);


        const cartUser: Cart[] = await Cart.findAll({
            where: {userId: req.params.userId}
        });
        const poIds = [];
        for (let i = 0; i<cartUser.length; i++)
        {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails: Product[] = await Product.findAll({
            where: {productId: {
                    [Op.in]: poIds
                }}
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i<cartUser.length; i++)
        {
            for(let j = 0; j<productsDetails.length; j++)
            {
                if(cartUser[i].productId==productsDetails[j].productId)
                {
                    const dict1 = {
                        'id':productsDetails[j].productId,
                        'name':productsDetails[j].name,
                        'price':productsDetails[j].price,
                        'quantity':cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity*productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'cart detail': finalDetails,
            'total price': totalprice
        }
        //return !order ?
        //res.status(HTTP_NOT_FOUND).send({error: `order made by user with ID ${req.params.orderId} not found`});
        res.status(HTTP_OK).send(dict);

    } catch (error) {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});


router.delete('/:userId/item/:productId', async (req: Request, res: Response) => {
    try {
        const cart: Cart | null = await Cart.findOne({
            where: {
                productId: req.params.productId,
                userId: req.params.userId
            }
        });
        if (!cart) {
            return res.status(HTTP_NOT_FOUND).send({error: `cart not found for id: ${req.params.id}`});
        }
        await cart.destroy();

        const cartUser: Cart[] = await Cart.findAll({
            where: {userId: req.params.userId}
        });
        const poIds = [];
        for (let i = 0; i<cartUser.length; i++)
        {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails: Product[] = await Product.findAll({
            where: {productId: {
                    [Op.in]: poIds
                }}
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i<cartUser.length; i++)
        {
            for(let j = 0; j<productsDetails.length; j++)
            {
                if(cartUser[i].productId==productsDetails[j].productId)
                {
                    const dict1 = {
                        'id':productsDetails[j].productId,
                        'name':productsDetails[j].name,
                        'price':productsDetails[j].price,
                        'quantity':cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity*productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'user id' : req.params.userId,
            'cart detail': finalDetails,
            'total price': totalprice
        };
        res.status(HTTP_OK).send(dict);
    } catch (error)
    {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({error: error.message});
    }
});

export default router;