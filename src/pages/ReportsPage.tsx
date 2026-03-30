import { motion } from 'framer-motion';
import { BarChart3, Download, Users, Clock, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFloodEngine } from '@/hooks/useFloodEngine';
import { useAppContext } from '@/contexts/AppContext';

export default function ReportsPage() {
  const { systemState } = useAppContext();
  const engine = useFloodEngine(systemState !== 'standby', systemState === 'crisis');

  const kpis = [
    { icon: Users, label: 'People Protected', value: '1.93M', change: '+12%', color: 'text-primary' },
    { icon: Clock, label: 'Avg Response Time', value: '14 min', change: '-28%', color: 'text-success' },
    { icon: Target, label: 'Detection Accuracy', value: '94.2%', change: '+3.1%', color: 'text-primary' },
    { icon: TrendingUp, label: 'Zones Monitored', value: '7', change: '—', color: 'text-muted-foreground' },
  ];

  // Build chart data from history
  const riskTrend = engine.history.map((h) => {
    const entry: Record<string, any> = { cycle: h.cycle };
    Object.entries(h.riskScores).forEach(([id, score]) => {
      const zone = engine.zones.find((z) => z.id === id);
      if (zone) entry[zone.name] = score;
    });
    return entry;
  });

  const populationImpact = engine.history.map((h) => {
    let total = 0;
    Object.entries(h.riskScores).forEach(([id, score]) => {
      if (score >= 60) {
        const pop = engine.ontology.population.get(id);
        if (pop) total += pop.total;
      }
    });
    return { cycle: h.cycle, affected: Math.round(total / 1000) };
  });

  const colors = ['hsl(190,80%,45%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(142,71%,45%)', 'hsl(280,60%,55%)', 'hsl(200,70%,50%)', 'hsl(320,60%,50%)'];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            Reports & Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Performance metrics and trend analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors glow-border">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <kpi.icon className={`w-5 h-5 mb-3 ${kpi.color}`} />
            <div className="text-2xl font-bold font-mono">{kpi.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <span className={`text-[10px] font-mono ${kpi.change.startsWith('+') ? 'text-success' : kpi.change.startsWith('-') ? 'text-primary' : 'text-muted-foreground'}`}>
                {kpi.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Trend */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">Risk Score Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 8, fontSize: 11 }} />
            {engine.zones.map((z, i) => (
              <Line key={z.id} type="monotone" dataKey={z.name} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Population Impact */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">Population at Risk (thousands)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={populationImpact}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 15% 18%)', borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="affected" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Response Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-3">Active Resources</h3>
          <div className="space-y-3">
            {[
              { label: 'Boats Deployed', value: engine.resources.totals.boats, max: 150 },
              { label: 'NDRF Teams', value: engine.resources.totals.ndrfTeams, max: 12 },
              { label: 'Medical Teams', value: engine.resources.totals.medicalTeams, max: 20 },
              { label: 'Relief Kits', value: engine.resources.totals.reliefKits, max: 200000 },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-mono">{r.value.toLocaleString()}/{r.max.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (r.value / r.max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-3">AI Decision Log</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {engine.resources.decisions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No decisions yet. Start monitoring to generate AI recommendations.</p>
            ) : (
              engine.resources.decisions.map((d, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-start gap-2 p-2 rounded glass-card">
                  <span className="text-primary shrink-0">▸</span>
                  {d}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
