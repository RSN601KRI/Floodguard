import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Activity, Clock, Droplets, CloudRain, Shield, FileText, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Logo from '@/components/Logo';
import { useFloodEngine } from '@/hooks/useFloodEngine';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const ZoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const engine = useFloodEngine();

  const zone = engine.zones.find((z) => z.id === id);
  const prediction = engine.predictions.find((p) => p.zoneId === id);
  const evacPlan = engine.evacuation.activePlans.find((p) => p.zoneId === id);
  const resourceDeploy = engine.resources.deployments.find((d) => d.zoneId === id);
  const pop = engine.ontology.population.get(id || '');

  if (!zone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Zone not found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-primary text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const riskClass = zone.riskLevel === 'high' ? 'risk-high' : zone.riskLevel === 'medium' ? 'risk-moderate' : 'risk-safe';
  const riskBg = zone.riskLevel === 'high' ? 'bg-risk-high' : zone.riskLevel === 'medium' ? 'bg-risk-moderate' : 'bg-risk-safe';

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
        <button onClick={() => navigate('/dashboard')} className="glass-card p-2 rounded-lg hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Logo size="sm" />
        <div className="h-5 w-px bg-border" />
        <h1 className="text-sm font-semibold">Zone Detail</h1>
        <span className="ml-auto text-[10px] text-muted-foreground font-mono animate-pulse">LIVE • Pipeline #{engine.pipelineRunCount}</span>
      </header>

      <motion.div
        className="max-w-5xl mx-auto p-6 space-y-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Zone Header */}
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{zone.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskBg} ${riskClass}`}>
                  {zone.riskLevel.toUpperCase()} RISK
                </span>
                {prediction && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {prediction.trend === 'worsening' ? <TrendingUp className="w-3 h-3 text-destructive" /> :
                      prediction.trend === 'improving' ? <TrendingDown className="w-3 h-3 text-success" /> :
                        <Minus className="w-3 h-3" />}
                    {prediction.trend}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Zone ID: {zone.id} • {zone.district}, Bihar</p>
            </div>
            <div className="text-right">
              <motion.div
                key={zone.riskScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-bold font-mono ${riskClass}`}
              >
                {zone.riskScore}
              </motion.div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
              {prediction && (
                <div className="text-[10px] text-primary mt-1">
                  Confidence: {Math.round(prediction.confidence * 100)}%
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Population', value: zone.population.toLocaleString(), color: 'text-primary' },
            { icon: Clock, label: 'Predicted Flood', value: zone.predictedFloodTime, color: riskClass },
            { icon: Droplets, label: 'River Level', value: `${zone.riverLevel}m`, color: zone.riverLevel > 7 ? 'risk-high' : 'text-primary' },
            { icon: CloudRain, label: 'Rainfall', value: `${Math.round(zone.rainfall)}mm/hr`, color: zone.rainfall > 80 ? 'risk-high' : 'text-primary' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="glass-card p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <motion.div
                key={stat.value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className={`text-xl font-bold font-mono ${stat.color}`}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Risk Breakdown */}
        {prediction && (
          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Risk Breakdown (AI Analysis)</h3>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(prediction.breakdown).map(([key, value]) => {
                const labels: Record<string, string> = {
                  riverComponent: 'River Threat',
                  rainfallComponent: 'Rainfall',
                  satelliteComponent: 'Satellite',
                  socialComponent: 'Social Intel',
                  historicalComponent: 'Historical',
                };
                return (
                  <div key={key} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{labels[key]}</div>
                    <div className="relative w-12 h-12 mx-auto mb-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <motion.circle
                          cx="18" cy="18" r="14" fill="none"
                          stroke={value > 60 ? 'hsl(var(--destructive))' : value > 30 ? 'hsl(var(--warning))' : 'hsl(var(--primary))'}
                          strokeWidth="3"
                          strokeDasharray={`${value * 0.88} 88`}
                          strokeLinecap="round"
                          animate={{ strokeDasharray: `${value * 0.88} 88` }}
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Plan */}
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">AI-Generated Action Plan</h3>
          </div>

          {zone.riskLevel === 'low' && !evacPlan ? (
            <div className="text-sm text-muted-foreground p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="risk-safe font-medium mb-1">✓ No immediate action required</p>
              <p>Continue standard monitoring. Current conditions are within safe parameters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {evacPlan && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg border bg-destructive/5 border-destructive/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-destructive uppercase">{evacPlan.priority} EVACUATION</span>
                      <p className="text-sm mt-0.5">{evacPlan.actionStatement}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {evacPlan.suggestedRoutes.map((r) => (
                          <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {resourceDeploy && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-lg border glass-card"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-primary">RESOURCE DEPLOYMENT</span>
                      <p className="text-sm mt-0.5">{resourceDeploy.actionStatement}</p>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {[
                          { label: 'Boats', value: resourceDeploy.boats },
                          { label: 'NDRF', value: resourceDeploy.ndrfTeams },
                          { label: 'Medical', value: resourceDeploy.medicalTeams },
                          { label: 'Relief Kits', value: resourceDeploy.reliefKits.toLocaleString() },
                        ].map((r) => (
                          <div key={r.label} className="text-center">
                            <div className="text-sm font-bold font-mono">{r.value}</div>
                            <div className="text-[9px] text-muted-foreground">{r.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {pop && (
                <div className="text-xs text-muted-foreground p-3 rounded-lg glass-card">
                  <span className="font-medium text-foreground">Population Detail:</span>{' '}
                  {pop.total.toLocaleString()} total • {pop.vulnerable.toLocaleString()} vulnerable • {pop.belowPovertyLine.toLocaleString()} BPL
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="flex gap-3">
          <button
            onClick={() => navigate('/alerts')}
            className="flex-1 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors glow-border"
          >
            Send Alerts for This Zone
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl glass-card text-sm font-medium hover:text-primary transition-colors"
          >
            Back to Map
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ZoneDetail;
