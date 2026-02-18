const express = require('express');
const router = express.Router();
const { Case, Hearing, User, sequelize } = require('../models'); // Check User model import if needed
const auth = require('../middleware/auth');
const { predictNoShow } = require('../services/prediction');
const blockchainService = require('../services/blockchain');
const { Op } = require('sequelize');

// Get all hearings (Master Calendar)
router.get('/', auth(['registrar', 'judge', 'lawyer']), async (req, res) => {
    try {
        const hearings = await Hearing.findAll({
            include: [{
                model: Case,
                as: 'case',
                attributes: ['title', 'type', 'priority_score']
            }],
            order: [['date', 'ASC'], ['slot_time', 'ASC']]
        });
        res.json(hearings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Auto-schedule top N urgent cases
router.post('/auto-schedule', auth(['registrar']), async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // 1. Fetch top priority pending cases
        const urgentCases = await Case.findAll({
            where: { status: 'Pending' },
            order: [['priority_score', 'DESC']],
            limit: 50,
            include: [{ model: User, as: 'lawyer' }],
            transaction
        });

        const scheduledHearings = [];
        const logs = [];

        // Mock date generator (starting tomorrow)
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        let slots = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
        let slotIndex = 0;

        for (const caseData of urgentCases) {
            // 2. Check Lawyer Availability (Mock - Randomly check if they have a 'conflict')
            // In real world, query Hearing table for lawyerId conflict

            // prediction: Check risk of no-show
            const noShowRisk = predictNoShow({ past_absences: Math.floor(Math.random() * 5), total_hearings: 20 });

            if (noShowRisk > 0.8) {
                // High risk, maybe skip or flag?
                // For demo, we just schedule but mark a warning
            }

            const allocatedDate = new Date(currentDate);
            const allocatedSlot = slots[slotIndex];

            const hearing = await Hearing.create({
                caseId: caseData.id,
                date: allocatedDate,
                slot_time: allocatedSlot,
                status: 'Scheduled'
            }, { transaction });

            // Update Case Status
            await caseData.update({ status: 'Listed', next_hearing_date: allocatedDate }, { transaction });

            scheduledHearings.push(hearing);
            logs.push({ action: 'AUTO_SCHEDULE', caseId: caseData.id, slot: allocatedSlot });

            // Round robin slots
            slotIndex++;
            if (slotIndex >= slots.length) {
                slotIndex = 0;
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate.getDay() === 0) currentDate.setDate(currentDate.getDate() + 1); // Skip Sunday
            }
        }

        await transaction.commit();

        // Async log to blockchain
        logs.forEach(l => blockchainService.logAction(l.action, req.user.id, l));

        res.json({ message: `Successfully scheduled ${scheduledHearings.length} cases.`, hearings: scheduledHearings });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: err.message });
    }
});

// Lawyer confirm availability (simple toggle for demo)
router.post('/confirm-availability/:hearingId', auth(['lawyer']), async (req, res) => {
    // Logic to confirm
    res.json({ message: 'Availability confirmed.' });
});

module.exports = router;
