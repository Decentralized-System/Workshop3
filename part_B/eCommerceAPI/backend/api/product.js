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
const httpCode_1 = require("../utils/httpCode");
const product_model_1 = require("../config/models/product.model");
const cart_model_1 = require("../config/models/cart.model");
const productOrdered_model_1 = require("../config/models/productOrdered.model");
const router = (0, express_1.Router)();
//récupère la liste de tous les produits
router.get('', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.findAll();
        res.status(httpCode_1.HTTP_OK).send(products);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
//récupère les infos d'un produit selon son id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findByPk(req.params.id);
        return !product ?
            res.status(httpCode_1.HTTP_NOT_FOUND).send({ error: `product with ID ${req.params.id} not found` }) :
            res.status(httpCode_1.HTTP_OK).send(product);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.post('', validators_1.validator_product, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(httpCode_1.HTTP_BAD_REQUEST).send({ error: errors.array() });
        }
        const { name, description, category, price, quantity } = req.body;
        const newProduct = { name, description, category, price, quantity };
        const createdProduct = yield product_model_1.default.create(newProduct);
        res.status(httpCode_1.HTTP_CREATED).send(createdProduct);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.put('/:id', validators_1.validator_product, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(httpCode_1.HTTP_BAD_REQUEST).send({ error: errors.array() });
        }
        const product = yield product_model_1.default.findByPk(req.params.id);
        if (!product) {
            return res.status(httpCode_1.HTTP_NOT_FOUND).send({ error: `Package not found for id: ${req.params.id}` });
        }
        const { name, description, category, price, quantity } = req.body;
        const updatedProduct = { name, description, category, price, quantity };
        yield product.update(updatedProduct);
        res.status(httpCode_1.HTTP_OK).send(updatedProduct);
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findByPk(req.params.id);
        if (!product) {
            return res.status(httpCode_1.HTTP_NOT_FOUND).send({ error: `product not found for id: ${req.params.id}` });
        }
        yield productOrdered_model_1.default.destroy({ where: { productId: req.params.id } });
        yield cart_model_1.default.destroy({ where: { productId: req.params.id } });
        yield product.destroy();
        res.status(httpCode_1.HTTP_OK).send({ message: `Product deleted for id: ${req.params.id}` });
    }
    catch (error) {
        res.status(httpCode_1.HTTP_INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=product.js.map