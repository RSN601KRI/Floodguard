import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Zone } from '@/data/mockData';

interface FloodMapProps {
  zones: Zone[];
  onZoneSelect: (zone: Zone) => void;
  simulateMode: boolean;
}

const riskColors = {
  safe: '#22c55e',
  moderate: '#eab308',
  high: '#ef4444',
};

const FloodMap = ({ zones, onZoneSelect, simulateMode }: FloodMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [25.6, 85.9],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers/circles
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    zones.forEach((zone) => {
      const effectiveRisk = simulateMode && zone.risk === 'moderate' ? 'high' : zone.risk;
      const color = riskColors[effectiveRisk];
      const radius = effectiveRisk === 'high' ? 18000 : effectiveRisk === 'moderate' ? 14000 : 10000;

      // Outer glow
      L.circle([zone.lat, zone.lng], {
        radius: radius * 1.3,
        color: color,
        fillColor: color,
        fillOpacity: 0.08,
        weight: 0,
      }).addTo(map);

      // Main circle
      const circle = L.circle([zone.lat, zone.lng], {
        radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 1.5,
        opacity: 0.6,
      }).addTo(map);

      // Label
      const label = L.divIcon({
        className: 'zone-label',
        html: `<div style="
          background: rgba(15,20,30,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid ${color}40;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          color: ${color};
          white-space: nowrap;
          font-family: Inter, sans-serif;
          text-align: center;
          pointer-events: none;
        ">
          ${zone.name}<br/>
          <span style="font-size:9px;opacity:0.7;font-weight:400;">Risk: ${zone.riskScore}%</span>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, -20],
      });

      L.marker([zone.lat, zone.lng], { icon: label }).addTo(map);

      circle.on('click', () => onZoneSelect(zone));
    });
  }, [zones, onZoneSelect, simulateMode]);

  return (
    <div ref={mapRef} className="w-full h-full" style={{ background: 'hsl(220 20% 6%)' }} />
  );
};

export default FloodMap;
