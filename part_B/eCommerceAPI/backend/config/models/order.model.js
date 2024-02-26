"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = require("./user.model");
class Order extends sequelize_1.Model {
    static initModel(sequelize) {
        Order.init({
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: user_model_1.default,
                    key: 'userId'
                },
            },
            totalPrice: {
                type: sequelize_1.DataTypes.NUMBER,
                allowNull: false,
            }
        }, {
            tableName: "Order",
            sequelize: sequelize,
            timestamps: false
        });
    }
}
exports.default = Order;
//# sourceMappingURL=order.model.js.map