import React from "react";
import { CloudRain, CloudSun, CloudMoon, Cloud } from "lucide-react";

function getWeatherIcon(desc: string, isDay: boolean) {
  if (desc.includes("rain")) return <CloudRain className="text-primary" size={32} />;
  if (desc.includes("cloud")) return isDay ? <CloudSun className="text-accent" size={32} /> : <CloudMoon className="text-muted-foreground" size={32} />;
  if (desc.includes("clear"))
    return isDay ? <CloudSun className="text-accent" size={32} /> : <CloudMoon className="text-muted-foreground" size={32} />;
  return <Cloud className="text-primary" size={32} />;
}

interface ForecastCardProps {
  day: string;
  desc: string;
  isDay: boolean;
  tempMin: number;
  tempMax: number;
  humidity: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  desc,
  isDay,
  tempMin,
  tempMax,
  humidity,
}) => (
  <div className="flex flex-col items-center weather-card-glass rounded-3xl p-4 md:p-5 w-36 md:w-40 min-w-[8rem] md:min-w-[9rem] shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in hover:scale-110 hover:-translate-y-2 animate-float group">
    <div className="text-base md:text-lg font-bold mb-2 text-weather-text group-hover:text-weather-primary transition-colors">{day}</div>
    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">{getWeatherIcon(desc, isDay)}</div>
    <div className="capitalize text-weather-text-muted text-xs md:text-sm mb-2 text-center leading-tight">{desc}</div>
    <div className="text-xl md:text-2xl text-weather-text font-black mb-1">{Math.round(tempMax)}°</div>
    <div className="text-sm md:text-base text-weather-text-muted mb-2">/ {Math.round(tempMin)}°</div>
    <div className="text-xs text-weather-text-muted flex items-center gap-1">💧 {humidity}%</div>
  </div>
);