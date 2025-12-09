import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bot,
  ClipboardCheck,
  BrainCircuit,
  BarChart2,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, children, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === "/dashboard"}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-brand-purple/10 text-brand-purple"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )
    }
  >
    <Icon className="h-5 w-5" aria-hidden="true" />
    <span>{children}</span>
  </NavLink>
);

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-brand-offWhite flex">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-purple text-white rounded-md shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="h-8 w-8 bg-brand-purple rounded-lg flex items-center justify-center mr-2">
             <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">GeminiApp</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1" aria-label="Main Navigation">
          <NavItem to="/dashboard" icon={LayoutDashboard} onClick={closeSidebar}>Dashboard</NavItem>
          <NavItem to="/dashboard/assessments" icon={ClipboardCheck} onClick={closeSidebar}>Assessments</NavItem>
          <NavItem to="/dashboard/interview" icon={BrainCircuit} onClick={closeSidebar}>Interview Prep</NavItem>
          <NavItem to="/dashboard/analytics" icon={BarChart2} onClick={closeSidebar}>Analytics</NavItem>
          <NavItem to="/dashboard/chat" icon={Bot} onClick={closeSidebar}>AI Chat</NavItem>
          
          {user?.role === 'admin' && (
            <>
              <div className="pt-6 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider" id="admin-nav-heading">Admin</div>
              <div aria-labelledby="admin-nav-heading" role="group" className="space-y-1">
                <NavItem to="/dashboard/admin" icon={ShieldAlert} onClick={closeSidebar}>Admin Panel</NavItem>
                <NavItem to="/dashboard/admin/users" icon={UserIcon} onClick={closeSidebar}>Users</NavItem>
                <NavItem to="/dashboard/admin/questions" icon={ClipboardCheck} onClick={closeSidebar}>Questions</NavItem>
                <NavItem to="/dashboard/admin/settings" icon={Settings} onClick={closeSidebar}>System</NavItem>
              </div>
            </>
          )}

          <div className="pt-6 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider" id="user-nav-heading">User</div>
          <div aria-labelledby="user-nav-heading" role="group" className="space-y-1">
            <NavItem to="/dashboard/profile" icon={UserIcon} onClick={closeSidebar}>Profile</NavItem>
            <NavItem to="/dashboard/settings" icon={Settings} onClick={closeSidebar}>Settings</NavItem>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-white font-bold shadow-md" aria-hidden="true">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-9" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1"></div>
        </header>
        
        <div id="main-content" className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};