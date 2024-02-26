import {DataTypes, Model, Sequelize} from 'sequelize';

class User extends Model {
    public userId!: number;
    public name!: string;

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                }
            },
            {
                tableName: 'User',
                sequelize: sequelize, // this bit is important
                timestamps: false
            }
        );
    }
}

export default User;