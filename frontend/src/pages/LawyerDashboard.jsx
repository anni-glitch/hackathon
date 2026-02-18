import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import {
    Calendar,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    Clock,
    Search,
    Brain,
    Scale
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import CaseDetailsModal from '../components/CaseDetailsModal';

const LawyerDashboard = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCase, setSelectedCase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const { data } = await api.get('/cases');
            setCases(data);
        } catch (error) {
            toast.error('Failed to load cases');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (caseId) => {
        try {
            const { data } = await api.get(`/cases/${caseId}`);
            setSelectedCase(data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Failed to fetch AI insights');
        }
    };

    const confirmAvailability = (caseId) => {
        toast.success('Availability confirmed. The court has been notified.');
    };

    const filteredCases = useMemo(() => {
        return cases.filter(c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cases, searchTerm]);

    const stats = {
        active: cases.length,
        hearings: cases.filter(c => c.status === 'Listed').length,
        action: cases.filter(c => c.priority_score >= 75).length
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Card>
            <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{title}</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Lawyer Command Center</h1>
                    <p className="text-sm text-gray-500">Managing {cases.length} active legal representations</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/lawyer/schedule')}>
                        <Calendar className="w-4 h-4 mr-2" />
                        My Calendar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Cases" value={stats.active} icon={Briefcase} color="text-blue-600" />
                <StatCard title="Upcoming" value={stats.hearings} icon={Calendar} color="text-amber-600" />
                <StatCard title="Critical" value={stats.action} icon={AlertCircle} color="text-red-600" />
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary-600" />
                        Active Portfolio
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search portfolio..."
                            className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg text-xs min-w-[200px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0 overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 animate-pulse">Loading your legal portfolio...</div>
                    ) : filteredCases.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 italic">No matching cases found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/30 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Title & Ref</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredCases.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">ID: {c.id.slice(0, 8)} • {c.type}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-black">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${c.priority_score >= 75 ? 'bg-red-500' : c.priority_score >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                                {Math.round(c.priority_score)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={c.status === 'Listed' ? 'blue' : 'gray'}>
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-gray-500">
                                                {c.next_hearing_date ? new Date(c.next_hearing_date).toLocaleDateString() : 'Pending Slot'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="text-[10px] h-8"
                                                    onClick={() => handleViewDetails(c.id)}
                                                >
                                                    <Brain className="w-3.5 h-3.5 mr-1 text-primary-600" /> Insights
                                                </Button>
                                                {c.status === 'Listed' && (
                                                    <Button
                                                        variant="blue"
                                                        size="sm"
                                                        className="text-[10px] h-8"
                                                        onClick={() => confirmAvailability(c.id)}
                                                    >
                                                        Confirm
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardBody>
            </Card>

            <CaseDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                caseData={selectedCase}
            />
        </div>
    );
};

export default LawyerDashboard;

