import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { FileText, Search, Clock, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';
import CaseDetailsModal from '../components/CaseDetailsModal';

const GenericCases = ({ title = "Digital Case Files" }) => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCase, setSelectedCase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const { data } = await api.get('/cases');
                setCases(data);
            } catch (err) {
                toast.error('Failed to sync case data');
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const handleViewDetails = async (caseId) => {
        try {
            const { data } = await api.get(`/cases/${caseId}`);
            setSelectedCase(data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Failed to retreive case details');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{title}</h1>
                <div className="flex gap-2 text-xs font-black uppercase text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Total: {cases.length}</span>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 items-center justify-between border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary-600" />
                        Case Inventory
                    </h3>
                    <div className="relative min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search by ID or Title..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 animate-pulse">Retreiving records from blockchain vault...</div>
                    ) : cases.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 italic">No assigned cases discovered in digital records.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Case Details</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Urgency</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {cases.filter(c =>
                                        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        c.id.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{c.type} • Filed: {new Date(c.filing_date).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={c.status === 'Listed' ? 'blue' : 'gray'}>{c.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full max-w-[60px] bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                                                        <div
                                                            className={`h-full rounded-full ${c.priority_score > 70 ? 'bg-red-500' : 'bg-primary-500'}`}
                                                            style={{ width: `${c.priority_score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black">{Math.round(c.priority_score)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="text-[10px] h-8"
                                                    onClick={() => handleViewDetails(c.id)}
                                                >
                                                    View Records
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

export default GenericCases;


