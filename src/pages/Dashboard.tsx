import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Radio, Zap, ChevronRight, Activity, Users, Droplets, Map, Bell, Settings } from 'lucide-react';
import Logo from '@/components/Logo';
import { zones, alerts, riskPrediction, evacuationPlan, resourceAllocation } from '@/data/mockData';
import type { Zone } from '@/data/mockData';
import FloodMap from '@/components/FloodMap';

const Dashboard = () => {
  const navigate = useNavigate();
  const [simulateMode, setSimulateMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const systemStatus = simulateMode ? 'Critical' : 'Live';
  const statusColor = simulateMode ? 'text-destructive' : 'text-success';

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 glass-panel z-20">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Radio className={`w-3.5 h-3.5 ${statusColor} ${simulateMode ? 'animate-pulse' : ''}`} />
            <span className={`text-sm font-medium ${statusColor}`}>{systemStatus}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulateMode(!simulateMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              simulateMode
                ? 'bg-destructive/20 text-destructive glow-border'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {simulateMode ? 'Simulation Active' : 'Simulate Flood'}
          </button>
          <button onClick={() => navigate('/alerts')} className="glass-card p-2 rounded-lg hover:text-primary transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/')} className="glass-card p-2 rounded-lg hover:text-primary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Alerts Feed */}
        <aside className="w-72 border-r border-border/50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Live Alerts
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-mono">
                {alerts.length}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
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
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* CENTER: Map */}
        <main className="flex-1 relative">
          <FloodMap
            zones={zones}
            onZoneSelect={(zone) => setSelectedZone(zone)}
            simulateMode={simulateMode}
          />
          {/* Zone quick popup */}
          <AnimatePresence>
            {selectedZone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 glass-card p-4 max-w-sm z-10"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{selectedZone.name}</h3>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Risk</div>
                    <div className={`text-sm font-bold ${
                      selectedZone.risk === 'high' ? 'risk-high' : selectedZone.risk === 'moderate' ? 'risk-moderate' : 'risk-safe'
                    }`}>
                      {selectedZone.riskScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Population</div>
                    <div className="text-sm font-bold">{(selectedZone.population / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Flood In</div>
                    <div className="text-sm font-bold">{selectedZone.predictedFloodTime}</div>
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
        </main>

        {/* RIGHT: AI Engine */}
        <aside className="w-80 border-l border-border/50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              AI Decision Engine
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {/* Risk Prediction */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 glow-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Risk Prediction</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Overall Status</span>
                  <span className="text-destructive font-semibold">{riskPrediction.overallRisk}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Affected Population</span>
                  <span className="font-medium">{riskPrediction.affectedPopulation}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Zones at Risk</span>
                  <span className="font-medium">{riskPrediction.zonesAtRisk}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="text-primary font-semibold">{riskPrediction.confidenceLevel}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${riskPrediction.confidenceLevel}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Evacuation Plan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold">Evacuation Plan</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active Plans</span>
                  <span className="font-medium">{evacuationPlan.activePlans}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">To Evacuate</span>
                  <span className="text-warning font-semibold">{evacuationPlan.peopleToEvacuate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Vehicles</span>
                  <span className="font-medium">{evacuationPlan.vehiclesDeployed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Shelters Open</span>
                  <span className="font-medium">{evacuationPlan.sheltersOpen}</span>
                </div>
                <div className="mt-2">
                  <div className="text-[10px] text-muted-foreground mb-1">Active Routes</div>
                  <div className="flex flex-wrap gap-1">
                    {evacuationPlan.routes.map((r) => (
                      <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resource Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-success" />
                <h3 className="text-sm font-semibold">Resource Allocation</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'NDRF Teams', value: resourceAllocation.ndrf.deployed, total: resourceAllocation.ndrf.teams, color: 'bg-primary' },
                  { label: 'Boats', value: resourceAllocation.boats.deployed, total: resourceAllocation.boats.total, color: 'bg-primary' },
                  { label: 'Medical Teams', value: resourceAllocation.medicalTeams.deployed, total: resourceAllocation.medicalTeams.total, color: 'bg-success' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono text-[11px]">{item.value}/{item.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / item.total) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-muted-foreground">Food Packets</span>
                  <span className="font-mono text-[11px]">
                    {(resourceAllocation.foodPackets.distributed / 1000).toFixed(0)}K / {(resourceAllocation.foodPackets.total / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
