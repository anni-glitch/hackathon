/**
 * AI Priority Scoring Engine
 * 
 * Formula: (age_points + urgency_points + adjournment_points + social_multiplier)
 * Max score: 100
 */
const calculatePriority = (caseData) => {
    // 1. Age Factor (40% weight - Max 40 points)
    // 4 points per year, capped at 10 years (40 points)
    const ageYears = caseData.age_years || 0;
    const ageComponent = Math.min(ageYears * 4, 40);

    // 2. Urgency Factor (30% weight - Max 30 points)
    // Derived from explicit urgency score (1-10)
    const baseUrgency = caseData.urgency_score || 5;
    let urgencyComponent = baseUrgency * 3;

    // 3. Adjournment Factor (30% weight - Max 30 points)
    // 3 points per adjournment, capped at 10 (30 points)
    const adjournments = caseData.adjournment_count || 0;
    const adjournmentComponent = Math.min(adjournments * 3, 30);

    // 4. Social & Justice Multipliers (Bonus points for vulnerability)
    let socialBonus = 0;
    if (caseData.has_senior_citizen) socialBonus += 10;
    if (caseData.has_minor) socialBonus += 5;
    if (caseData.health_emergency) socialBonus += 15;

    const totalScore = ageComponent + urgencyComponent + adjournmentComponent + socialBonus;

    return {
        score: Math.min(Math.round(totalScore * 10) / 10, 100),
        level: totalScore >= 75 ? 'CRITICAL' : totalScore >= 50 ? 'HIGH' : 'NORMAL',
        breakdown: {
            agePoints: ageComponent,
            urgencyPoints: urgencyComponent,
            adjournmentPoints: adjournmentComponent,
            socialBonus
        }
    };
};

module.exports = { calculatePriority };

