import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'admin' | 'field-officer' | 'public';
export type SystemState = 'standby' | 'active' | 'crisis';

interface FilterState {
  state: string;
  district: string;
  zone: string;
  rainfallSensitivity: number;
  riverThreshold: number;
  alertUrgency: number;
}

interface SettingsState {
  refreshInterval: number; // seconds
  alertThreshold: number;
  aiAggressiveness: number; // 1-10
}

interface AppContextValue {
  role: UserRole;
  setRole: (r: UserRole) => void;
  systemState: SystemState;
  setSystemState: (s: SystemState) => void;
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  settings: SettingsState;
  setSettings: (s: Partial<SettingsState>) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
  workflowStep: number;
  setWorkflowStep: (s: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultFilters: FilterState = {
  state: 'Bihar',
  district: 'All Districts',
  zone: 'All Zones',
  rainfallSensitivity: 50,
  riverThreshold: 50,
  alertUrgency: 50,
};

const defaultSettings: SettingsState = {
  refreshInterval: 4,
  alertThreshold: 60,
  aiAggressiveness: 5,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const [systemState, setSystemState] = useState<SystemState>('standby');
  const [filters, _setFilters] = useState<FilterState>(defaultFilters);
  const [settings, _setSettings] = useState<SettingsState>(defaultSettings);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    _setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const setSettings = useCallback((partial: Partial<SettingsState>) => {
    _setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole,
      systemState, setSystemState,
      filters, setFilters,
      settings, setSettings,
      onboardingComplete, setOnboardingComplete,
      workflowStep, setWorkflowStep,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
