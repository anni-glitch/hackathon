import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import api from '../utils/api';
import {
    Search, Filter, Brain, FileText,
    ChevronRight, AlertCircle, Info, RefreshCw
} from 'lucide-react';
import CaseDetailsModal from '../components/CaseDetailsModal';

import { toast } from 'react-hot-toast';

const RegistrarCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        minPriority: ''
    });

    const [selectedCase, setSelectedCase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCases = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                query: searchQuery,
                ...filters
            };
            const { data } = await api.get('/cases/search', { params });
            setCases(data);
        } catch (err) {
            console.error('Failed to fetch cases', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        const timer = setTimeout(fetchCases, 300);
        return () => clearTimeout(timer);
    }, [fetchCases]);

    const handleViewDetails = async (caseId) => {
        try {
            const { data } = await api.get(`/cases/${caseId}`);
            setSelectedCase(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch case details', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Inventory</h1>
                    <p className="text-sm text-gray-500">Manage {cases.length} cases with AI-assisted prioritization</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={fetchCases}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => toast.success('Electronic filing system is active. Standardized CSR form pending.')}>
                        <FileText className="w-4 h-4 mr-2" />
                        File New Case
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Case Title, ID or Descriptions..."
                                className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm appearance-none outline-none"
                                    value={filters.type}
                                    onChange={(e) => setFilters(v => ({ ...v, type: e.target.value }))}
                                >
                                    <option value="">All Types</option>
                                    <option value="Civil">Civil</option>
                                    <option value="Criminal">Criminal</option>
                                    <option value="Family">Family</option>
                                    <option value="Property">Property</option>
                                </select>
                            </div>
                            <div className="relative flex-1">
                                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm appearance-none outline-none"
                                    value={filters.minPriority}
                                    onChange={(e) => setFilters(v => ({ ...v, minPriority: e.target.value }))}
                                >
                                    <option value="">All Priority</option>
                                    <option value="75">Critical (75+)</option>
                                    <option value="50">High (50+)</option>
                                    <option value="0">Normal</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Cases Table/List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Processing legal inventory...</p>
                    </div>
                ) : cases.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full w-fit mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No cases found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your search query or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-6 py-4">Case Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">AI Priority</th>
                                    <th className="px-6 py-4">ADR Potential</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {cases.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">{c.type}</span>
                                                        <span className="text-[10px] text-gray-400">ID: {c.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={c.status === 'Disposed' ? 'green' : c.status === 'Listed' ? 'blue' : 'yellow'}>
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${c.priority_score >= 75 ? 'bg-red-500' : c.priority_score >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{Math.round(c.priority_score)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.adr_eligible ? (
                                                <Badge variant="green" className="flex w-fit items-center gap-1 py-0.5">
                                                    <Brain className="w-3 h-3" /> Recommended
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-gray-400">Not Eligible</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewDetails(c.id)}
                                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-sm group"
                                            >
                                                AI Insights
                                                <div className="p-1 rounded-lg group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-all">
                                                    <Brain className="w-4 h-4" />
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CaseDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                caseData={selectedCase}
            />
        </div>
    );
};

export default RegistrarCases;

