const WaterBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(hsl(190 80% 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 80% 45%) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}
    />
    {/* Radial glow */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
      style={{ background: 'radial-gradient(circle, hsl(190 80% 45% / 0.15), transparent 70%)' }}
    />
    {/* Water wave layers */}
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute bottom-0 left-0 right-0 animate-water"
        style={{
          height: `${150 + i * 40}px`,
          animationDelay: `${i * 1.5}s`,
          opacity: 0.04 - i * 0.01,
          background: `linear-gradient(180deg, transparent, hsl(190 80% 45% / ${0.08 - i * 0.02}))`,
          borderRadius: '50% 50% 0 0',
          transform: `translateY(${i * 20}px)`,
        }}
      />
    ))}
    {/* Floating particles */}
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={`p-${i}`}
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          background: 'hsl(190 80% 60%)',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: 3 + Math.random() * 4 + 's',
        }}
      />
    ))}
  </div>
);

export default WaterBackground;
