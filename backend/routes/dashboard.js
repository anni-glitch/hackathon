const express = require('express');
const router = express.Router();
const { Case, Hearing, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/stats', auth(), async (req, res) => {
    try {
        const totalCases = await Case.count();
        const pendingCases = await Case.count({ where: { status: 'Pending' } });
        const disposedCases = await Case.count({ where: { status: 'Disposed' } });
        const urgentCases = await Case.count({ where: { priority_score: { [Op.gt]: 70 } } });

        const adrEligibleCases = await Case.count({ where: { adr_eligible: true, status: { [Op.ne]: 'Disposed' } } });

        const criticalCount = await Case.count({ where: { priority_score: { [Op.gte]: 75 }, status: { [Op.ne]: 'Disposed' } } });
        const highCount = await Case.count({ where: { priority_score: { [Op.between]: [50, 74.9] }, status: { [Op.ne]: 'Disposed' } } });
        const normalCount = await Case.count({ where: { priority_score: { [Op.lt]: 50 }, status: { [Op.ne]: 'Disposed' } } });

        res.json({
            totalCases,
            pendingCases,
            disposedCases,
            urgentCases,
            adrEligibleCases,
            priorityDistribution: {
                critical: criticalCount,
                high: highCount,
                normal: normalCount
            },
            backlogReduction: "12%",
            avgCaseAge: "4.2 Years"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
