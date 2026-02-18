/**
 * ML Prediction Service
 * 
 * Simulates machine learning models for:
 * 1. No-Show Prediction (Logistic Regression simulation)
 * 2. Delay Prediction (Random Forest simulation)
 */

class PredictionService {
    /**
     * Predict probability of lawyer no-show
     * Factors: Historical absence rate, recent no-shows, and travel distance to court.
     */
    predictNoShow(lawyerLogs, hearingData = {}) {
        const absenceRate = lawyerLogs.absenceRate || 0.1;
        const recentNoShows = lawyerLogs.recentNoShows || 0;

        // Simulate a weighted probability
        let z = -2.5 + (absenceRate * 5) + (recentNoShows * 1.5);

        // Apply sigmoid
        const probability = 1 / (1 + Math.exp(-z));

        return {
            probability: Math.round(probability * 100) / 100,
            riskLevel: probability > 0.6 ? 'HIGH' : probability > 0.3 ? 'MEDIUM' : 'LOW',
            recommendation: probability > 0.6 ? 'Suggest alternate counsel or virtual appearance' : 'Send automated reminder'
        };
    }

    /**
     * Predict case resolution duration
     * Uses case type baselines and complexity multipliers.
     */
    predictResolutionDays(caseData) {
        const baselines = {
            'Criminal': 730,
            'Civil': 365,
            'Family': 365,
            'Property': 545,
            'Bail': 30
        };

        const base = baselines[caseData.type] || 365;

        // Multipliers for complexity
        let multiplier = 1.0;
        if (caseData.adjournment_count > 5) multiplier += 0.2;
        if (caseData.urgency_score > 8) multiplier -= 0.1; // Targeted processing

        const predictedDays = base * multiplier;

        return {
            predictedDays: Math.round(predictedDays),
            resolutionDate: this.calculateTargetDate(predictedDays),
            delayRisk: predictedDays > base * 1.2 ? 'HIGH' : 'NORMAL'
        };
    }

    calculateTargetDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }
}

module.exports = new PredictionService();
