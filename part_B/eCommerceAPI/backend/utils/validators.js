"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator_cart = exports.validator_productOrdered = exports.validator_order = exports.validator_product = void 0;
const express_validator_1 = require("express-validator");
exports.validator_product = [
    (0, express_validator_1.check)('name').if((0, express_validator_1.check)('name').exists()).isLength({ min: 3 }).isAlphanumeric('fr-FR'),
    (0, express_validator_1.check)('description').if((0, express_validator_1.check)('description').exists()).isLength({ min: 3 }),
    (0, express_validator_1.check)('category').if((0, express_validator_1.check)('category').exists()).isLength({ min: 3 }),
    (0, express_validator_1.check)('price').if((0, express_validator_1.check)('price').exists()).isFloat({ gt: 0 }),
    (0, express_validator_1.check)('quantity').if((0, express_validator_1.check)('quantity').exists()).isInt({ gt: 0 })
];
exports.validator_order = [
    (0, express_validator_1.check)('totalPrice').if((0, express_validator_1.check)('totalPrice').exists()).isFloat({ gt: 0 })
];
exports.validator_productOrdered = [
    (0, express_validator_1.check)('quantity').if((0, express_validator_1.check)('quantity').exists()).isInt({ gt: 0 })
];
exports.validator_cart = [
    (0, express_validator_1.check)('quantity').if((0, express_validator_1.check)('quantity').exists()).isInt({ gt: 0 })
];
//# sourceMappingURL=validators.js.map