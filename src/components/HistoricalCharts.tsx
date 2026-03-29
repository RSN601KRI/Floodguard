import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface HistoryEntry {
  cycle: number;
  riskScores: Record<string, number>;
  rainfall: Record<string, number>;
  riverLevels: Record<string, number>;
}

interface Props {
  history: HistoryEntry[];
  zoneNames: Record<string, string>;
  riverNames: Record<string, string>;
}

const ZONE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--success))',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2 text-[10px] border border-border/50 rounded-lg">
      <div className="font-mono text-muted-foreground mb-1">Cycle #{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function HistoricalCharts({ history, zoneNames, riverNames }: Props) {
  if (history.length < 2) return null;

  const zoneIds = Object.keys(zoneNames);
  const riverIds = Object.keys(riverNames);

  const riskData = history.map((h) => {
    const entry: any = { cycle: h.cycle };
    zoneIds.forEach((id) => { entry[id] = h.riskScores[id] ?? 0; });
    return entry;
  });

  const rainfallData = history.map((h) => {
    const entry: any = { cycle: h.cycle };
    zoneIds.forEach((id) => { entry[id] = h.rainfall[id] ?? 0; });
    return entry;
  });

  const riverData = history.map((h) => {
    const entry: any = { cycle: h.cycle };
    riverIds.forEach((id) => { entry[id] = h.riverLevels[id] ?? 0; });
    return entry;
  });

  const chartCommon = {
    margin: { top: 4, right: 4, bottom: 0, left: -20 },
  };

  return (
    <motion.div layout className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Historical Trends</h3>
        <span className="ml-auto text-[10px] text-muted-foreground font-mono">{history.length} cycles</span>
      </div>

      {/* Risk Scores */}
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Risk Score</div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskData} {...chartCommon}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="cycle" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {zoneIds.map((id, i) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={zoneNames[id]}
                  stroke={ZONE_COLORS[i % ZONE_COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rainfall */}
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Rainfall (mm/hr)</div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rainfallData} {...chartCommon}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="cycle" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {zoneIds.map((id, i) => (
                <Area
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={zoneNames[id]}
                  stroke={ZONE_COLORS[i % ZONE_COLORS.length]}
                  fill={ZONE_COLORS[i % ZONE_COLORS.length]}
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* River Levels */}
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-semibold">River Levels (m)</div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riverData} {...chartCommon}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="cycle" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {riverIds.map((id, i) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={riverNames[id]}
                  stroke={ZONE_COLORS[i % ZONE_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
