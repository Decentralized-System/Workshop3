"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
    static initModel(sequelize) {
        Product.init({
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: new sequelize_1.DataTypes.STRING(512),
                allowNull: false,
            },
            description: {
                type: new sequelize_1.DataTypes.STRING(512),
                allowNull: false,
            },
            category: {
                type: new sequelize_1.DataTypes.STRING(512),
                allowNull: false,
            },
            price: {
                type: new sequelize_1.DataTypes.NUMBER,
                allowNull: false,
            },
            quantity: {
                type: new sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            }
        }, { tableName: 'Product',
            sequelize,
            timestamps: false
        });
    }
}
exports.default = Product;
//# sourceMappingURL=product.model.js.map