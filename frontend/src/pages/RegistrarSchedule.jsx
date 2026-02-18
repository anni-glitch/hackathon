import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
    Calendar as CalendarIcon,
    Clock,
    Zap,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    Search
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const RegistrarSchedule = () => {
    const { user } = useAuth();
    const [hearings, setHearings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hearingsRes, dashboardRes] = await Promise.all([
                api.get('/schedule'),
                api.get('/dashboard/stats')
            ]);
            setHearings(hearingsRes.data);
            setPendingCount(dashboardRes.data.pendingCases || 0);
        } catch (err) {
            toast.error('Failed to sync court calendar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAutoSchedule = async () => {
        setIsScheduling(true);
        try {
            const { data } = await api.post('/schedule/auto-schedule');
            toast.success(data.message);
            fetchData();
        } catch (err) {
            toast.error('AI Auto-scheduling failed');
        } finally {
            setIsScheduling(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Schedule</h1>
                    <p className="text-sm text-gray-500">AI-Optimized hearing allocations</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Sync
                    </Button>
                    {user?.role === 'registrar' && (
                        <Button
                            onClick={handleAutoSchedule}
                            disabled={isScheduling || pendingCount === 0}
                            className="bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                        >
                            {isScheduling ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4 mr-2 fill-current" />
                            )}
                            Run AI Auto-Scheduler
                        </Button>
                    )}
                </div>
            </div>

            {user?.role === 'registrar' && pendingCount > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold">Unscheduled Backlog Detected</p>
                            <p className="text-xs opacity-80">There are {pendingCount} cases waiting for hearing allocations.</p>
                        </div>
                    </div>
                    <Badge variant="yellow" className="hidden sm:block">Action Required</Badge>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Upcoming Hearings */}
                <Card className="xl:col-span-3">
                    <CardHeader className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-primary-600" />
                            master_docket_2024.log
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Search className="w-3.5 h-3.5" /> Search Docket
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Case Details</th>
                                    <th className="px-6 py-4 text-center">Priority</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-400">Accessing calendar database...</td></tr>
                                ) : hearings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center">
                                            <CalendarIcon className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                            <p className="text-gray-500">No scheduled hearings found.</p>
                                            <p className="text-xs text-gray-400 mt-1">Run the auto-scheduler to allocate pending cases.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    hearings.map(h => (
                                        <tr key={h.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 dark:text-white text-sm">
                                                        {new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-primary-600 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {h.slot_time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{h.case?.title}</p>
                                                    <p className="text-[10px] text-gray-400">{h.case?.type} • ID: {h.caseId.slice(0, 8)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 font-black text-[10px] text-gray-600">
                                                    {Math.round(h.case?.priority_score)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="blue" className="text-[10px] py-0.5">
                                                    {h.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>

                {/* Scheduling Metadata */}
                <div className="space-y-6">
                    <Card className="bg-primary-600 border-none">
                        <CardBody className="p-6 text-white">
                            <h4 className="flex items-center gap-2 font-bold mb-4 opacity-90">
                                <Zap className="w-5 h-5 fill-current" />
                                AI Scheduler Logic
                            </h4>
                            <div className="space-y-4 text-xs opacity-90">
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5"></div>
                                    <p>Prioritizes cases based on <strong>social factors</strong> and <strong>adjournment history</strong>.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5"></div>
                                    <p>Predicts <strong>Lawyer Conflict</strong> risks before finalizing slot.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5"></div>
                                    <p>Optimizes court room usage by clustering similar case types.</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h4 className="font-bold text-sm">Schedule Health</h4>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase">
                                    <span>Conflict Risk</span>
                                    <span className="text-emerald-500">Low</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <div className="h-full bg-emerald-500 w-[15%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
                                <div className="flex items-center gap-2 text-primary-600 mb-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[11px] font-bold">Optimization Success</span>
                                </div>
                                <p className="text-[10px] text-gray-500">Master schedule meets 94% of priority constraints.</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RegistrarSchedule;

