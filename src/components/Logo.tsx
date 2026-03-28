import { motion } from 'framer-motion';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 32, md: 40, lg: 56 };
  const s = sizes[size];
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  return (
    <div className="flex items-center gap-2">
      <motion.svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Shield */}
        <path
          d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
          fill="url(#shieldGrad)"
          stroke="hsl(190 80% 45%)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Waves */}
        <path
          d="M12 26c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0"
          stroke="hsl(190 90% 65%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        >
          <animate attributeName="d" dur="2s" repeatCount="indefinite"
            values="M12 26c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0;M12 26c2 2 4 2 6 0s4-2 6 0 4 2 6 0 4-2 6 0;M12 26c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0"
          />
        </path>
        <path
          d="M14 31c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0 3 1.5 5 0"
          stroke="hsl(190 80% 55%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        >
          <animate attributeName="d" dur="2.5s" repeatCount="indefinite"
            values="M14 31c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0 3 1.5 5 0;M14 31c2 1.5 3 1.5 5 0s3-1.5 5 0 3 1.5 5 0 3-1.5 5 0;M14 31c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0 3 1.5 5 0"
          />
        </path>
        <defs>
          <linearGradient id="shieldGrad" x1="24" y1="4" x2="24" y2="48">
            <stop offset="0%" stopColor="hsl(190 80% 45%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(220 20% 8%)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </motion.svg>
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-foreground ${textSizes[size]}`}>
          Bihar <span className="text-gradient">FloodGuard</span>
        </span>
        {size !== 'sm' && (
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Flood Intelligence System
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
