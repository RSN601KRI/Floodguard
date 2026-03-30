import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, CheckCheck, Check, MessageSquare, Phone, Users, Shield as ShieldIcon, Plus, Calendar } from 'lucide-react';
import { notifications } from '@/data/mockData';
import { useFloodEngine } from '@/hooks/useFloodEngine';
import { useAppContext } from '@/contexts/AppContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Notification } from '@/data/mockData';

const AlertsPage = () => {
  const { systemState, role } = useAppContext();
  const engine = useFloodEngine(systemState !== 'standby', systemState === 'crisis');
  const [activeTab, setActiveTab] = useState<'all' | 'sms' | 'whatsapp' | 'pending'>('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; desc: string; onConfirm: () => void } | null>(null);
  const [sentAlerts, setSentAlerts] = useState<Notification[]>([]);

  const allNotifs = [...sentAlerts, ...notifications];
  const filtered = activeTab === 'all' ? allNotifs
    : activeTab === 'pending' ? allNotifs.filter((n) => n.status === 'pending')
    : allNotifs.filter((n) => n.channel === activeTab);

  const statusIcon = (status: string) => {
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-primary" />;
    if (status === 'sent') return <Check className="w-3 h-3 text-muted-foreground" />;
    return <Clock className="w-3 h-3 text-warning" />;
  };

  const handleSendAlert = () => {
    setConfirmAction({
      title: 'Send Evacuation Alert',
      desc: 'Are you sure you want to send evacuation alerts to all affected zones? This will notify officials and residents via SMS and WhatsApp.',
      onConfirm: () => {
        const newAlert: Notification = {
          id: `n-${Date.now()}`,
          recipient: 'All Zone Officials',
          recipientType: 'official',
          channel: 'sms',
          message: `URGENT: Evacuation advisory issued for high-risk zones. Deploy emergency protocols immediately.`,
          status: 'sent',
          timestamp: 'Just now',
        };
        setSentAlerts((prev) => [newAlert, ...prev]);
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  const handleScheduleAlert = () => {
    setConfirmAction({
      title: 'Schedule Alert',
      desc: 'Schedule this alert to be sent in 30 minutes? The system will automatically dispatch to all registered contacts.',
      onConfirm: () => {
        const newAlert: Notification = {
          id: `n-${Date.now()}`,
          recipient: 'Scheduled Broadcast',
          recipientType: 'official',
          channel: 'whatsapp',
          message: `[SCHEDULED] Flood warning update for monitored zones. Current risk assessment will be included.`,
          status: 'pending',
          timestamp: 'Scheduled +30min',
        };
        setSentAlerts((prev) => [newAlert, ...prev]);
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin flex-1">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Sent', value: allNotifs.length, icon: Send, color: 'text-primary' },
            { label: 'Officials', value: allNotifs.filter((n) => n.recipientType === 'official').length, icon: ShieldIcon, color: 'text-warning' },
            { label: 'Villagers', value: allNotifs.filter((n) => n.recipientType === 'villager').length, icon: Users, color: 'text-success' },
            { label: 'Pending', value: allNotifs.filter((n) => n.status === 'pending').length, icon: Clock, color: 'text-muted-foreground' },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <div className="text-2xl font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        {(role === 'admin' || role === 'field-officer') && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendAlert}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Send Alert
            </button>
            <button
              onClick={handleScheduleAlert}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm font-medium hover:text-primary transition-colors"
            >
              <Calendar className="w-4 h-4" /> Schedule Alert
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'sms', 'whatsapp', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary/10 text-primary glow-border' : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5" /> : tab === 'sms' ? <Phone className="w-3.5 h-3.5" /> : tab === 'pending' ? <Clock className="w-3.5 h-3.5" /> : null}
              {tab === 'all' ? 'All' : tab === 'pending' ? 'Pending' : tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      notif.recipientType === 'official' ? 'bg-warning/10' : 'bg-success/10'
                    }`}>
                      {notif.recipientType === 'official'
                        ? <ShieldIcon className="w-4 h-4 text-warning" />
                        : <Users className="w-4 h-4 text-success" />
                      }
                    </div>
                    <div>
                      <div className="text-sm font-medium">{notif.recipient}</div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className={`uppercase font-bold tracking-wider ${notif.channel === 'whatsapp' ? 'text-success' : 'text-primary'}`}>
                          {notif.channel}
                        </span>
                        <span>•</span>
                        <span>{notif.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {statusIcon(notif.status)}
                    <span className="text-muted-foreground capitalize">{notif.status}</span>
                  </div>
                </div>
                <div className={`ml-10 p-3 rounded-lg rounded-tl-sm text-sm leading-relaxed ${
                  notif.channel === 'whatsapp' ? 'bg-success/5 border border-success/15' : 'bg-primary/5 border border-primary/15'
                }`}>
                  {notif.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {confirmAction && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={confirmAction.title}
          description={confirmAction.desc}
          confirmLabel="Send"
          onConfirm={confirmAction.onConfirm}
        />
      )}
    </div>
  );
};

export default AlertsPage;
