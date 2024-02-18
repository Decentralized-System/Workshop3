module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalPrice: DataTypes.FLOAT
    });

    Order.associate = models => {
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.belongsToMany(models.Product, { through: 'OrderProduct', foreignKey: 'orderId' });
    };

    return Order;
};