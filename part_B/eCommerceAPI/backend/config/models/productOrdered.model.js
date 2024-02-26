"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const order_model_1 = require("./order.model");
const product_model_1 = require("./product.model");
class ProductOrdered extends sequelize_1.Model {
    static initModel(sequelize) {
        ProductOrdered.init({
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: product_model_1.default,
                    key: 'productId'
                }
            },
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: order_model_1.default,
                    key: 'orderId'
                }
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            }
        }, {
            tableName: 'ProductOrdered',
            sequelize: sequelize,
            timestamps: false
        });
    }
}
exports.default = ProductOrdered;
//# sourceMappingURL=productOrdered.model.js.map