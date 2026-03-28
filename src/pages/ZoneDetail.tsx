import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Activity, Clock, Droplets, CloudRain, Shield, FileText, AlertTriangle } from 'lucide-react';
import Logo from '@/components/Logo';
import { zones } from '@/data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const ZoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const zone = zones.find((z) => z.id === id);

  if (!zone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Zone not found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-primary text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const riskClass = zone.risk === 'high' ? 'risk-high' : zone.risk === 'moderate' ? 'risk-moderate' : 'risk-safe';
  const riskBg = zone.risk === 'high' ? 'bg-risk-high' : zone.risk === 'moderate' ? 'bg-risk-moderate' : 'bg-risk-safe';

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
        <button onClick={() => navigate('/dashboard')} className="glass-card p-2 rounded-lg hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Logo size="sm" />
        <div className="h-5 w-px bg-border" />
        <h1 className="text-sm font-semibold">Zone Detail</h1>
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
                  {zone.risk.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Zone ID: {zone.id} • Bihar, India</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold font-mono ${riskClass}`}>{zone.riskScore}</div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Population', value: zone.population.toLocaleString(), color: 'text-primary' },
            { icon: Clock, label: 'Predicted Flood', value: zone.predictedFloodTime, color: riskClass },
            { icon: Droplets, label: 'River Level', value: `${zone.riverLevel}m`, color: zone.riverLevel > 7 ? 'risk-high' : 'text-primary' },
            { icon: CloudRain, label: 'Rainfall', value: `${zone.rainfall}mm`, color: zone.rainfall > 80 ? 'risk-high' : 'text-primary' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} className="glass-card p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Action Plan */}
        <motion.div variants={fadeUp} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">AI-Generated Action Plan</h3>
          </div>

          {zone.risk === 'safe' ? (
            <div className="text-sm text-muted-foreground p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="risk-safe font-medium mb-1">✓ No immediate action required</p>
              <p>Continue standard monitoring. Current conditions are within safe parameters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { priority: 'IMMEDIATE', action: `Deploy NDRF teams to ${zone.name} — estimated arrival 45 min`, icon: AlertTriangle, urgent: true },
                { priority: 'HIGH', action: `Activate evacuation shelters within 10km radius — capacity needed for ${(zone.population * 0.3 / 1000).toFixed(0)}K people`, icon: Users, urgent: true },
                { priority: 'MEDIUM', action: 'Set up medical camps at designated relief points', icon: Activity, urgent: false },
                { priority: 'STANDARD', action: 'Alert downstream zones and coordinate with state disaster authority', icon: FileText, urgent: false },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    item.urgent ? 'bg-destructive/5 border-destructive/20' : 'glass-card'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.urgent ? 'text-destructive' : 'text-primary'}`} />
                  <div>
                    <span className={`text-[10px] font-bold tracking-wider ${item.urgent ? 'text-destructive' : 'text-primary'}`}>
                      {item.priority}
                    </span>
                    <p className="text-sm mt-0.5">{item.action}</p>
                  </div>
                </motion.div>
              ))}
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
