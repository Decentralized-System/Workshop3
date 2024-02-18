module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    });

    Cart.associate = models => {
        Cart.belongsTo(models.User, { foreignKey: 'userId' });
        Cart.belongsToMany(models.Product, { through: 'CartItem', foreignKey: 'cartId' });
    };

    return Cart;
};