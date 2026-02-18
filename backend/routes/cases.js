const express = require('express');
const router = express.Router();
const { Case, User, Hearing } = require('../models');
const auth = require('../middleware/auth');
const { validateCase } = require('../middleware/validation');
const { calculatePriority } = require('../services/aiPriority');
const adrMatchmaker = require('../services/adrMatchmaker');
const predictionService = require('../services/prediction');
const blockchainService = require('../services/blockchain');

// Get all cases (with filters)
router.get('/', auth(), async (req, res) => {
    try {
        const filters = {};
        if (req.user.role === 'lawyer') {
            filters.lawyerId = req.user.id;
        } else if (req.user.role === 'litigant') {
            filters.litigantId = req.user.id;
        }

        const cases = await Case.findAll({
            where: filters,
            include: [
                { model: User, as: 'lawyer', attributes: ['name'] }
            ],
            order: [['priority_score', 'DESC']]
        });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const { Op } = require('sequelize');

// Power Search API
router.get('/search', auth(), async (req, res) => {
    try {
        const { query, type, status, minPriority, maxPriority, startDate, endDate } = req.query;

        const whereClause = {};

        // Text Search
        if (query) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } }
            ];
        }

        // Filters
        if (type) whereClause.type = type;
        if (status) whereClause.status = status;

        if (minPriority || maxPriority) {
            whereClause.priority_score = {
                [Op.and]: [
                    minPriority ? { [Op.gte]: minPriority } : {},
                    maxPriority ? { [Op.lte]: maxPriority } : {}
                ]
            };
        }

        if (startDate || endDate) {
            whereClause.createdAt = {
                [Op.and]: [
                    startDate ? { [Op.gte]: new Date(startDate) } : {},
                    endDate ? { [Op.lte]: new Date(endDate) } : {}
                ]
            };
        }

        // Role-based scoping
        if (req.user.role === 'lawyer') whereClause.lawyerId = req.user.id;
        if (req.user.role === 'litigant') whereClause.litigantId = req.user.id;

        const results = await Case.findAll({
            where: whereClause,
            include: [{ model: User, as: 'lawyer', attributes: ['name'] }],
            order: [['priority_score', 'DESC']]
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single case details (including AI insights)
router.get('/:id', auth(), async (req, res) => {
    try {
        const caseData = await Case.findByPk(req.params.id, {
            include: [{ model: Hearing, as: 'hearings' }]
        });
        if (!caseData) return res.status(404).json({ message: 'Case not found' });

        const caseJson = caseData.toJSON();

        // AI Insights
        const adrEvaluation = adrMatchmaker.evaluateEligibility(caseJson);
        const resolution = predictionService.predictResolutionDays(caseJson);
        const priority = calculatePriority(caseJson);

        res.json({
            ...caseJson,
            ai_insights: {
                adr: adrEvaluation,
                prediction: resolution,
                priority: priority
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new case (Registrar only)
router.post('/', auth(['registrar']), async (req, res) => {
    const { error } = validateCase(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        // Calculate Priority immediately
        const priorityResult = calculatePriority({
            ...req.body,
            age_years: 0,
            adjournment_count: 0
        });

        // Check ADR Eligibility
        const adrEval = adrMatchmaker.evaluateEligibility({
            ...req.body,
            type: req.body.type
        });

        const newCase = await Case.create({
            ...req.body,
            priority_score: priorityResult.score,
            status: 'Pending'
        });

        // Log to Blockchain
        await blockchainService.logAction('CASE_CREATED', req.user.id, {
            caseId: newCase.id,
            priority: priorityResult.level
        });

        res.status(201).json({
            ...newCase.toJSON(),
            ai_insights: {
                priority: priorityResult,
                adr: adrEval
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;


