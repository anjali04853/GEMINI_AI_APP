import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ShieldAlert,
  Search,
  Bell,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
  isAdmin?: boolean;
}

const NavItem = ({ to, icon: Icon, children, onClick, isCollapsed, isAdmin }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === "/dashboard" || to === "/dashboard/admin"}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
        isAdmin 
          ? (isActive 
              ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 border-l-4 border-brand-pink pl-2" 
              : "text-slate-400 hover:bg-white/5 hover:text-white")
          : (isActive
              ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 border-l-4 border-brand-pink pl-2"
              : "text-slate-600 hover:bg-brand-lavender hover:text-brand-purple")
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon 
          className={cn(
            "h-5 w-5 transition-colors flex-shrink-0", 
            isActive ? "text-white animate-pulse-glow" : (isAdmin ? "text-slate-500 group-hover:text-white" : "text-slate-500 group-hover:text-brand-purple")
          )} 
          aria-hidden="true" 
        />
        {!isCollapsed && <span className="truncate">{children}</span>}
        {isCollapsed && (
            <div className={cn(
              "absolute left-14 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap",
              isAdmin ? "bg-white text-slate-900" : "bg-slate-900 text-white"
            )}>
                {children}
            </div>
        )}
      </>
    )}
  </NavLink>
);

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={cn("min-h-screen flex font-sans", isAdminRoute ? "bg-brand-charcoal" : "bg-brand-offWhite")}>
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:flex lg:flex-col shadow-xl lg:shadow-none border-r",
        isAdminRoute ? "bg-brand-darkCharcoal border-slate-700" : "bg-gradient-to-b from-brand-offWhite to-brand-lavender border-slate-200",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn("h-16 flex items-center px-4 border-b relative", isAdminRoute ? "border-slate-700" : "border-slate-100/50")}>
          <div className="flex items-center space-x-2 w-full overflow-hidden">
             <div className="h-8 w-8 bg-gradient-to-br from-brand-purple to-brand-pink rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="h-5 w-5 text-white" />
             </div>
             {!isSidebarCollapsed && (
                <span className={cn("text-xl font-bold tracking-tight animate-in fade-in duration-300 whitespace-nowrap", isAdminRoute ? "text-white" : "text-slate-900")}>
                   Gemini<span className="text-brand-purple">App</span>
                </span>
             )}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className={cn("ml-auto lg:hidden p-1 rounded hover:bg-opacity-10", isAdminRoute ? "text-slate-400 hover:bg-white" : "text-slate-500 hover:bg-slate-100")}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Collapse Button (Desktop) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-brand-turquoise text-white rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
             <ChevronLeft className={cn("h-4 w-4 transition-transform", isSidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1" aria-label="Main Navigation">
          <NavItem to="/dashboard" icon={LayoutDashboard} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Dashboard</NavItem>
          <NavItem to="/dashboard/assessments" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Assessments</NavItem>
          <NavItem to="/dashboard/interview" icon={BrainCircuit} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Interview Prep</NavItem>
          <NavItem to="/dashboard/analytics" icon={BarChart2} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Analytics</NavItem>
          <NavItem to="/dashboard/chat" icon={Bot} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>AI Chat</NavItem>
          
          {user?.role === 'admin' && (
            <>
              <div className={cn("pt-6 pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-opacity", isAdminRoute ? "text-slate-500" : "text-slate-400", isSidebarCollapsed && "opacity-0")}>
                 Admin
              </div>
              <div role="group" className="space-y-1">
                <NavItem to="/dashboard/admin" icon={ShieldAlert} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Admin Panel</NavItem>
                <NavItem to="/dashboard/admin/users" icon={UserIcon} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Users</NavItem>
                <NavItem to="/dashboard/admin/questions" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Questions</NavItem>
                <NavItem to="/dashboard/admin/datasets" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Datasets</NavItem>
                <NavItem to="/dashboard/admin/settings" icon={Settings} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>System</NavItem>
              </div>
            </>
          )}

          <div className={cn("pt-6 pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-opacity", isAdminRoute ? "text-slate-500" : "text-slate-400", isSidebarCollapsed && "opacity-0")}>
             User
          </div>
          <div role="group" className="space-y-1">
            <NavItem to="/dashboard/profile" icon={UserIcon} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Profile</NavItem>
            <NavItem to="/dashboard/settings" icon={Settings} onClick={closeSidebar} isCollapsed={isSidebarCollapsed} isAdmin={isAdminRoute}>Settings</NavItem>
          </div>
        </nav>

        <div className={cn("p-4 border-t", isAdminRoute ? "border-slate-700 bg-black/20" : "border-slate-100 bg-white/50 backdrop-blur-sm")}>
          {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-4 px-1 overflow-hidden">
                    <div className="relative flex-shrink-0">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-white font-bold shadow-md p-[2px]">
                             <div className="h-full w-full rounded-full bg-slate-900/10 flex items-center justify-center">
                                 {user?.name.charAt(0)}
                             </div>
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-brand-turquoise border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isAdminRoute ? "text-white" : "text-slate-900")}>{user?.name}</p>
                    <p className={cn("text-xs truncate", isAdminRoute ? "text-slate-400" : "text-slate-500")}>{user?.email}</p>
                    </div>
                </div>
                <Button 
                  variant="ghost" 
                  className={cn("w-full justify-start h-9", isAdminRoute ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" : "text-red-600 hover:text-red-700 hover:bg-red-50")}
                  onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
              </>
          ) : (
              <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform" title={user?.name}>
                     {user?.name.charAt(0)}
                     <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-brand-turquoise border-2 border-white rounded-full"></span>
                  </div>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                      <LogOut className="h-5 w-5" />
                  </button>
              </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-0 relative transition-all duration-300">
        <header className={cn(
          "h-16 shadow-sm border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all duration-300",
          isAdminRoute ? "bg-brand-darkCharcoal border-slate-700" : "bg-white border-slate-100"
        )}>
          <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={cn(
                  "lg:hidden p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple mr-4",
                  isAdminRoute ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                )}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={cn("h-4 w-4 transition-colors", isAdminRoute ? "text-slate-500 group-focus-within:text-brand-purple" : "text-slate-400 group-focus-within:text-brand-purple")} />
                  </div>
                  <input 
                      type="text"
                      placeholder="Search..." 
                      className={cn(
                        "pl-10 pr-4 py-2 w-64 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-purple/50 focus:w-80 transition-all duration-300",
                        isAdminRoute ? "bg-brand-charcoal text-white placeholder:text-slate-500 focus:bg-slate-800" : "bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                      )}
                  />
              </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
              <button className={cn("p-2 rounded-full relative transition-colors", isAdminRoute ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100")}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 bg-brand-pink rounded-full border border-white"></span>
              </button>
              <div className={cn("h-8 w-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-turquoise p-[2px] cursor-pointer hover:shadow-lg transition-shadow")}>
                  <div className={cn("h-full w-full rounded-full flex items-center justify-center overflow-hidden", isAdminRoute ? "bg-brand-darkCharcoal" : "bg-white")}>
                       <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
              </div>
          </div>
        </header>
        
        <div id="main-content" className={cn("flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth", isAdminRoute ? "bg-brand-charcoal" : "bg-brand-offWhite")}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};