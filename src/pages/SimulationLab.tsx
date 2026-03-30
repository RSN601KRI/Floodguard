import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Droplets, Waves, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import { useFloodEngine } from '@/hooks/useFloodEngine';
import { useAppContext } from '@/contexts/AppContext';
import FloodMap from '@/components/FloodMap';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function SimulationLab() {
  const { systemState, setSystemState } = useAppContext();
  const [localCrisis, setLocalCrisis] = useState(false);
  const engine = useFloodEngine(true, localCrisis);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rainfallMultiplier, setRainfallMultiplier] = useState(50);
  const [riverMultiplier, setRiverMultiplier] = useState(50);

  const triggerFlood = () => {
    setConfirmOpen(true);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Controls Panel */}
      <aside className="w-80 border-r border-border/50 p-4 space-y-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Simulation Lab</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Manually control environmental parameters and observe how the AI system responds.
        </p>

        {/* Manual Controls */}
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manual Controls</h3>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Droplets className="w-3 h-3" /> Rainfall Intensity</span>
              <span className="font-mono">{rainfallMultiplier}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={rainfallMultiplier}
              onChange={(e) => setRainfallMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Waves className="w-3 h-3" /> River Level</span>
              <span className="font-mono">{riverMultiplier}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={riverMultiplier}
              onChange={(e) => setRiverMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={triggerFlood}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/15 text-destructive font-semibold text-sm hover:bg-destructive/25 transition-colors border border-destructive/20"
          >
            <Zap className="w-4 h-4" />
            Simulate Flood Event
          </button>
          <button
            onClick={() => { setLocalCrisis(false); engine.reset(); setRainfallMultiplier(50); setRiverMultiplier(50); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass-card text-sm font-medium hover:text-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Scenario
          </button>
        </div>

        {/* Before vs After Comparison */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Before vs After
          </h3>
          <div className="space-y-2">
            {engine.zones.slice(0, 5).map((zone) => (
              <div key={zone.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{zone.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">0</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className={`font-mono font-semibold ${
                    zone.riskLevel === 'high' ? 'risk-high' : zone.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe'
                  }`}>{zone.riskScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Info */}
        <div className="text-[10px] text-muted-foreground text-center font-mono">
          Pipeline #{engine.pipelineRunCount} • {localCrisis ? '🔴 Crisis Active' : '🟢 Normal'}
        </div>
      </aside>

      {/* Map Preview */}
      <main className="flex-1 relative">
        <FloodMap
          zones={engine.zones}
          onZoneSelect={() => {}}
          simulateMode={localCrisis}
        />
        {localCrisis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/20 border border-destructive/30 rounded-xl px-6 py-2 text-sm font-semibold text-destructive z-10"
          >
            ⚠ FLOOD SIMULATION ACTIVE
          </motion.div>
        )}
      </main>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Simulate Flood Event"
        description="This will activate crisis multipliers, dramatically increasing rainfall and river levels across all zones. The AI system will respond with evacuation recommendations and resource deployments."
        confirmLabel="Start Simulation"
        variant="destructive"
        onConfirm={() => {
          setLocalCrisis(true);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
