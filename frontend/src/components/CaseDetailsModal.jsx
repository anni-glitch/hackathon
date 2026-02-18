import React from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import {
    X, Brain, TrendingUp, AlertTriangle, Scale,
    Calendar, Clock, ShieldCheck, Info
} from 'lucide-react';

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
    if (!isOpen || !caseData) return null;

    const insights = caseData.ai_insights || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{caseData.title}</h2>
                            <p className="text-sm text-gray-500">Case ID: {caseData.id?.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Top Section: Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-primary-50/50 dark:bg-primary-900/10 border-none">
                            <CardBody className="py-4">
                                <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">AI Priority Score</p>
                                <p className="text-3xl font-black text-primary-700">{insights.priority?.score || 0}</p>
                                <Badge variant={insights.priority?.level === 'CRITICAL' ? 'red' : 'yellow'} className="mt-2 text-[10px]">
                                    {insights.priority?.level || 'NORMAL'}
                                </Badge>
                            </CardBody>
                        </Card>
                        <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-none">
                            <CardBody className="py-4">
                                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Predicted Resolution</p>
                                <p className="text-3xl font-black text-indigo-700">{insights.prediction?.predictedDays || 0}d</p>
                                <p className="text-[10px] text-indigo-500 mt-2 font-medium italic">Target: {insights.prediction?.resolutionDate}</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-none">
                            <CardBody className="py-4">
                                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">ADR Potential</p>
                                <p className="text-3xl font-black text-emerald-700">{insights.adr?.isEligible ? 'High' : 'N/A'}</p>
                                <p className="text-[10px] text-emerald-500 mt-2 font-medium italic">
                                    {insights.adr?.successProbability ? `${Math.round(insights.adr.successProbability * 100)}% Success Rate` : 'No recommendation'}
                                </p>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Priority Breakdown */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Scale className="w-5 h-5 text-primary-500" />
                                Priority Factors
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Case Age (40%)', val: insights.priority?.breakdown?.agePoints, max: 40, color: 'bg-blue-500' },
                                    { label: 'Legal Urgency (30%)', val: insights.priority?.breakdown?.urgencyPoints, max: 30, color: 'bg-red-500' },
                                    { label: 'Adjournments (30%)', val: insights.priority?.breakdown?.adjournmentPoints, max: 30, color: 'bg-orange-500' },
                                    { label: 'Vulnerability Bonus', val: insights.priority?.breakdown?.socialBonus, max: 30, color: 'bg-emerald-500' }
                                ].map(f => (
                                    <div key={f.label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500 font-medium">{f.label}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{f.val || 0} pts</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div className={`${f.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(f.val / f.max) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vulnerability Badges */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {caseData.has_senior_citizen && <Badge variant="blue" className="text-[10px]">Senior Citizen</Badge>}
                                {caseData.has_minor && <Badge variant="blue" className="text-[10px]">Minor Involved</Badge>}
                                {caseData.health_emergency && <Badge variant="red" className="text-[10px]">Health Emergency</Badge>}
                            </div>
                        </div>

                        {/* ADR Comparison */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                ADR Recommendation
                            </h3>
                            {insights.adr?.isEligible ? (
                                <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20">
                                    <div className="flex items-start gap-3 mb-4">
                                        <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-emerald-800 dark:text-emerald-400">Suitable for {insights.adr.adrType?.replace('_', ' ')}</p>
                                            <p className="text-sm text-emerald-600 mt-1">{insights.adr.benefits?.emotionalBenefit}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-lg text-center">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Time Saved</p>
                                            <p className="text-lg font-bold text-emerald-600">{insights.adr.benefits?.timeSavedDays} days</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-lg text-center">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Efficiency</p>
                                            <p className="text-lg font-bold text-emerald-600">{insights.adr.benefits?.timeSavedPercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                    <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">{insights.adr?.reason || 'No ADR assessment available for this case type.'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prediction Analysis */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <Clock className="w-4 h-4" />
                            Timeline Analysis
                        </h4>
                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>Today</span>
                                    <span>Resolution (Est.)</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full flex overflow-hidden">
                                    <div className="bg-indigo-500 w-1/4 h-full animate-pulse"></div>
                                    <div className="bg-gray-300 dark:bg-gray-700 flex-1 h-full"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 capitalize">Risk Level</p>
                                <p className={`font-bold ${insights.prediction?.delayRisk === 'HIGH' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {insights.prediction?.delayRisk || 'NORMAL'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button>Export AI Analysis</Button>
                </div>
            </div>
        </div>
    );
};

export default CaseDetailsModal;
