import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    Scale,
    Sun,
    Moon,
    Globe,
    Bell,
    LogOut,
    Menu,
    X,
    User,
    LayoutDashboard,
    FileText,
    Calendar,
    BarChart3,
    Gavel,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Layout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock language for now
    const language = 'en';
    const t = {
        appName: 'NyaySetu',
        dashboard: 'Dashboard',
        cases: 'Cases',
        schedule: 'Schedule',
        statistics: 'Statistics',
        logout: 'Logout',
        welcome: 'Welcome',
        switchLanguage: 'Switch Language',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { to: '/admin', icon: ShieldCheck, label: 'Admin Portal' },
                ];
            case 'registrar':
                return [
                    { to: '/registrar', icon: LayoutDashboard, label: t.dashboard },
                    { to: '/registrar/cases', icon: FileText, label: t.cases },
                    { to: '/registrar/schedule', icon: Calendar, label: t.schedule },
                    { to: '/registrar/analytics', icon: BarChart3, label: t.statistics },
                ];
            case 'lawyer':
                return [
                    { to: '/lawyer', icon: LayoutDashboard, label: t.dashboard },
                    { to: '/lawyer/cases', icon: FileText, label: t.cases },
                    { to: '/lawyer/schedule', icon: Calendar, label: t.schedule },
                ];
            case 'judge':
                return [
                    { to: '/judge', icon: LayoutDashboard, label: t.dashboard },
                    { to: '/judge/cases', icon: FileText, label: t.cases },
                    { to: '/judge/docket', icon: Gavel, label: 'Daily Docket' },
                ];
            case 'litigant':
                return [
                    { to: '/litigant', icon: LayoutDashboard, label: t.dashboard },
                    { to: '/litigant/cases', icon: FileText, label: t.cases },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Scale className="w-8 h-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{t.appName}</span>
                        </div>
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {getNavLinks().map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === `/${user?.role}`}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {user?.role || 'Role'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{t.logout}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between h-full px-4">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Title */}
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block">
                            {t.welcome}, {user?.name || 'User'}
                        </h1>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={t.switchLanguage}
                                onClick={() => toast.success('Language switching will be available in the next version.')}
                            >
                                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={theme === 'dark' ? t.lightMode : t.darkMode}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-gray-300" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            <button
                                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => toast.success('All judicial systems are operational. No new notices.')}
                            >
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
