export interface Zone {
  id: string;
  name: string;
  risk: 'safe' | 'moderate' | 'high';
  riskScore: number;
  population: number;
  predictedFloodTime: string;
  lat: number;
  lng: number;
  riverLevel: number;
  rainfall: number;
}

export interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'critical' | 'info';
  timestamp: string;
  zone: string;
}

export interface Notification {
  id: string;
  recipient: string;
  recipientType: 'official' | 'villager';
  channel: 'sms' | 'whatsapp';
  message: string;
  status: 'sent' | 'delivered' | 'pending';
  timestamp: string;
}

export const zones: Zone[] = [
  { id: 'zone-a', name: 'Patna North', risk: 'high', riskScore: 87, population: 245000, predictedFloodTime: '4-6 hours', lat: 25.62, lng: 85.13, riverLevel: 8.2, rainfall: 120 },
  { id: 'zone-b', name: 'Muzaffarpur', risk: 'high', riskScore: 82, population: 393000, predictedFloodTime: '6-8 hours', lat: 26.12, lng: 85.39, riverLevel: 7.8, rainfall: 95 },
  { id: 'zone-c', name: 'Darbhanga', risk: 'moderate', riskScore: 58, population: 296000, predictedFloodTime: '12-18 hours', lat: 26.15, lng: 85.90, riverLevel: 5.4, rainfall: 60 },
  { id: 'zone-d', name: 'Bhagalpur', risk: 'moderate', riskScore: 45, population: 410000, predictedFloodTime: '24+ hours', lat: 25.24, lng: 86.97, riverLevel: 4.1, rainfall: 40 },
  { id: 'zone-e', name: 'Saharsa', risk: 'high', riskScore: 91, population: 150000, predictedFloodTime: '2-4 hours', lat: 25.88, lng: 86.60, riverLevel: 9.1, rainfall: 140 },
  { id: 'zone-f', name: 'Begusarai', risk: 'safe', riskScore: 22, population: 250000, predictedFloodTime: 'No threat', lat: 25.42, lng: 86.13, riverLevel: 2.3, rainfall: 15 },
  { id: 'zone-g', name: 'Munger', risk: 'safe', riskScore: 18, population: 190000, predictedFloodTime: 'No threat', lat: 25.37, lng: 86.47, riverLevel: 2.0, rainfall: 10 },
];

export const alerts: Alert[] = [
  { id: 'a1', message: 'River level rising critically in Saharsa — breach expected in 2 hours', type: 'critical', timestamp: '2 min ago', zone: 'zone-e' },
  { id: 'a2', message: 'Heavy rainfall predicted in Patna North within 2 hours', type: 'warning', timestamp: '5 min ago', zone: 'zone-a' },
  { id: 'a3', message: 'Evacuation initiated in Muzaffarpur Zone B', type: 'critical', timestamp: '8 min ago', zone: 'zone-b' },
  { id: 'a4', message: 'Water level stable in Begusarai — monitoring continues', type: 'info', timestamp: '12 min ago', zone: 'zone-f' },
  { id: 'a5', message: 'Dam release upstream — flow increase expected in Darbhanga', type: 'warning', timestamp: '15 min ago', zone: 'zone-c' },
  { id: 'a6', message: 'Road NH-57 submerged near Saharsa — alternate routes activated', type: 'critical', timestamp: '18 min ago', zone: 'zone-e' },
  { id: 'a7', message: 'Rainfall intensity decreasing in Bhagalpur sector', type: 'info', timestamp: '22 min ago', zone: 'zone-d' },
  { id: 'a8', message: 'Embankment stress detected at Kosi Barrage — engineers deployed', type: 'warning', timestamp: '25 min ago', zone: 'zone-e' },
];

export const notifications: Notification[] = [
  { id: 'n1', recipient: 'DM Saharsa', recipientType: 'official', channel: 'sms', message: 'URGENT: River breach imminent in Zone E. Initiate Level-3 evacuation protocol immediately.', status: 'delivered', timestamp: '1 min ago' },
  { id: 'n2', recipient: 'Block Officer Muzaffarpur', recipientType: 'official', channel: 'whatsapp', message: 'Evacuation vehicles dispatched to Block-7. ETA: 45 minutes. Coordinate with local police.', status: 'delivered', timestamp: '3 min ago' },
  { id: 'n3', recipient: 'Village Head - Rampur', recipientType: 'villager', channel: 'sms', message: 'बाढ़ चेतावनी: 2 घंटे में पानी बढ़ सकता है। कृपया ऊंचे स्थान पर जाएं। हेल्पलाइन: 1800-XXX-XXXX', status: 'delivered', timestamp: '5 min ago' },
  { id: 'n4', recipient: 'Residents - Patna North', recipientType: 'villager', channel: 'whatsapp', message: 'Flood Alert: Heavy rain expected. Move valuables to higher floors. Relief camp at Gandhi Maidan.', status: 'sent', timestamp: '7 min ago' },
  { id: 'n5', recipient: 'NDRF Team Alpha', recipientType: 'official', channel: 'sms', message: 'Deploy to Saharsa immediately. 3 boats + 15 personnel required. Coordinate with local admin.', status: 'pending', timestamp: '9 min ago' },
  { id: 'n6', recipient: 'Village Head - Kesaria', recipientType: 'villager', channel: 'sms', message: 'Water level rising. Take shelter at nearest school building. Emergency number: 112', status: 'sent', timestamp: '11 min ago' },
];

export const riskPrediction = {
  overallRisk: 'Critical',
  affectedPopulation: '1.2M',
  zonesAtRisk: 3,
  confidenceLevel: 94,
  nextUpdate: '15 min',
};

export const evacuationPlan = {
  activePlans: 2,
  peopleToEvacuate: '85,000',
  vehiclesDeployed: 47,
  sheltersOpen: 12,
  routes: ['NH-57 Alt', 'SH-73 North', 'District Road 4'],
};

export const resourceAllocation = {
  ndrf: { teams: 8, deployed: 5 },
  boats: { total: 120, deployed: 78 },
  shelters: { total: 45, active: 12, capacity: '50,000' },
  foodPackets: { total: 200000, distributed: 45000 },
  medicalTeams: { total: 15, deployed: 9 },
};
