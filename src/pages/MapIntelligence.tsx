import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, Filter, ChevronRight } from 'lucide-react';
import FloodMap from '@/components/FloodMap';
import FilterPanel from '@/components/FilterPanel';
import { useFloodEngine } from '@/hooks/useFloodEngine';
import { useAppContext } from '@/contexts/AppContext';

const riskLegend = [
  { label: 'Low Risk', color: 'bg-success', range: '0-40' },
  { label: 'Medium Risk', color: 'bg-warning', range: '40-70' },
  { label: 'High Risk', color: 'bg-destructive', range: '70-100' },
];

export default function MapIntelligence() {
  const navigate = useNavigate();
  const { systemState } = useAppContext();
  const isRunning = systemState !== 'standby';
  const engine = useFloodEngine(isRunning, systemState === 'crisis');
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="h-full flex relative">
      {/* Left Panel: Filters */}
      {showFilters && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 border-r border-border/50 p-4 space-y-4 overflow-y-auto scrollbar-thin"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filters
            </h2>
          </div>
          <FilterPanel />

          {/* Risk Legend */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Risk Legend
            </h3>
            <div className="space-y-2">
              {riskLegend.map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                  <span className="text-muted-foreground">{l.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{l.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone List */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Zones</h3>
            {engine.zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-all hover:bg-muted/50 ${
                  selectedZone?.id === zone.id ? 'bg-primary/10 border border-primary/20' : 'glass-card'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    zone.riskLevel === 'high' ? 'bg-destructive' : zone.riskLevel === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <span>{zone.name}</span>
                </div>
                <span className={`font-mono font-semibold ${
                  zone.riskLevel === 'high' ? 'risk-high' : zone.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe'
                }`}>{zone.riskScore}</span>
              </button>
            ))}
          </div>
        </motion.aside>
      )}

      {/* Toggle Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-3 left-3 z-10 glass-card p-2 rounded-lg hover:text-primary transition-colors"
        style={{ left: showFilters ? '18.5rem' : '0.75rem' }}
      >
        <Filter className="w-4 h-4" />
      </button>

      {/* Map */}
      <main className="flex-1 relative">
        <FloodMap
          zones={engine.zones}
          onZoneSelect={setSelectedZone}
          simulateMode={systemState === 'crisis'}
        />

        {/* Zone Detail Panel */}
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 w-72 glass-card p-4 z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{selectedZone.name}</h3>
              <button onClick={() => setSelectedZone(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Risk Score</span><span className={`font-bold ${selectedZone.riskLevel === 'high' ? 'risk-high' : selectedZone.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe'}`}>{selectedZone.riskScore}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Population</span><span className="font-medium">{selectedZone.population.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">River Level</span><span className="font-medium">{selectedZone.riverLevel}m</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rainfall</span><span className="font-medium">{Math.round(selectedZone.rainfall)}mm/hr</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Predicted Flood</span><span className="font-medium">{selectedZone.predictedFloodTime}</span></div>
            </div>
            <button
              onClick={() => navigate(`/zone/${selectedZone.id}`)}
              className="w-full flex items-center justify-center gap-2 py-2 mt-3 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              Full Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
