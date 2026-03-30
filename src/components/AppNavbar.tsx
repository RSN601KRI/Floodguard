import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Bell, FlaskConical, BarChart3, Settings,
  Radio, Shield, User, Eye, ChevronDown
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAppContext, type UserRole, type SystemState } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'Map Intelligence', icon: Map },
  { path: '/alerts', label: 'Alerts & Comms', icon: Bell },
  { path: '/simulation', label: 'Simulation Lab', icon: FlaskConical },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const roleLabels: Record<UserRole, { label: string; icon: typeof Shield; color: string }> = {
  admin: { label: 'Admin', icon: Shield, color: 'text-primary' },
  'field-officer': { label: 'Field Officer', icon: Eye, color: 'text-warning' },
  public: { label: 'Public User', icon: User, color: 'text-success' },
};

const stateColors: Record<SystemState, string> = {
  standby: 'text-muted-foreground',
  active: 'text-success',
  crisis: 'text-destructive',
};

const stateLabels: Record<SystemState, string> = {
  standby: 'Standby',
  active: 'Live',
  crisis: 'Critical',
};

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole, systemState } = useAppContext();
  const currentRole = roleLabels[role];

  // Filter nav items based on role
  const visibleItems = role === 'public'
    ? navItems.filter((i) => ['/dashboard', '/map', '/alerts'].includes(i.path))
    : role === 'field-officer'
      ? navItems.filter((i) => i.path !== '/settings')
      : navItems;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-4 py-2 border-b border-border/50 glass-panel z-30 shrink-0"
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="shrink-0">
          <Logo size="sm" />
        </button>
        <div className="h-5 w-px bg-border/50" />
        <nav className="flex items-center gap-0.5">
          {visibleItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Status + Role */}
      <div className="flex items-center gap-3">
        {/* System status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-medium ${stateColors[systemState]}`}>
          <Radio className={`w-3 h-3 ${systemState === 'crisis' ? 'animate-pulse' : systemState === 'active' ? 'animate-pulse' : ''}`} />
          {stateLabels[systemState]}
        </div>

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-xs font-medium hover:bg-muted/50 transition-colors">
              <currentRole.icon className={`w-3.5 h-3.5 ${currentRole.color}`} />
              <span className="hidden sm:inline">{currentRole.label}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.keys(roleLabels) as UserRole[]).map((r) => {
              const info = roleLabels[r];
              return (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRole(r)}
                  className={r === role ? 'bg-primary/10' : ''}
                >
                  <info.icon className={`w-4 h-4 mr-2 ${info.color}`} />
                  {info.label}
                  {r === role && <span className="ml-auto text-[10px] text-primary">●</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
