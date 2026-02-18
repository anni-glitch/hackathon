import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Scale } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
        } else {
            const role = result.user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'registrar') navigate('/registrar');
            else if (role === 'lawyer') navigate('/lawyer');
            else if (role === 'judge') navigate('/judge');
            else if (role === 'litigant') navigate('/litigant');
            else navigate('/');
        }
    };

    const setDemoCreds = (role) => {
        const creds = {
            admin: ['admin@nyaysetu.com', 'password123'],
            registrar: ['registrar@nyaysetu.com', 'password123'],
            lawyer: ['lawyer@nyaysetu.com', 'password123'],
            judge: ['judge@nyaysetu.com', 'password123'],
            litigant: ['litigant@nyaysetu.com', 'password123']
        };
        setEmail(creds[role][0]);
        setPassword(creds[role][1]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <Scale className="w-10 h-10 text-primary-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NyaySetu</h1>
                    </div>
                </div>

                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center underline decoration-primary-500/30 underline-offset-8">
                        Judicial Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full justify-center bg-primary-600 hover:bg-primary-700 h-12 text-sm font-bold uppercase tracking-widest transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign in'}
                        </Button>

                        <p className="text-center text-xs text-gray-500 mt-6">
                            New to the platform? <Link to="/signup" className="text-primary-600 font-bold hover:underline">Create an Account</Link>
                        </p>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] text-center text-gray-500 mb-4 dark:text-gray-400 font-bold uppercase tracking-widest">
                            Demo Credentials
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {['admin', 'registrar', 'lawyer', 'judge', 'litigant'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setDemoCreds(role)}
                                    className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group"
                                >
                                    <span className="font-bold block text-gray-900 dark:text-gray-100 capitalize group-hover:text-primary-600 transition-colors">{role}</span>
                                    <span className="text-[9px] text-gray-400 truncate block">
                                        {role === 'admin' ? 'admin@nyaysetu.com' : `${role}@nyaysetu.com`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
