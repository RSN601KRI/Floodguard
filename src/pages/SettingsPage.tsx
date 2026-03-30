import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Clock, Bell, Brain, Save } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useState } from 'react';

export default function SettingsPage() {
  const { settings, setSettings } = useAppContext();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system behavior and thresholds</p>
      </div>

      {/* Data Refresh */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold">Data Refresh Interval</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">How frequently the pipeline ingests and processes data.</p>
        <div className="flex items-center gap-4">
          <input
            type="range" min={2} max={15} value={settings.refreshInterval}
            onChange={(e) => setSettings({ refreshInterval: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
          <span className="text-sm font-mono font-bold w-16 text-right">{settings.refreshInterval}s</span>
        </div>
      </motion.div>

      {/* Alert Thresholds */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-warning" />
          <h3 className="text-base font-semibold">Alert Thresholds</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Risk score threshold at which alerts are auto-generated.</p>
        <div className="flex items-center gap-4">
          <input
            type="range" min={30} max={90} value={settings.alertThreshold}
            onChange={(e) => setSettings({ alertThreshold: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warning"
          />
          <span className="text-sm font-mono font-bold w-16 text-right">{settings.alertThreshold}</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
          <span>Sensitive (30)</span>
          <span>Balanced</span>
          <span>Conservative (90)</span>
        </div>
      </motion.div>

      {/* AI Aggressiveness */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold">AI Decision Aggressiveness</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Controls how proactively the AI recommends evacuations and resource deployment.</p>
        <div className="flex items-center gap-4">
          <input
            type="range" min={1} max={10} value={settings.aiAggressiveness}
            onChange={(e) => setSettings({ aiAggressiveness: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
          <span className="text-sm font-mono font-bold w-16 text-right">{settings.aiAggressiveness}/10</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Aggressive</span>
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <Save className="w-4 h-4" />
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  );
}
