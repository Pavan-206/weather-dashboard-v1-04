import React from "react";
import { CloudRain, CloudSun, CloudMoon, Cloud, CloudSnow } from "lucide-react";

function getWeatherIcon(desc: string, isDay: boolean) {
  if (desc.includes("rain")) return <CloudRain className="text-blue-400" size={28} />;
  if (desc.includes("snow")) return <CloudSnow className="text-blue-200" size={28} />;
  if (desc.includes("cloud")) return isDay ? <CloudSun className="text-accent" size={28} /> : <CloudMoon className="text-muted-foreground" size={28} />;
  if (desc.includes("clear")) return isDay ? <CloudSun className="text-accent" size={28} /> : <CloudMoon className="text-muted-foreground" size={28} />;
  return <Cloud className="text-blue-400" size={28} />;
}

interface HourlyForecastProps {
  forecast: any[];
  timezone: number;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, timezone }) => {
  const hourlyData = forecast.slice(0, 6).map((item, index) => {
    const time = new Date(item.dt * 1000);
    const utcTime = time.getTime() + (time.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (timezone * 1000));
    const hour = localTime.getHours();
    const isDay = hour >= 6 && hour < 19;
    
    return {
      time: index === 0 ? "Now" : localTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      }),
      temp: Math.round(item.main.temp),
      desc: item.weather[0].description,
      isDay,
      precipitation: Math.round((item.pop || 0) * 100)
    };
  });

  return (
    <div className="weather-card-glass rounded-3xl p-6 w-full max-w-3xl mx-auto mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <CloudRain className="h-5 w-5 text-weather-text-muted" />
        <h3 className="text-lg font-semibold text-weather-text">Six Hour Outlook</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {hourlyData.map((hour, index) => (
          <div 
            key={index}
            className="flex flex-col items-center min-w-[80px] hover:scale-110 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-sm text-weather-text-muted mb-2 font-medium">
              {hour.time}
            </div>
            <div className="mb-3 hover:scale-110 transition-transform duration-300">
              {getWeatherIcon(hour.desc, hour.isDay)}
            </div>
            {hour.precipitation > 0 && (
              <div className="text-xs text-blue-400 mb-1">
                {hour.precipitation}%
              </div>
            )}
            <div className="text-lg font-bold text-weather-text">
              {hour.temp}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};