"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = require("./user.model");
const product_model_1 = require("./product.model");
class Cart extends sequelize_1.Model {
    static initModel(sequelize) {
        Cart.init({
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: product_model_1.default,
                    key: 'productId'
                }
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: user_model_1.default,
                    key: 'userId'
                }
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            }
        }, {
            tableName: 'Cart',
            sequelize: sequelize,
            timestamps: false
        });
    }
}
exports.default = Cart;
//# sourceMappingURL=cart.model.js.map