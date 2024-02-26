import {check} from 'express-validator';

export const validator_product = [
    check('name').if(check('name').exists()).isLength({min: 3}).isAlphanumeric('fr-FR'),
    check('description').if(check('description').exists()).isLength({min: 3}),
    check('category').if(check('category').exists()).isLength({min: 3}),
    check('price').if(check('price').exists()).isFloat({gt:0}),
    check('quantity').if(check('quantity').exists()).isInt({gt:0})
]

export const validator_order = [
    check('totalPrice').if(check('totalPrice').exists()).isFloat({gt:0})
]

export const validator_productOrdered = [
    check('quantity').if(check('quantity').exists()).isInt({gt:0})
]

export const validator_cart = [
    check('quantity').if(check('quantity').exists()).isInt({gt:0})
]