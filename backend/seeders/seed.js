const { sequelize, User, Case, Hearing } = require('../models'); // Adjust path as needed
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { calculatePriority } = require('../services/aiPriority');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Clear DB
        console.log('Database synced.');

        // 1. Create Users (Registrar, Lawyer, Judge)
        const passwordHash = await bcrypt.hash('password123', 10);

        const registrar = await User.create({
            name: 'Registrar Admin',
            email: 'registrar@nyaysetu.com',
            password: passwordHash,
            role: 'registrar'
        });

        const admin = await User.create({
            name: 'Master Admin',
            email: 'admin@nyaysetu.com',
            password: passwordHash,
            role: 'admin'
        });

        const lawyer = await User.create({
            name: 'Advocate Verma',
            email: 'lawyer@nyaysetu.com',
            password: passwordHash,
            role: 'lawyer'
        });

        const judge = await User.create({
            name: 'Hon. Justice Sharma',
            email: 'judge@nyaysetu.com',
            password: passwordHash,
            role: 'judge'
        });

        const litigant = await User.create({
            name: 'Ramesh Kumar',
            email: 'litigant@nyaysetu.com',
            password: passwordHash,
            role: 'litigant'
        });

        console.log('Users created.');

        // 2. Create 50 Mock Lawyers
        const lawyers = [lawyer];
        for (let i = 1; i < 50; i++) {
            lawyers.push(await User.create({
                name: `Advocate ${i}`,
                email: `lawyer${i}@nyaysetu.com`,
                password: passwordHash,
                role: 'lawyer'
            }));
        }

        // 3. Create 500 Mock Cases
        const caseTypes = ['Criminal', 'Civil', 'Family', 'Bail', 'Property'];
        const statuses = ['Pending', 'Listed', 'Adjourned', 'Disposed'];

        const cases = [];
        for (let i = 0; i < 500; i++) {
            const type = caseTypes[Math.floor(Math.random() * caseTypes.length)];
            // Age: 0-5 (60%), 5-10 (25%), 10+ (15%)
            const rand = Math.random();
            let age_years = 0;
            if (rand < 0.6) age_years = Math.floor(Math.random() * 5);
            else if (rand < 0.85) age_years = Math.floor(Math.random() * 5) + 5;
            else age_years = Math.floor(Math.random() * 10) + 10;

            const filing_date = new Date();
            filing_date.setFullYear(filing_date.getFullYear() - age_years);

            const urgency_score = Math.floor(Math.random() * 10) + 1;
            const adjournment_count = Math.floor(Math.random() * 20);

            // Randomly assign social factors
            const has_senior_citizen = Math.random() < 0.15;
            const has_minor = Math.random() < 0.1;
            const health_emergency = Math.random() < 0.05;

            const priorityResult = calculatePriority({
                age_years,
                urgency_score,
                adjournment_count,
                has_senior_citizen,
                has_minor,
                health_emergency
            });

            const status = statuses[Math.floor(Math.random() * statuses.length)];

            cases.push({
                title: `Case ${i + 1} vs State`,
                type,
                filing_date,
                status,
                urgency_score,
                priority_score: priorityResult.score,
                adjournment_count,
                has_senior_citizen,
                has_minor,
                health_emergency,
                adr_eligible: ['Civil', 'Property', 'Contract', 'Family', 'Consumer', 'Motor Accident'].includes(type),
                lawyerId: lawyers[Math.floor(Math.random() * lawyers.length)].id,
                litigantId: litigant.id
            });
        }

        await Case.bulkCreate(cases);
        console.log('500 Cases created.');

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDatabase();
