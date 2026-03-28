import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Truck, Activity, ArrowRight, Radio } from 'lucide-react';
import Logo from '@/components/Logo';
import WaterBackground from '@/components/WaterBackground';

const features = [
  {
    icon: Activity,
    title: 'Real-time Risk Prediction',
    description: 'AI-powered analysis of river levels, rainfall data, and satellite imagery to predict flood risks hours before they happen.',
  },
  {
    icon: Brain,
    title: 'AI Evacuation Planning',
    description: 'Intelligent route optimization and shelter allocation based on population density, road networks, and real-time conditions.',
  },
  {
    icon: Truck,
    title: 'Resource Allocation Engine',
    description: 'Automated deployment of NDRF teams, boats, medical units, and relief supplies where they are needed most.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <WaterBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs">
            <Radio className="w-3 h-3 text-success animate-pulse" />
            <span className="text-success font-medium">System Online</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium text-primary glow-border">
            <Shield className="w-3.5 h-3.5" />
            AI-Powered Flood Intelligence Platform
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6"
        >
          From Data to Decisions{' '}
          <br />
          <span className="text-gradient">in Flood Crisis</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Real-time flood intelligence powered by AI — protecting millions across Bihar
          with predictive analytics, automated evacuations, and smart resource deployment.
        </motion.p>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-primary transition-all"
        >
          Enter Command Center
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex gap-8 md:gap-16"
        >
          {[
            ['7', 'Zones Monitored'],
            ['1.9M', 'People Protected'],
            ['94%', 'Prediction Accuracy'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-6 pb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-4">
          Intelligence at Every Layer
        </motion.h2>
        <motion.p variants={fadeUp} className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Three AI engines working in concert to transform raw data into life-saving decisions.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card p-8 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:glow-primary transition-all">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        <p>Bihar FloodGuard — Disaster Intelligence System • Built for Crisis Response</p>
      </footer>
    </div>
  );
};

export default Landing;
