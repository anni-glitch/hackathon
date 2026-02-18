import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
    Gavel, Clock, FileText,
    MoreVertical, CheckCircle,
    AlertCircle, Search, RefreshCw
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const JudgeDocket = () => {
    const [hearings, setHearings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocket = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/schedule');
            // Mock filter for "Today" (all for now)
            setHearings(data);
        } catch (err) {
            toast.error('Failed to sync today\'s docket');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocket();
    }, []);

    const markCompleted = (id) => {
        toast.success('Hearing session finalized. AI updating case status.');
        setHearings(prev => prev.filter(h => h.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Judicial Docket</h1>
                    <p className="text-sm text-gray-500">Scheduled proceedings for {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={fetchDocket}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Docket
                    </Button>
                </div>
            </div>

            {/* Docket Controls */}
            <Card>
                <CardBody className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find case in docket..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 text-xs font-bold uppercase text-gray-400">
                        <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg border border-primary-100 italic">Pre-Trial Sessions: 04</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 italic">Urgent: {hearings.filter(h => h.case?.priority_score >= 75).length}</span>
                    </div>
                </CardBody>
            </Card>

            {/* Docket List */}
            <Card className="overflow-hidden border-none shadow-sm">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 animate-pulse">Syncing with Master Calendar...</div>
                    ) : hearings.length === 0 ? (
                        <div className="p-12 text-center">
                            <Gavel className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">Your docket is clear for today.</p>
                            <p className="text-xs text-gray-400 mt-1">Check the Master Schedule for upcoming sessions.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Time Slot</th>
                                        <th className="px-6 py-4 text-left">Case Representation</th>
                                        <th className="px-6 py-4 text-center">Priority</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {hearings.filter(h =>
                                        h.case?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        h.caseId.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((h, i) => (
                                        <tr key={h.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center border border-primary-100">
                                                        <Clock className="w-4 h-4 text-primary-600" />
                                                        <span className="text-[10px] font-black text-primary-700 uppercase">{h.slot_time.split(' ')[0]}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">NYAY-S{i + 100}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">{h.slot_time.split(' ')[1]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{h.case?.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="gray" className="py-0 text-[9px] truncate max-w-[100px]">{h.case?.type}</Badge>
                                                        {h.case?.priority_score >= 75 && (
                                                            <span className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase italic">
                                                                <AlertCircle className="w-3 h-3" /> Critical Matter
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-[10px] shadow-sm ${h.case?.priority_score >= 75 ? 'bg-red-500 text-white' :
                                                    h.case?.priority_score >= 50 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {Math.round(h.case?.priority_score)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                        onClick={() => markCompleted(h.id)}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Complete
                                                    </Button>
                                                    <button
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400"
                                                        onClick={() => toast.success('Hearing record options: Archive, Transfer, or Adjourn.')}
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default JudgeDocket;

