import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Send } from 'lucide-react';

interface AutoAlertTickerProps {
  isActive: boolean;
  alerts: Array<{ id: string; message: string; type: string }>;
}

interface SentAlert {
  id: string;
  channel: 'sms' | 'whatsapp';
  recipient: string;
  message: string;
  timestamp: number;
}

const recipients = [
  { name: 'DM Saharsa', type: 'sms' as const },
  { name: 'SDO Darbhanga', type: 'whatsapp' as const },
  { name: 'NDRF Unit 6', type: 'sms' as const },
  { name: 'Village Head, Rampur', type: 'whatsapp' as const },
  { name: 'Block Dev Officer', type: 'sms' as const },
  { name: 'Relief Coordinator', type: 'whatsapp' as const },
];

const AutoAlertTicker = ({ isActive, alerts }: AutoAlertTickerProps) => {
  const [sentAlerts, setSentAlerts] = useState<SentAlert[]>([]);

  useEffect(() => {
    if (!isActive || alerts.length === 0) return;
    const interval = setInterval(() => {
      const alert = alerts[Math.floor(Math.random() * Math.min(3, alerts.length))];
      const recipient = recipients[Math.floor(Math.random() * recipients.length)];
      if (!alert) return;
      setSentAlerts((prev) => [{
        id: `sent-${Date.now()}`,
        channel: recipient.type,
        recipient: recipient.name,
        message: alert.message.slice(0, 60) + '...',
        timestamp: Date.now(),
      }, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [isActive, alerts]);

  if (sentAlerts.length === 0) return null;

  return (
    <motion.div layout className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Send className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Auto-Alerts</h3>
        {isActive && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-success/15 text-success font-bold animate-pulse">SENDING</span>}
      </div>
      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {sentAlerts.map((sa) => (
            <motion.div
              key={sa.id}
              initial={{ opacity: 0, height: 0, x: -10 }}
              animate={{ opacity: 1, height: 'auto', x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 text-[10px] p-2 rounded-lg bg-muted/30"
            >
              {sa.channel === 'whatsapp'
                ? <MessageSquare className="w-3 h-3 text-success shrink-0 mt-0.5" />
                : <Phone className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              }
              <div className="min-w-0">
                <span className="font-semibold text-foreground">{sa.recipient}</span>
                <p className="text-muted-foreground truncate">{sa.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AutoAlertTicker;
