const sequelize = require('../config/database');
const User = require('./User');
const Case = require('./Case');
const Hearing = require('./Hearing');
const AuditLog = require('./AuditLog');

// Associations
User.hasMany(Case, { foreignKey: 'lawyerId', as: 'cases' });
Case.belongsTo(User, { foreignKey: 'lawyerId', as: 'lawyer' });

Case.hasMany(Hearing, { foreignKey: 'caseId', as: 'hearings' });
Hearing.belongsTo(Case, { foreignKey: 'caseId', as: 'case' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'logs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Litigant association (optional, can be linked to User)
User.hasMany(Case, { foreignKey: 'litigantId', as: 'litigantCases' });
Case.belongsTo(User, { foreignKey: 'litigantId', as: 'litigant' });

module.exports = {
    sequelize,
    User,
    Case,
    Hearing,
    AuditLog
};
