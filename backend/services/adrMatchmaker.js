/**
 * ADR (Alternative Dispute Resolution) Matchmaking Service
 * 
 * Identifies cases eligible for mediation/arbitration
 * and calculates benefits of ADR vs traditional litigation.
 */

class ADRMatchmaker {
    // Case types eligible for ADR
    static ELIGIBLE_CASE_TYPES = [
        'Civil',
        'Family',
        'Property',
        'Contract',
        'Consumer',
        'Motor Accident'
    ];

    // Claim amount threshold for simplified ADR (5 Lakhs INR)
    static CLAIM_THRESHOLD = 500000;

    // ADR success rates by case type (Mock data based on industry averages)
    static SUCCESS_RATES = {
        'Civil': 0.72,
        'Property': 0.68,
        'Contract': 0.75,
        'Family': 0.65,
        'Consumer': 0.81,
        'Motor Accident': 0.85
    };

    // Average court timeline by case type (days)
    static COURT_TIMELINE = {
        'Civil': 730,
        'Property': 1095,
        'Contract': 545,
        'Family': 545,
        'Consumer': 365,
        'Motor Accident': 455
    };

    // ADR timeline (days)
    static ADR_TIMELINE = {
        'mediation': 45,
        'arbitration': 90,
        'lok_adalat': 30,
        'family_court_mediation': 60
    };

    /**
     * Evaluate ADR eligibility for a case
     */
    evaluateEligibility(caseData) {
        const eligibility = this.checkBasicEligibility(caseData);

        if (!eligibility.isEligible) {
            return {
                isEligible: false,
                reason: eligibility.reason
            };
        }

        const adrType = this.determineADRType(caseData);
        const benefits = this.calculateBenefits(caseData, adrType);

        return {
            isEligible: true,
            adrType,
            estimatedTimeline: this.ADR_TIMELINE[adrType],
            successProbability: this.SUCCESS_RATES[caseData.type] || 0.70,
            benefits
        };
    }

    /**
     * Check basic rules for ADR
     */
    checkBasicEligibility(caseData) {
        if (!ADRMatchmaker.ELIGIBLE_CASE_TYPES.includes(caseData.type)) {
            return {
                isEligible: false,
                reason: 'Criminal matters or specific case types are not suitable for ADR.'
            };
        }

        // In a real system, we'd check if parties have already opted out
        return { isEligible: true };
    }

    /**
     * Determine the best type of ADR for the case
     */
    determineADRType(caseData) {
        if (caseData.type === 'Family') return 'family_court_mediation';
        if (caseData.type === 'Motor Accident') return 'lok_adalat';

        // High value civil disputes might prefer arbitration
        if (caseData.claim_amount > ADRMatchmaker.CLAIM_THRESHOLD) {
            return 'arbitration';
        }

        return 'mediation';
    }

    /**
     * Calculate time and cost benefits
     */
    calculateBenefits(caseData, adrType) {
        const courtDays = ADRMatchmaker.COURT_TIMELINE[caseData.type] || 730;
        const adrDays = this.ADR_TIMELINE[adrType];

        return {
            courtTimelineDays: courtDays,
            adrTimelineDays: adrDays,
            timeSavedDays: courtDays - adrDays,
            timeSavedPercentage: Math.round(((courtDays - adrDays) / courtDays) * 100),
            emotionalBenefit: 'Reduced stress and confidential proceedings'
        };
    }
}

module.exports = new ADRMatchmaker();
