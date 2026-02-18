import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    Shield,
    Scale,
    Briefcase,
    Gavel,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'litigant'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const roles = [
        { id: 'litigant', title: 'Litigant', icon: User, desc: 'Track your case & predictions' },
        { id: 'lawyer', title: 'Lawyer', icon: Briefcase, desc: 'Manage legal portfolio' },
        { id: 'judge', title: 'Judge', icon: Gavel, desc: 'Access judicial command center' },
        { id: 'registrar', title: 'Registrar', icon: Shield, desc: 'System & scheduling control' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);

        if (result.success) {
            toast.success(result.message);
            if (formData.role === 'litigant') {
                navigate('/login');
            } else {
                setSuccess(true);
            }
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Registration Under Review</h2>
                        <p className="text-sm text-gray-500">
                            Your account as a <strong>{formData.role.toUpperCase()}</strong> has been created. To maintain judicial integrity, officials must be verified by the Master Admin before gaining access.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/login')} className="w-full">
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Visual Side */}
                <div className="hidden lg:block space-y-8">
                    <div className="space-y-2">
                        <div className="h-1 w-12 bg-primary-600 rounded-full"></div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase leading-none tracking-tighter">
                            Join the Digital <br />Judicial Reform
                        </h1>
                        <p className="text-gray-500 text-lg">Secure, AI-powered court scheduling for a more efficient tomorrow.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <Scale className="w-6 h-6 text-primary-600 mb-2" />
                            <h4 className="font-bold text-sm">ADR Support</h4>
                            <p className="text-[10px] text-gray-500">Intelligent mediation matchmaking.</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <Gavel className="w-6 h-6 text-indigo-600 mb-2" />
                            <h4 className="font-bold text-sm">Case Timing</h4>
                            <p className="text-[10px] text-gray-500">M-L powered resolution dates.</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <Card className="border-none shadow-2xl p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">NS</div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">NyaySetu Signup</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Your Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r.id })}
                                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${formData.role === r.id
                                                    ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-600'
                                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg ${formData.role === r.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-400'}`}>
                                                <r.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className={`text-[11px] font-bold ${formData.role === r.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'}`}>{r.title}</p>
                                                <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{r.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm"
                                            placeholder="address@official.gov"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Security Code</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/20 uppercase tracking-widest font-black text-xs"
                            >
                                {loading ? 'Transmitting Data...' : 'Submit Registration'}
                            </Button>

                            <p className="text-center text-xs text-gray-500">
                                Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                            </p>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
