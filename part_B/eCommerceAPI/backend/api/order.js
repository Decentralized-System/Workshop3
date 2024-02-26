"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../utils/validators");
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const httpCode_1 = require("../utils/httpCode");
const product_model_1 = require("../config/models/product.model");
const order_model_1 = require("../config/models/order.model");
const productOrdered_model_1 = require("../config/models/productOrdered.model");
const cart_model_1 = require("../config/models/cart.model");
const router = (0, express_1.Router)();
//recupère les infos d'une commande en fonction de l'id d'une order
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.findAll({ where: { userId: req.params.userId } });
        //const productsOrdered: ProductOrdered[]=[];
        const AllOrders = [];
        for (let i = 0; i < orders.length; i++) {
            const productsOrdered = yield productOrdered_model_1.default.findAll({
                where: { orderId: orders[i].orderId }
            });
            const poIds = [];
            for (let i = 0; i < productsOrdered.length; i++) {
                poIds.push(productsOrdered[i].productId);
            }
            const productsDetails = yield product_model_1.default.findAll({
                where: {
                    productId: {
                        [sequelize_1.Op.in]: poIds
                    }
                }
            });
            const finalDetails = [];
            for (let i = 0; i < productsOrdered.length; i++) {
                for (let j = 0; j < productsDetails.length; j++) {
                    if (productsOrdered[i].productId == productsDetails[j].productId) {
                        const dict1 = {
                            'id': productsDetails[j].productId,
                            'name': productsDetails[j].name,
                            'price': productsDetails[j].price,
                            'quantity': productsOrdered[i].quantity
                        };
                        finalDetails.push(dict1);
                    }
                }
            }
            const dictOrder = {
                'orderId': orders[i].orderId,
                'total price': orders[i].totalPrice,
                'order detail': finalDetails
            };
            AllOrders.push(dictOrder);
        }
        const dictAllOrders = {
            'userId': req.params.userId,
            'all orders': AllOrders
        };
        res.status(httpCode_1.HTTP_OK).send(dictAllOrders);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.post('', validators_1.validator_order, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(httpCode_1.HTTP_BAD_REQUEST).send({ error: errors.array() });
        }
        const { userId } = req.body;
        const orderProducts = yield cart_model_1.default.findAll({
            where: { userId: userId }
        });
        var totalPrice = 0;
        for (let i = 0; i < orderProducts.length; i++) {
            const product = yield product_model_1.default.findByPk(orderProducts[i].productId);
            totalPrice = totalPrice + orderProducts[i].quantity * product.price;
        }
        const newOrder = { userId, totalPrice };
        const createdOrder = yield order_model_1.default.create(newOrder);
        for (let i = 0; i < orderProducts.length; i++) {
            const orderid = createdOrder.orderId;
            const productid = orderProducts[i].productId;
            const quantity = orderProducts[i].quantity;
            const newproductordered = { orderid, productid, quantity };
            const createdproductordered = yield productOrdered_model_1.default.create(newproductordered);
        }
        const order = yield order_model_1.default.findByPk(req.params.orderId);
        const productsOrdered = yield productOrdered_model_1.default.findAll({
            where: { orderId: req.params.orderId }
        });
        const poIds = [];
        for (let i = 0; i < productsOrdered.length; i++) {
            poIds.push(productsOrdered[i].productId);
        }
        const productsDetails = yield product_model_1.default.findAll({
            where: { productId: {
                    [sequelize_1.Op.in]: poIds
                } }
        });
        const finalDetails = [];
        for (let i = 0; i < productsOrdered.length; i++) {
            for (let j = 0; j < productsDetails.length; j++) {
                if (productsOrdered[i].productId == productsDetails[j].productId) {
                    const dict1 = {
                        'id': productsDetails[j].productId,
                        'name': productsDetails[j].name,
                        'price': productsDetails[j].price,
                        'quantity': productsOrdered[i].quantity
                    };
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'orderId': order.orderId,
            'total price': order.totalPrice,
            'order detail': finalDetails
        };
        //return !order ?
        //res.status(HTTP_NOT_FOUND).send({error: `order made by user with ID ${req.params.orderId} not found`});
        res.status(httpCode_1.HTTP_OK).send(dict);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=order.js.map