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
const cart_model_1 = require("../config/models/cart.model");
const product_model_1 = require("../config/models/product.model");
const router = (0, express_1.Router)();
//recupère les infos d'une commande en fonction de l'id d'une order
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartUser = yield cart_model_1.default.findAll({
            where: { userId: req.params.userId }
        });
        const poIds = [];
        for (let i = 0; i < cartUser.length; i++) {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails = yield product_model_1.default.findAll({
            where: { productId: {
                    [sequelize_1.Op.in]: poIds
                } }
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i < cartUser.length; i++) {
            for (let j = 0; j < productsDetails.length; j++) {
                if (cartUser[i].productId == productsDetails[j].productId) {
                    const dict1 = {
                        'id': productsDetails[j].productId,
                        'name': productsDetails[j].name,
                        'price': productsDetails[j].price,
                        'quantity': cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity * productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'cart detail': finalDetails,
            'total price': totalprice
        };
        //return !order ?
        //res.status(HTTP_NOT_FOUND).send({error: `order made by user with ID ${req.params.orderId} not found`});
        res.status(httpCode_1.HTTP_OK).send(dict); // Correction: Remplacez Order par order
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.post('/:userId', validators_1.validator_cart, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(httpCode_1.HTTP_BAD_REQUEST).send({ error: errors.array() });
        }
        const { productId, userId, quantity } = req.body;
        const newCart = { productId, userId, quantity };
        const createdCart = yield cart_model_1.default.create(newCart);
        const cartUser = yield cart_model_1.default.findAll({
            where: { userId: req.params.userId }
        });
        const poIds = [];
        for (let i = 0; i < cartUser.length; i++) {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails = yield product_model_1.default.findAll({
            where: { productId: {
                    [sequelize_1.Op.in]: poIds
                } }
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i < cartUser.length; i++) {
            for (let j = 0; j < productsDetails.length; j++) {
                if (cartUser[i].productId == productsDetails[j].productId) {
                    const dict1 = {
                        'id': productsDetails[j].productId,
                        'name': productsDetails[j].name,
                        'price': productsDetails[j].price,
                        'quantity': cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity * productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'cart detail': finalDetails,
            'total price': totalprice
        };
        //return !order ?
        //res.status(HTTP_NOT_FOUND).send({error: `order made by user with ID ${req.params.orderId} not found`});
        res.status(httpCode_1.HTTP_OK).send(dict);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.delete('/:userId/item/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cart_model_1.default.findOne({
            where: {
                productId: req.params.productId,
                userId: req.params.userId
            }
        });
        if (!cart) {
            return res.status(httpCode_1.HTTP_NOT_FOUND).send({ error: `cart not found for id: ${req.params.id}` });
        }
        yield cart.destroy();
        const cartUser = yield cart_model_1.default.findAll({
            where: { userId: req.params.userId }
        });
        const poIds = [];
        for (let i = 0; i < cartUser.length; i++) {
            poIds.push(cartUser[i].productId);
        }
        const productsDetails = yield product_model_1.default.findAll({
            where: { productId: {
                    [sequelize_1.Op.in]: poIds
                } }
        });
        const finalDetails = [];
        var totalprice = 0;
        for (let i = 0; i < cartUser.length; i++) {
            for (let j = 0; j < productsDetails.length; j++) {
                if (cartUser[i].productId == productsDetails[j].productId) {
                    const dict1 = {
                        'id': productsDetails[j].productId,
                        'name': productsDetails[j].name,
                        'price': productsDetails[j].price,
                        'quantity': cartUser[i].quantity
                    };
                    totalprice = totalprice + cartUser[i].quantity * productsDetails[j].price;
                    finalDetails.push(dict1);
                }
            }
        }
        const dict = {
            'user id': req.params.userId,
            'cart detail': finalDetails,
            'total price': totalprice
        };
        res.status(httpCode_1.HTTP_OK).send(dict);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=cart.js.map