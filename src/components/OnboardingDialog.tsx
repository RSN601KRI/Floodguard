import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Radio, Brain, Zap, X } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const steps = [
  { icon: MapPin, title: 'Select your region', desc: 'Choose your state, district, and zone to focus monitoring.' },
  { icon: Radio, title: 'Start monitoring', desc: 'Activate real-time data ingestion from sensors and satellites.' },
  { icon: Brain, title: 'Review AI recommendations', desc: 'Our AI agents analyze risks and suggest evacuations.' },
  { icon: Zap, title: 'Take action', desc: 'Approve evacuations, send alerts, and deploy resources.' },
];

export default function OnboardingDialog() {
  const { onboardingComplete, setOnboardingComplete } = useAppContext();
  const [step, setStep] = useState(0);

  if (onboardingComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-8 max-w-lg w-full mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Welcome to FloodGuard</h2>
            <button
              onClick={() => setOnboardingComplete(true)}
              className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {steps.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <motion.div
                  key={i}
                  animate={{ opacity: done ? 0.5 : 1 }}
                  className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
                    active ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active ? 'bg-primary/20' : done ? 'bg-success/20' : 'bg-muted'
                  }`}>
                    <s.icon className={`w-4 h-4 ${active ? 'text-primary' : done ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">Step {i + 1}</span>
                      {s.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg glass-card text-sm font-medium hover:text-primary transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else setOnboardingComplete(true);
              }}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90"
            >
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
