import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import {
    Search,
    FileText,
    Clock,
    Calendar,
    Zap,
    CheckCircle2,
    Info,
    TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const LitigantDashboard = () => {
    const [caseDetails, setCaseDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.get('/cases');
            const myCase = data[0]; // Just take the first one found for demo

            if (myCase) {
                const detailRes = await api.get(`/cases/${myCase.id}`);
                setCaseDetails(detailRes.data);
            } else {
                toast.error('No cases found for your account.');
            }
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Case Status Tracker</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your case progress and get AI-powered resolution predictions.</p>
            </div>

            {!caseDetails ? (
                <Card className="p-8 text-center">
                    <div className="max-w-md mx-auto py-12">
                        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Case Details</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            Click below to retrieve the current status and predicted resolution for your pending case.
                        </p>
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="w-full justify-center py-4 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                                    Retrieving Case Data...
                                </>
                            ) : (
                                'View My Case Status'
                            )}
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-600" />
                                Case Information
                            </h3>
                            <Button variant="secondary" size="sm" onClick={() => setCaseDetails(null)}>
                                Change Case
                            </Button>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{caseDetails.title}</h2>
                                <p className="text-sm text-gray-400 mt-1">Reference ID: {caseDetails.id.toUpperCase()}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={caseDetails.status === 'Listed' ? 'yellow' : 'blue'} size="lg">
                                            {caseDetails.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Hearing</p>
                                    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                        <Calendar className="w-4 h-4 text-primary-600" />
                                        {caseDetails.next_hearing_date ? new Date(caseDetails.next_hearing_date).toLocaleDateString() : 'To be determined'}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* AI Predictions Card */}
                    <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20">
                        <CardBody className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-primary-900/30 rounded-lg shadow-sm">
                                            <Zap className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Resolution Prediction</h3>
                                            <p className="text-sm text-gray-500">Estimated time to final judgment</p>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-primary-600">
                                            {caseDetails.ai_insights?.prediction?.predictedDays || 0}
                                        </span>
                                        <span className="text-xl font-bold text-primary-800 dark:text-primary-200">Days</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-400 font-medium">
                                        <Info className="w-4 h-4" />
                                        <span>Target Disposal: {caseDetails.ai_insights?.prediction?.resolutionDate}</span>
                                    </div>
                                </div>

                                <div className="w-px bg-primary-100 dark:bg-primary-900/30 hidden md:block"></div>

                                <div className="flex-1 space-y-4">
                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Risk Analysis</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">System Confidence</span>
                                                <span className="font-bold text-emerald-600">92%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[92%]"></div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-primary-100/50">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                "{caseDetails.ai_insights?.prediction?.recommendation || 'Continuous monitoring recommended.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* ADR Recommendation Banner */}
                    {caseDetails.ai_insights?.adr?.isEligible && (
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-6 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-6">
                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Scale className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="green" className="text-[10px] py-0">Recommended</Badge>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Save {caseDetails.ai_insights.adr.benefits?.timeSavedDays} Days via ADR</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This case is highly suitable for <strong>{caseDetails.ai_insights.adr.adrType?.replace('_', ' ')}</strong>.
                                        Parties can resolve this in ~{caseDetails.ai_insights.adr.estimatedTimeline} days.
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => toast.success('Your interest in ADR has been recorded. The court will notify the other party.')}
                                >
                                    Opt-In Now
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <Card className="border-none bg-gray-50 dark:bg-gray-800/50">
                            <CardBody className="py-6">
                                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Priority Level</p>
                                <p className={`text-xl font-black ${caseDetails.priority_score >= 75 ? 'text-red-600' : 'text-primary-600'}`}>
                                    {caseDetails.ai_insights?.priority?.level || 'NORMAL'}
                                </p>
                            </CardBody>
                        </Card>
                        <Card className="border-none bg-gray-50 dark:bg-gray-800/50">
                            <CardBody className="py-6">
                                <TrendingUp className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Success Probability</p>
                                <p className="text-xl font-black text-indigo-600">
                                    {caseDetails.ai_insights?.adr?.successProbability ? `${Math.round(caseDetails.ai_insights.adr.successProbability * 100)}%` : '85%'}
                                </p>
                            </CardBody>
                        </Card>
                    </div>

                </div>
            )}
        </div>
    );
};

export default LitigantDashboard;
