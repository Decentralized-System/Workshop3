import {DataTypes, Model, Sequelize} from 'sequelize';
import Order from './order.model';
import Product from "./product.model";

class ProductOrdered extends Model {
    public productId:number;
    public orderId: number;
    public quantity: number;

    static initModel(sequelize : Sequelize){
        ProductOrdered.init(
            {
                productId:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: Product,
                        key: 'productId'
                    }
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: Order,
                        key: 'orderId'
                    }
                },
                quantity:{
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            },{
                tableName : 'ProductOrdered',
                sequelize : sequelize,
                timestamps: false
            });
    }
}

export default ProductOrdered;