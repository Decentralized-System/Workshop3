import {DataTypes, Model, Sequelize} from 'sequelize';

class Product extends Model{
    public productId: number;
    public name: string;
    public description: string;
    public category: string;
    public price: number;
    public quantity: number;

    static initModel(sequelize: Sequelize){
        Product.init(
            {
                productId:{
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: new DataTypes.STRING(512),
                    allowNull: false,
                },
                description:{
                    type: new DataTypes.STRING(512),
                    allowNull: false,
                },
                category: {
                    type: new DataTypes.STRING(512),
                    allowNull: false,
                },
                price : {
                    type: new DataTypes.NUMBER,
                    allowNull: false,
                },
                quantity:{
                    type: new DataTypes.INTEGER,
                    allowNull: false,
                }
            },
            { tableName: 'Product',
                sequelize,
                timestamps: false
            }
        );
    }
}

export default Product;