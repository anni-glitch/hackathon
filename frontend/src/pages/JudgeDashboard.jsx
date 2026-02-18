import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import {
    Gavel,
    CheckCheck,
    Clock,
    BarChart3,
    Calendar,
    AlertCircle,
    TrendingUp,
    FileText,
    Brain,
    Scale,
    Activity
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import CaseDetailsModal from '../components/CaseDetailsModal';

const JudgeDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [urgentCases, setUrgentCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = async (caseId) => {
        try {
            const { data } = await api.get(`/cases/${caseId}`);
            setSelectedCase(data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Failed to retrieve case intelligence');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, casesRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/cases/search', { params: { minPriority: 75 } })
                ]);
                setStats(statsRes.data);
                setUrgentCases(casesRes.data.slice(0, 5));
            } catch (error) {
                toast.error('Failed to sync judicial telemetry');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
        <Card>
            <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
                        {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
                    </div>
                    {subtext && <p className="text-[10px] text-gray-400 mt-0.5">{subtext}</p>}
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Judicial Command Center</h1>
                    <p className="text-sm text-gray-500">AI-Assisted Case Performance & Analytics</p>
                </div>
                <Badge variant="blue" className="py-1 px-3">Session Live</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Cases Disposed"
                    value={stats?.disposedCases || 0}
                    subtext="Cumulative Total"
                    icon={Gavel}
                    trend="+12%"
                    colorClass="text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    title="Efficiency"
                    value={stats?.backlogReduction || '87%'}
                    subtext="AI Predicted"
                    icon={TrendingUp}
                    colorClass="text-green-600 dark:text-green-400"
                />
                <StatCard
                    title="Avg Case Age"
                    value={stats?.avgCaseAge || '4.2Y'}
                    subtext="Target: <3 Years"
                    icon={Clock}
                    colorClass="text-red-600 dark:text-red-400"
                />
                <StatCard
                    title="ADR Adoption"
                    value={stats?.adrEligibleCases || 0}
                    subtext="Pending Mediation"
                    icon={Scale}
                    colorClass="text-blue-600 dark:text-blue-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Urgent Matters Queue */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Critical Matters Queue
                        </h3>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/judge/cases')}
                        >
                            View All
                        </Button>
                    </CardHeader>
                    <CardBody className="p-0">
                        {loading ? (
                            <div className="p-12 text-center animate-pulse">Scanning docket...</div>
                        ) : urgentCases.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {urgentCases.map(c => (
                                    <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{c.title}</p>
                                                <p className="text-[10px] text-gray-500">{c.type} • Priority: {Math.round(c.priority_score)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="h-8 text-[10px]"
                                            onClick={() => handleViewDetails(c.id)}
                                        >
                                            Open Case
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-400">No critical backlog detected.</div>
                        )}
                    </CardBody>
                </Card>

                {/* AI Performance Card */}
                <Card>
                    <CardHeader>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-600" />
                            Judge Performance
                        </h3>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {[
                            { label: 'Disposal Rate', value: 85, color: 'bg-green-500' },
                            { label: 'ADR Success', value: 42, color: 'bg-blue-500' },
                            { label: 'Settlement Ratio', value: 65, color: 'bg-indigo-500' }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-gray-500 font-bold uppercase tracking-wider">{item.label}</span>
                                    <span className="font-black text-primary-600">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                                    <div
                                        className={`${item.color} h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100/50">
                            <div className="flex items-center gap-2 text-primary-700 font-bold text-xs mb-2">
                                <Brain className="w-4 h-4" />
                                <span>AI Workload Optimization</span>
                            </div>
                            <p className="text-[10px] text-primary-600 italic">
                                "Suggest shifting 3 property cases to mediation to increase disposal rate by 14%."
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <CaseDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                caseData={selectedCase}
            />
        </div>
    );
};

export default JudgeDashboard;

