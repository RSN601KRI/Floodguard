import { motion } from 'framer-motion';
import type { ZoneRiskPrediction } from '@/engine/agents/riskPredictor';

interface TimelineVisualizationProps {
  predictions: ZoneRiskPrediction[];
}

const TIME_POINTS = [
  { label: 'Now', hours: 0 },
  { label: '+1 hr', hours: 1 },
  { label: '+3 hr', hours: 3 },
  { label: '+6 hr', hours: 6 },
];

function projectRisk(current: number, trend: string, hours: number): number {
  const rate = trend === 'worsening' ? 5 : trend === 'improving' ? -3 : 1;
  return Math.min(100, Math.max(0, Math.round(current + rate * hours + (Math.random() - 0.3) * hours * 2)));
}

const TimelineVisualization = ({ predictions }: TimelineVisualizationProps) => {
  const topZones = predictions.slice(0, 4);

  return (
    <motion.div layout className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        <h3 className="text-sm font-semibold">Flood Spread Timeline</h3>
      </div>

      {/* Time axis */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {TIME_POINTS.map((tp) => (
          <div key={tp.label} className="text-center text-[10px] text-muted-foreground font-mono">
            {tp.label}
          </div>
        ))}
      </div>

      {/* Zone rows */}
      <div className="space-y-2">
        {topZones.map((zone) => (
          <div key={zone.zoneId}>
            <div className="text-[10px] text-muted-foreground mb-1 truncate">{zone.zoneName}</div>
            <div className="grid grid-cols-4 gap-1">
              {TIME_POINTS.map((tp) => {
                const risk = tp.hours === 0 ? zone.riskScore : projectRisk(zone.riskScore, zone.trend, tp.hours);
                const color = risk >= 65 ? 'bg-destructive' : risk >= 35 ? 'bg-warning' : 'bg-success';
                const opacity = Math.max(0.3, risk / 100);
                return (
                  <motion.div
                    key={tp.label}
                    className={`h-6 rounded ${color} flex items-center justify-center`}
                    style={{ opacity }}
                    animate={{ opacity }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-[9px] font-mono font-bold text-white drop-shadow-sm">{risk}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TimelineVisualization;
