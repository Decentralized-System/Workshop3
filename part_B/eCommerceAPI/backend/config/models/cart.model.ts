import {DataTypes, Model, Sequelize} from 'sequelize';
import User from './user.model';
import Product from "./product.model";

class Cart extends Model {
    public productId:number;
    public userId: number;
    public quantity: number;

    static initModel(sequelize : Sequelize){
        Cart.init(
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
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: User,
                    key: 'userId'
                }
            },
            quantity :{
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
                tableName : 'Cart',
                sequelize : sequelize,
                timestamps: false
            });
    }
}

export default Cart;