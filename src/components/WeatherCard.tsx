
import React from "react";
import { Cloud, CloudRain, CloudSun, CloudMoon, Star, Wind } from "lucide-react";

interface WeatherCardProps {
  data: any;
  isFavorite: boolean;
  onFavorite: () => void;
}

function getWeatherIcon(desc: string, isDay: boolean) {
  // Choose Lucide icons depending on condition
  if (desc.includes("rain")) return <CloudRain className="text-blue-500" size={48} />;
  if (desc.includes("cloud")) return isDay ? <CloudSun className="text-yellow-400" size={48} /> : <CloudMoon className="text-gray-400" size={48} />;
  if (desc.includes("clear")) return isDay ? <CloudSun className="text-yellow-400" size={48} /> : <CloudMoon className="text-gray-400" size={48} />;
  return <Cloud className="text-blue-400" size={48} />;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  isFavorite,
  onFavorite,
}) => {
  if (!data) return null;
  const {
    name,
    sys: { country },
    main: { temp, humidity },
    weather,
    wind: { speed },
    dt,
    timezone,
  } = data;

  const desc = weather[0].description as string;
  // Determine if it's day at this location:
  const localH = new Date((dt + timezone) * 1000).getUTCHours();
  const isDay = localH >= 6 && localH < 19;
  const displayIcon = getWeatherIcon(desc, isDay);

  return (
    <div className="weather-card-glass shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl mx-auto mb-8 animate-fade-in hover:scale-[1.02] transition-all duration-500 animate-float">
      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full">
        <div className="flex-shrink-0 animate-pulse-slow">{displayIcon}</div>
        <div className="text-center sm:text-left">
          <div className="text-5xl md:text-6xl font-black mb-2 text-weather-text drop-shadow-sm">{Math.round(temp)}°C</div>
          <div className="text-xl md:text-2xl font-bold text-weather-text mb-1">{name}, {country}</div>
          <div className="capitalize text-weather-text-muted text-lg mb-3">{desc}</div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-weather-text-muted">
            <span className="flex items-center justify-center sm:justify-start gap-2" title="Wind Speed">
              <Wind className="h-4 w-4" /> {speed} m/s
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-2" title="Humidity">
              💧 {humidity}%
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onFavorite}
        aria-label="Favorite"
        className="mt-4 sm:mt-0 sm:ml-6 transition-all duration-300 hover:scale-125 active:scale-95 animate-float-delayed"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className={isFavorite ? "fill-accent text-accent drop-shadow-md" : "text-weather-text-muted hover:text-accent"}
          size={42}
        />
      </button>
    </div>
  );
};
