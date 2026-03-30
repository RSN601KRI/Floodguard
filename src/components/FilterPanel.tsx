import { MapPin, Droplets, Waves, Bell } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const districts = ['All Districts', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Saharsa', 'Begusarai', 'Munger'];
const zonesList = ['All Zones', 'Patna North', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Saharsa', 'Begusarai', 'Munger'];

export default function FilterPanel() {
  const { filters, setFilters } = useAppContext();

  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5" />
        Filters & Configuration
      </h3>

      {/* Region Selectors */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">State</label>
          <select
            value={filters.state}
            onChange={(e) => setFilters({ state: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-foreground"
          >
            <option>Bihar</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">District</label>
          <select
            value={filters.district}
            onChange={(e) => setFilters({ district: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-foreground"
          >
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">Zone</label>
          <select
            value={filters.zone}
            onChange={(e) => setFilters({ zone: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-foreground"
          >
            {zonesList.map((z) => <option key={z}>{z}</option>)}
          </select>
        </div>
      </div>

      {/* Sensitivity Sliders */}
      <div className="space-y-3">
        <SliderControl
          icon={<Droplets className="w-3 h-3" />}
          label="Rainfall Sensitivity"
          value={filters.rainfallSensitivity}
          onChange={(v) => setFilters({ rainfallSensitivity: v })}
        />
        <SliderControl
          icon={<Waves className="w-3 h-3" />}
          label="River Level Threshold"
          value={filters.riverThreshold}
          onChange={(v) => setFilters({ riverThreshold: v })}
        />
        <SliderControl
          icon={<Bell className="w-3 h-3" />}
          label="Alert Urgency"
          value={filters.alertUrgency}
          onChange={(v) => setFilters({ alertUrgency: v })}
        />
      </div>
    </div>
  );
}

function SliderControl({ icon, label, value, onChange }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
          {icon} {label}
        </span>
        <span className="text-[10px] font-mono text-foreground">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
      />
    </div>
  );
}
