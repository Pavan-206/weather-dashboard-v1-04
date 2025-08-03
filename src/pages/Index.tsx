
// Weather Dashboard Home Page

import { WeatherDashboard } from "@/components/WeatherDashboard";

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden select-none">
    {/* Gradient background with theme support */}
    <div className="absolute w-full h-full weather-gradient" />
    
    {/* Animated sun */}
    <div className="absolute top-[-4rem] left-1/2 -translate-x-1/2 sm:left-[15vw] lg:left-[20vw] sm:top-[-6rem] w-64 h-64 sm:w-80 sm:h-80 animate-pulse-slow">
      <svg width="100%" height="100%" viewBox="0 0 320 320" className="drop-shadow-2xl">
        <circle cx="160" cy="160" r="100" fill="url(#sun)" opacity="0.9"/>
        <defs>
          <radialGradient id="sun" r="100%" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.8"/>
            <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    {/* Enhanced animated clouds */}
    <div className="absolute top-[8vh] left-[5vw] md:left-[10vw] animate-cloud-slow">
      <svg width="180" height="85" viewBox="0 0 180 85" className="drop-shadow-lg">
        <ellipse cx="70" cy="45" rx="55" ry="30" fill="hsl(var(--card))" fillOpacity="0.85"/>
        <ellipse cx="115" cy="40" rx="40" ry="25" fill="hsl(var(--card))" fillOpacity="0.75"/>
      </svg>
    </div>
    
    <div className="absolute top-[12vh] right-[10vw] md:right-[15vw] animate-cloud-medium">
      <svg width="140" height="60" viewBox="0 0 140 60" className="drop-shadow-md">
        <ellipse cx="55" cy="30" rx="42" ry="18" fill="hsl(var(--card))" fillOpacity="0.8"/>
        <ellipse cx="90" cy="25" rx="32" ry="15" fill="hsl(var(--card))" fillOpacity="0.65"/>
      </svg>
    </div>
    
    <div className="absolute bottom-[15vh] left-[15vw] md:left-[25vw] animate-cloud-fast">
      <svg width="130" height="50" viewBox="0 0 130 50" className="drop-shadow-sm">
        <ellipse cx="55" cy="25" rx="38" ry="15" fill="hsl(var(--card))" fillOpacity="0.7"/>
        <ellipse cx="90" cy="22" rx="25" ry="12" fill="hsl(var(--card))" fillOpacity="0.5"/>
      </svg>
    </div>
    
    <div className="absolute bottom-[10vh] right-[5vw] md:right-[12vw] animate-cloud-medium">
      <svg width="100" height="40" viewBox="0 0 100 40" className="drop-shadow-sm">
        <ellipse cx="40" cy="22" rx="25" ry="12" fill="hsl(var(--card))" fillOpacity="0.65"/>
        <ellipse cx="70" cy="18" rx="18" ry="10" fill="hsl(var(--card))" fillOpacity="0.45"/>
      </svg>
    </div>
    
    {/* Additional floating clouds for depth */}
    <div className="absolute top-[25vh] left-[60vw] animate-cloud-slow opacity-60">
      <svg width="90" height="35" viewBox="0 0 90 35">
        <ellipse cx="35" cy="18" rx="20" ry="10" fill="hsl(var(--card))" fillOpacity="0.6"/>
        <ellipse cx="60" cy="15" rx="15" ry="8" fill="hsl(var(--card))" fillOpacity="0.4"/>
      </svg>
    </div>
    <style>
    {`
      @keyframes cloud-slow {
        0% { transform: translateX(0px);}
        100% { transform: translateX(30vw);}
      }
      .animate-cloud-slow {
        animation: cloud-slow 65s linear infinite alternate;
      }
      @keyframes cloud-medium {
        0% { transform: translateX(0px);}
        100% { transform: translateX(16vw);}
      }
      .animate-cloud-medium {
        animation: cloud-medium 50s linear infinite alternate;
      }
      @keyframes cloud-fast {
        0% { transform: translateX(0px);}
        100% { transform: translateX(25vw);}
      }
      .animate-cloud-fast {
        animation: cloud-fast 80s linear infinite alternate;
      }
    `}
    </style>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-start justify-center relative overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-6xl px-2 md:px-4">
        <WeatherDashboard />
      </div>
    </div>
  );
};

export default Index;

