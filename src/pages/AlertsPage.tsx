import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, CheckCheck, Check, Clock, Send, Users, Shield as ShieldIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import { notifications } from '@/data/mockData';
import type { Notification } from '@/data/mockData';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'sms' | 'whatsapp'>('all');
  const [visibleNotifs, setVisibleNotifs] = useState<Notification[]>([]);

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter((n) => n.channel === activeTab);

  // Simulate notifications appearing one by one
  useEffect(() => {
    setVisibleNotifs([]);
    filtered.forEach((_, i) => {
      setTimeout(() => {
        setVisibleNotifs((prev) => [...prev, filtered[i]]);
      }, i * 300);
    });
  }, [activeTab]);

  const statusIcon = (status: string) => {
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-primary" />;
    if (status === 'sent') return <Check className="w-3 h-3 text-muted-foreground" />;
    return <Clock className="w-3 h-3 text-warning" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
        <button onClick={() => navigate('/dashboard')} className="glass-card p-2 rounded-lg hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Logo size="sm" />
        <div className="h-5 w-px bg-border" />
        <h1 className="text-sm font-semibold">Alerts & Notifications</h1>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Sent', value: notifications.length, icon: Send, color: 'text-primary' },
            { label: 'Officials', value: notifications.filter((n) => n.recipientType === 'official').length, icon: ShieldIcon, color: 'text-warning' },
            { label: 'Villagers', value: notifications.filter((n) => n.recipientType === 'villager').length, icon: Users, color: 'text-success' },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 text-center"
            >
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <div className="text-2xl font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'sms', 'whatsapp'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary/10 text-primary glow-border'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5" /> : tab === 'sms' ? <Phone className="w-3.5 h-3.5" /> : null}
              {tab === 'all' ? 'All' : tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Notification Feed */}
        <div className="space-y-3">
          <AnimatePresence>
            {visibleNotifs.map((notif) => (
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
                        <span className={`uppercase font-bold tracking-wider ${
                          notif.channel === 'whatsapp' ? 'text-success' : 'text-primary'
                        }`}>
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

                {/* Message bubble */}
                <div className={`ml-10 p-3 rounded-lg rounded-tl-sm text-sm leading-relaxed ${
                  notif.channel === 'whatsapp'
                    ? 'bg-success/5 border border-success/15'
                    : 'bg-primary/5 border border-primary/15'
                }`}>
                  {notif.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
