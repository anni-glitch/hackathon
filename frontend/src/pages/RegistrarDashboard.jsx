import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import {
    BarChart3,
    Cpu,
    Calendar,
    Users,
    AlertTriangle,
    CheckCircle2,
    TrendingDown,
    Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const RegistrarDashboard = () => {
    const [stats, setStats] = useState(null);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [recentHearings, setRecentHearings] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/dashboard/stats');
            setStats(data);
        } catch (error) {
            toast.error('Failed to fetch stats');
        }
    };

    const handleAutoSchedule = async () => {
        setScheduleLoading(true);
        const loadingToast = toast.loading('Running AI Auto-Scheduling...');
        try {
            const { data } = await api.post('/schedule/auto-schedule');
            toast.success(data.message, { id: loadingToast });
            setRecentHearings(data.hearings);
            fetchStats(); // Refresh stats
        } catch (error) {
            toast.error('Scheduling failed', { id: loadingToast });
        } finally {
            setScheduleLoading(false);
        }
    };

    const data = [
        { name: 'Pending', cases: stats?.pendingCases || 300 },
        { name: 'Disposed', cases: stats?.disposedCases || 150 },
        { name: 'Urgent', cases: stats?.urgentCases || 50 },
    ];

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderColor }) => (
        <Card className={`border-l-4 ${borderColor}`}>
            <CardBody>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                        {subtext && (
                            <p className={`text-xs mt-1 ${colorClass}`}>{subtext}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50`}>
                        <Icon className={`w-6 h-6 ${colorClass}`} />
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registrar Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monitor court metrics and manage auto-scheduling.</p>
                </div>
                <Button
                    onClick={handleAutoSchedule}
                    disabled={scheduleLoading}
                    className="flex items-center gap-2"
                >
                    <Cpu className={`w-4 h-4 ${scheduleLoading ? 'animate-spin' : ''}`} />
                    {scheduleLoading ? 'AI Scheduling...' : 'Run Auto-Schedule'}
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Cases"
                    value={stats?.totalCases || '...'}
                    icon={Users}
                    borderColor="border-blue-500"
                    colorClass="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title="ADR Eligible"
                    value={stats?.adrEligibleCases || '...'}
                    subtext="Recommended for Mediation"
                    icon={CheckCircle2}
                    borderColor="border-green-500"
                    colorClass="text-green-600 dark:text-green-400"
                />
                <StatCard
                    title="Critical Backlog"
                    value={stats?.priorityDistribution?.critical || '...'}
                    subtext="Priority Score > 75"
                    icon={AlertTriangle}
                    borderColor="border-red-500"
                    colorClass="text-red-600 dark:text-red-400"
                />
                <StatCard
                    title="Reduction Rate"
                    value={stats?.backlogReduction || '0%'}
                    subtext="Target: 40% reduction"
                    icon={TrendingDown}
                    borderColor="border-indigo-500"
                    colorClass="text-indigo-600 dark:text-indigo-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Priority Distribution Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-600" />
                            AI Priority Distribution
                        </h3>
                    </CardHeader>
                    <CardBody>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Critical', cases: stats?.priorityDistribution?.critical || 0, color: '#ef4444' },
                                        { name: 'High', cases: stats?.priorityDistribution?.high || 0, color: '#f59e0b' },
                                        { name: 'Normal', cases: stats?.priorityDistribution?.normal || 0, color: '#10b981' },
                                    ]}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="cases" radius={[4, 4, 0, 0]} barSize={40}>
                                        {
                                            [0, 1, 2].map((entry, index) => (
                                                <cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Recently Scheduled Feed */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            Recently Scheduled
                        </h3>
                    </CardHeader>
                    <CardBody className="p-0">
                        {recentHearings.length === 0 ? (
                            <div className="p-8 text-center">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Run auto-schedule to see allocations.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                                {recentHearings.map(hearing => (
                                    <div key={hearing.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">Case #{hearing.caseId.slice(0, 8)}</p>
                                            <Badge variant="green">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Scheduled
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(hearing.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {hearing.slot_time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default RegistrarDashboard;
