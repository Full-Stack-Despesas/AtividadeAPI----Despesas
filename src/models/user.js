const { sequelize } = require('../database/db');
const { DataTypes } = require('sequelize');


const User = sequelize.define('user', {
    id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Formato de email inválido!"}
        }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {timestamps: true, underscored: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'user'})

// Nunca expor o hash da senha nas respostas JSON
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
};

module.exports = User;