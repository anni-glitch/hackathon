import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
    Users,
    ShieldCheck,
    XCircle,
    Clock,
    ShieldAlert,
    RefreshCw,
    Search,
    CheckCircle2
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/auth/admin/pending');
            setPendingUsers(data);
        } catch (err) {
            toast.error('Failed to sync verification queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerify = async (userId, status) => {
        try {
            await api.post('/auth/admin/verify', { userId, status });
            toast.success(`User has been ${status.toLowerCase()}`);
            fetchPending();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const filteredUsers = pendingUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Master Admin Portal</h1>
                    <p className="text-sm text-gray-500">System control and user verification queue</p>
                </div>
                <Button variant="secondary" onClick={fetchPending} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Queue
                </Button>
            </div>

            {/* Verification Queue */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 items-center justify-between border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                        Awaiting Verification ({pendingUsers.length})
                    </h3>
                    <div className="relative min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Filter by name or email..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 animate-pulse font-bold tracking-widest uppercase">
                            Scanning Judicial Registry...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-16 text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 italic">No pending registration requests found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Applicant Profile</th>
                                        <th className="px-6 py-4">Requested Role</th>
                                        <th className="px-6 py-4">Timestamp</th>
                                        <th className="px-6 py-4 text-right">Verification Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{u.name}</p>
                                                        <p className="text-[10px] text-gray-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={
                                                        u.role === 'judge' ? 'red' :
                                                            u.role === 'registrar' ? 'blue' :
                                                                u.role === 'lawyer' ? 'purple' : 'gray'
                                                    }
                                                    className="uppercase text-[9px]"
                                                >
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(u.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleVerify(u.id, 'APPROVED')}
                                                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm shadow-emerald-500/10"
                                                        title="Approve Applicant"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(u.id, 'BLOCKED')}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm shadow-red-500/10"
                                                        title="Reject & Block"
                                                    >
                                                        <XCircle className="w-4 h-4" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary-600 border-none">
                    <CardBody className="p-6 text-white space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 opacity-80" />
                            <h3 className="text-lg font-bold">Admin Privileges</h3>
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed">
                            As a Master Admin, you hold the authority to grant judicial access.
                            Approved officials will immediately gain access to their respective command centers
                            and AI-powered tools.
                        </p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Security Protocol</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gray-400" />
                                <p className="text-xs text-gray-500">Cross-reference Bar IDs before approving lawyers.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-4 h-4 text-gray-400" />
                                <p className="text-xs text-gray-500">Judges must be verified against official court postings.</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
