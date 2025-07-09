import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, BarChart3, Calendar, Settings, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ open = false, setOpen = () => {} }) => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:static md:inset-auto md:z-auto transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-r border-white/20 dark:border-slate-700/20 min-h-screen"
      )}
      style={{ pointerEvents: open || isDesktop ? 'auto' : 'none' }}
    >
      <div className="p-6 relative">
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Task App
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  open: false,
  setOpen: () => {},
};

export default Sidebar;
