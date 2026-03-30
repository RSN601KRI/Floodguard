import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Activity, Users, Droplets, TrendingUp, TrendingDown, Minus, Waves,
  MessageSquareWarning, Zap, PlayCircle, ChevronRight
} from 'lucide-react';
import FloodMap from '@/components/FloodMap';
import AIReasoningPanel from '@/components/AIReasoningPanel';
import TimelineVisualization from '@/components/TimelineVisualization';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import AutoAlertTicker from '@/components/AutoAlertTicker';
import DemoStoryMode from '@/components/DemoStoryMode';
import HistoricalCharts from '@/components/HistoricalCharts';
import SystemControls from '@/components/SystemControls';
import FilterPanel from '@/components/FilterPanel';
import WorkflowSteps from '@/components/WorkflowSteps';
import { useFloodEngine } from '@/hooks/useFloodEngine';
import { useAppContext } from '@/contexts/AppContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { systemState, role, workflowStep, setWorkflowStep } = useAppContext();
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [demoMode, setDemoMode] = useState(false);

  const isRunning = systemState !== 'standby';
  const isCrisis = systemState === 'crisis';
  const engine = useFloodEngine(isRunning, isCrisis);

  const trendIcon = (t: string) =>
    t === 'worsening' ? <TrendingUp className="w-3 h-3 text-destructive" />
      : t === 'improving' ? <TrendingDown className="w-3 h-3 text-success" />
        : <Minus className="w-3 h-3 text-muted-foreground" />;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 glass-panel">
        <div className="flex items-center gap-3">
          <SystemControls onReset={engine.reset} />
          <div className="h-4 w-px bg-border/50" />
          <WorkflowSteps />
        </div>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                demoMode ? 'bg-primary/20 text-primary glow-border' : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              {demoMode ? 'Demo Active' : 'Demo Story'}
            </button>
          )}
          <span className="text-[10px] text-muted-foreground font-mono">
            Pipeline #{engine.pipelineRunCount}
          </span>
        </div>
      </div>

      {/* Crisis Banner */}
      <AnimatePresence>
        {isCrisis && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-destructive/10 border-b border-destructive/30 px-4 py-1.5 text-center overflow-hidden"
          >
            <span className="text-xs font-semibold text-destructive animate-pulse">
              ⚠ CRISIS MODE ACTIVE — Rainfall intensified • River levels rising • Flood scenarios triggered
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standby State */}
      {systemState === 'standby' && !demoMode && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">System on Standby</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure your region filters and click "Start Monitoring" to begin real-time flood detection and AI analysis.
            </p>
            <FilterPanel />
          </motion.div>
        </div>
      )}

      {/* Active Content */}
      {(isRunning || demoMode) && (
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT: Alerts Feed */}
          <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-72 border-r border-border/50 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/50">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Live Alerts
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-mono">
                  {engine.alerts.length}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
              <AnimatePresence initial={false}>
                {engine.alerts.slice(0, 20).map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                      alert.type === 'critical'
                        ? 'bg-risk-high border-destructive/30'
                        : alert.type === 'warning'
                          ? 'bg-risk-moderate border-warning/30'
                          : 'glass-card'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        alert.type === 'critical' ? 'bg-destructive animate-pulse' : alert.type === 'warning' ? 'bg-warning' : 'bg-primary'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-muted-foreground">{alert.timestamp}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{alert.source}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* CENTER: Map */}
          <main className="flex-1 relative">
            <FloodMap
              zones={engine.zones}
              onZoneSelect={(zone) => { setSelectedZone(zone); if (workflowStep < 4) setWorkflowStep(4); }}
              simulateMode={isCrisis}
            />

            {/* Zone popup */}
            <AnimatePresence>
              {selectedZone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card p-4 max-w-sm z-10 w-80"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{selectedZone.name}</h3>
                    <button onClick={() => setSelectedZone(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Risk</div>
                      <div className={`text-sm font-bold ${
                        selectedZone.riskLevel === 'high' ? 'risk-high' : selectedZone.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe'
                      }`}>{selectedZone.riskScore}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Population</div>
                      <div className="text-sm font-bold">{(selectedZone.population / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Flood In</div>
                      <div className="text-sm font-bold text-xs">{selectedZone.predictedFloodTime}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/zone/${selectedZone.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Demo Story Mode overlay */}
            <AnimatePresence>
              {demoMode && (
                <DemoStoryMode
                  onStepChange={() => {}}
                  onClose={() => setDemoMode(false)}
                  onSimulateToggle={() => {}}
                />
              )}
            </AnimatePresence>
          </main>

          {/* RIGHT: AI Engine */}
          <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-80 border-l border-border/50 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/50">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                AI Decision Engine
                <span className="ml-auto text-[10px] text-muted-foreground font-mono animate-pulse">LIVE</span>
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
              <AIReasoningPanel predictions={engine.predictions} evacuation={engine.evacuation} pipelineRunCount={engine.pipelineRunCount} />
              <TimelineVisualization predictions={engine.predictions} />

              {/* Risk Predictions */}
              <motion.div layout className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Risk Prediction</h3>
                </div>
                <div className="space-y-2">
                  {engine.predictions.slice(0, 5).map((pred) => (
                    <div key={pred.zoneId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {trendIcon(pred.trend)}
                        <span className="text-muted-foreground">{pred.zoneName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <motion.div
                            className={`h-full rounded-full ${pred.riskLevel === 'high' ? 'bg-destructive' : pred.riskLevel === 'medium' ? 'bg-warning' : 'bg-success'}`}
                            animate={{ width: `${pred.riskScore}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <span className={`font-mono w-8 text-right font-semibold ${pred.riskLevel === 'high' ? 'risk-high' : pred.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe'}`}>
                          {pred.riskScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Evacuation Plans */}
              <motion.div layout className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-warning" />
                  <h3 className="text-sm font-semibold">Evacuation Plans</h3>
                  {engine.evacuation.activePlans.length > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-warning/15 text-warning font-bold">
                      {engine.evacuation.activePlans.length} ACTIVE
                    </span>
                  )}
                </div>
                {engine.evacuation.activePlans.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No evacuation plans active</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">People at Risk</span>
                      <span className="text-warning font-semibold">{engine.evacuation.totalPeopleAtRisk.toLocaleString()}</span>
                    </div>
                    {engine.evacuation.activePlans.slice(0, 3).map((plan) => (
                      <div key={plan.zoneId} className={`text-[10px] p-2 rounded border ${
                        plan.priority === 'immediate' ? 'bg-risk-high border-destructive/20' : 'bg-risk-moderate border-warning/20'
                      }`}>
                        <span className={`font-bold uppercase ${plan.priority === 'immediate' ? 'risk-high' : 'risk-moderate'}`}>{plan.priority}</span>
                        <span className="text-muted-foreground"> — </span>
                        {plan.actionStatement}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Resources */}
              <motion.div layout className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-success" />
                  <h3 className="text-sm font-semibold">Resource Allocation</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Boats', value: engine.resources.totals.boats, total: 150, color: 'bg-primary' },
                    { label: 'NDRF Teams', value: engine.resources.totals.ndrfTeams, total: 12, color: 'bg-primary' },
                    { label: 'Medical', value: engine.resources.totals.medicalTeams, total: 20, color: 'bg-success' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono text-[11px]">{item.value}/{item.total}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <motion.div
                          className={`h-full rounded-full ${item.color}`}
                          animate={{ width: `${Math.min(100, (item.value / item.total) * 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {engine.resources.decisions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
                    <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">AI Decisions</div>
                    {engine.resources.decisions.slice(0, 4).map((d, i) => (
                      <div key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">▸</span>{d}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <HistoricalCharts
                history={engine.history}
                zoneNames={Object.fromEntries(engine.zones.map((z) => [z.id, z.name]))}
                riverNames={Object.fromEntries(engine.rivers.map((r) => [r.id, r.name]))}
              />

              <AutoAlertTicker isActive={isCrisis || engine.systemStatus !== 'Stable'} alerts={engine.alerts} />

              <PerformanceMetrics
                pipelineRunCount={engine.pipelineRunCount}
                totalPeopleAtRisk={engine.evacuation.totalPeopleAtRisk}
                activePlans={engine.evacuation.activePlans.length}
              />

              {/* River Status */}
              <motion.div layout className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Waves className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">River Monitoring</h3>
                </div>
                <div className="space-y-2">
                  {engine.rivers.map((river) => {
                    const levelPercent = (river.currentLevel / river.dangerLevel) * 100;
                    const isWarning = river.currentLevel >= river.warningLevel;
                    const isDanger = river.currentLevel >= river.dangerLevel;
                    return (
                      <div key={river.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            {river.name}
                            {river.trend === 'rising' && <TrendingUp className="w-2.5 h-2.5 text-destructive" />}
                            {river.trend === 'falling' && <TrendingDown className="w-2.5 h-2.5 text-success" />}
                          </span>
                          <span className={`font-mono text-[11px] ${isDanger ? 'risk-high' : isWarning ? 'risk-moderate' : ''}`}>
                            {river.currentLevel}m / {river.dangerLevel}m
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <motion.div
                            className={`h-full rounded-full ${isDanger ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-primary'}`}
                            animate={{ width: `${Math.min(100, levelPercent)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Social Signals */}
              {engine.socialSignals.length > 0 && (
                <motion.div layout className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareWarning className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold">Social Signals</h3>
                  </div>
                  <div className="space-y-2">
                    {engine.socialSignals.slice(0, 3).map((sig) => (
                      <div key={sig.id} className="text-[10px] p-2 rounded glass-card">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`font-bold uppercase ${
                            sig.sentiment === 'alarm' ? 'risk-high' : sig.sentiment === 'relief' ? 'risk-safe' : 'text-muted-foreground'
                          }`}>{sig.source}</span>
                          <span className="text-muted-foreground">• #{sig.keyword}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{sig.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
