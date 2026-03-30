import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';

interface SystemControlsProps {
  onReset?: () => void;
}

export default function SystemControls({ onReset }: SystemControlsProps) {
  const { systemState, setSystemState, role, workflowStep, setWorkflowStep } = useAppContext();

  if (role === 'public') return null;

  const handleStart = () => {
    setSystemState('active');
    if (workflowStep < 3) setWorkflowStep(3);
  };

  const handlePause = () => {
    setSystemState('standby');
  };

  const handleCrisis = () => {
    setSystemState('crisis');
    if (workflowStep < 3) setWorkflowStep(3);
  };

  const handleReset = () => {
    setSystemState('standby');
    setWorkflowStep(1);
    onReset?.();
  };

  return (
    <div className="flex items-center gap-2">
      {systemState === 'standby' && (
        <motion.button
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/15 text-success text-xs font-semibold hover:bg-success/25 transition-colors border border-success/20"
        >
          <Play className="w-3.5 h-3.5" />
          Start Monitoring
        </motion.button>
      )}

      {systemState === 'active' && (
        <motion.button
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePause}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/15 text-warning text-xs font-semibold hover:bg-warning/25 transition-colors border border-warning/20"
        >
          <Pause className="w-3.5 h-3.5" />
          Pause System
        </motion.button>
      )}

      {systemState === 'crisis' && (
        <motion.button
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePause}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/15 text-destructive text-xs font-semibold hover:bg-destructive/25 transition-colors border border-destructive/20 animate-pulse"
        >
          <Pause className="w-3.5 h-3.5" />
          Pause Crisis
        </motion.button>
      )}

      {role === 'admin' && systemState !== 'crisis' && (
        <button
          onClick={handleCrisis}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Crisis Mode
        </button>
      )}

      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
}
