module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("todos", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        completeDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        priority: {
            type: Sequelize.ENUM('high', 'medium', 'low'),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('todo', 'inProgress', 'completed', 'canceled'),
            allowNull: false
        }
    });

    return Todo;
};
