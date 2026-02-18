const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Case = sequelize.define('Case', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // Criminal, Civil, etc.
        allowNull: false
    },
    filing_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Listed', 'Adjourned', 'Disposed'),
        defaultValue: 'Pending'
    },
    urgency_score: {
        type: DataTypes.INTEGER, // 1-10
        defaultValue: 1
    },
    priority_score: {
        type: DataTypes.FLOAT, // 0-100 calculated
        defaultValue: 0
    },
    adjournment_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    next_hearing_date: {
        type: DataTypes.DATE
    },
    adr_eligible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    has_senior_citizen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    has_minor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    health_emergency: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Case;
