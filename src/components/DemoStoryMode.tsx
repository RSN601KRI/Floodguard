import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, X, CloudRain, AlertTriangle, Brain, Bell, CheckCircle } from 'lucide-react';

interface DemoStoryModeProps {
  onStepChange: (step: number) => void;
  onClose: () => void;
  onSimulateToggle: (active: boolean) => void;
}

const STEPS = [
  {
    title: 'Normal Conditions',
    description: 'All zones are operating within safe parameters. Rivers are at normal levels, weather is calm.',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    duration: 5000,
    narrative: 'Bihar FloodGuard monitors 7 zones across the state. Currently, all river levels are nominal and weather conditions are stable.',
  },
  {
    title: 'Rainfall Intensifies',
    description: 'Heavy rainfall detected upstream. Weather sensors recording 80+ mm/hr intensity.',
    icon: CloudRain,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    duration: 6000,
    narrative: 'Upstream weather stations detect heavy rainfall in the Kosi and Gandak basins. Satellite imagery shows cloud buildup over North Bihar.',
  },
  {
    title: 'Risk Detected',
    description: 'AI Risk Predictor identifies rising threat levels in multiple zones. Risk scores climbing.',
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    duration: 6000,
    narrative: 'The AI Risk Predictor analyzes sensor data, satellite imagery, and social signals. Saharsa and Darbhanga zones cross the danger threshold.',
  },
  {
    title: 'AI Recommends Action',
    description: 'Evacuation Planner and Resource Allocator generate deployment plans automatically.',
    icon: Brain,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    duration: 6000,
    narrative: 'Agent 2 (Evacuation) and Agent 3 (Resources) produce actionable plans: evacuate 45,000 people, deploy 28 boats, mobilize 4 NDRF teams.',
  },
  {
    title: 'Alerts Dispatched',
    description: 'SMS and WhatsApp alerts sent to officials and villagers. Emergency response activated.',
    icon: Bell,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    duration: 5000,
    narrative: 'Automated alert system pushes notifications to 12 district officials and 35,000 villagers via SMS and WhatsApp. Response time: under 90 seconds.',
  },
];

const DemoStoryMode = ({ onStepChange, onClose, onSimulateToggle }: DemoStoryModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setProgress(0);
    onStepChange(step);
    // Activate simulation on step 2+
    onSimulateToggle(step >= 2);
  }, [onStepChange, onSimulateToggle]);

  useEffect(() => {
    if (!isPlaying) return;
    const stepDuration = STEPS[currentStep].duration;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (currentStep < STEPS.length - 1) {
            goToStep(currentStep + 1);
          } else {
            setIsPlaying(false);
          }
          return 0;
        }
        return p + (100 / (stepDuration / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, goToStep]);

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="absolute bottom-0 left-0 right-0 z-30 p-4"
    >
      <div className="glass-panel rounded-2xl p-5 max-w-3xl mx-auto glow-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Demo Story Mode</span>
            <span className="text-[10px] text-muted-foreground font-mono">Step {currentStep + 1}/{STEPS.length}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 mb-4"
          >
            <div className={`w-10 h-10 rounded-xl ${step.bgColor} flex items-center justify-center shrink-0`}>
              <StepIcon className={`w-5 h-5 ${step.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${step.color}`}>{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{step.narrative}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 mb-3">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className="flex-1 h-1 rounded-full overflow-hidden bg-muted cursor-pointer"
            >
              <motion.div
                className={`h-full rounded-full ${
                  i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary' : 'bg-transparent'
                }`}
                style={{ width: i < currentStep ? '100%' : i === currentStep ? `${progress}%` : '0%' }}
              />
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => goToStep(0)} className="p-2 rounded-lg glass-card hover:text-primary transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => currentStep < STEPS.length - 1 && goToStep(currentStep + 1)}
            className="p-2 rounded-lg glass-card hover:text-primary transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DemoStoryMode;
