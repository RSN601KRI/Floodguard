import { motion } from 'framer-motion';
import { MapPin, Radio, Brain, Zap, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const steps = [
  { icon: MapPin, label: 'Select Region' },
  { icon: Radio, label: 'Start Monitoring' },
  { icon: Brain, label: 'AI Analysis' },
  { icon: Zap, label: 'Take Action' },
];

export default function WorkflowSteps() {
  const { workflowStep } = useAppContext();

  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const done = workflowStep > stepNum;
        const active = workflowStep === stepNum;
        return (
          <div key={i} className="flex items-center gap-1">
            <motion.div
              animate={{ scale: active ? 1.05 : 1 }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                done ? 'text-success bg-success/10' : active ? 'text-primary bg-primary/10 glow-border' : 'text-muted-foreground'
              }`}
            >
              {done ? <CheckCircle2 className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
              <span className="hidden xl:inline">{s.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-px ${done ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
