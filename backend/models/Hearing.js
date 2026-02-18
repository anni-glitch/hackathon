const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hearing = sequelize.define('Hearing', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    slot_time: {
        type: DataTypes.STRING, // e.g., "10:00 AM"
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Adjourned'),
        defaultValue: 'Scheduled'
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Hearing;
