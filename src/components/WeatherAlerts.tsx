import React from "react";
import { AlertTriangle, Info, Wind, Thermometer } from "lucide-react";

interface WeatherAlertsProps {
  data: any;
  airQuality?: any;
}

const generateWeatherAlerts = (data: any, airQuality?: any) => {
  const alerts = [];
  const { main, wind, weather } = data;
  const aqi = airQuality?.list?.[0]?.main?.aqi || 1;

  // Temperature alerts
  if (main.temp > 35) {
    alerts.push({
      type: "warning",
      icon: <Thermometer className="h-4 w-4" />,
      title: "High Temperature Alert",
      message: "Very hot weather. Stay hydrated and avoid prolonged sun exposure."
    });
  }
  
  if (main.temp < 5) {
    alerts.push({
      type: "warning",
      icon: <Thermometer className="h-4 w-4" />,
      title: "Cold Weather Alert",
      message: "Very cold conditions. Dress warmly and protect exposed skin."
    });
  }

  // Wind alerts
  if (wind?.speed > 10) {
    alerts.push({
      type: "warning",
      icon: <Wind className="h-4 w-4" />,
      title: "Strong Wind Advisory",
      message: `Wind speeds of ${Math.round(wind.speed * 3.6)} km/h. Secure loose objects.`
    });
  }

  // Air quality alerts
  if (aqi >= 3) {
    alerts.push({
      type: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Air Quality Alert",
      message: "Poor air quality. Limit outdoor activities if sensitive to pollution."
    });
  }

  // Weather condition alerts
  if (weather[0].main === "Rain" || weather[0].main === "Thunderstorm") {
    alerts.push({
      type: "info",
      icon: <Info className="h-4 w-4" />,
      title: "Rain Advisory",
      message: "Wet conditions expected. Drive carefully and carry an umbrella."
    });
  }

  return alerts;
};

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ data, airQuality }) => {
  const alerts = generateWeatherAlerts(data, airQuality);

  if (alerts.length === 0) return null;

  return (
    <div className="weather-card-glass rounded-3xl p-6 w-full max-w-3xl mx-auto mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-weather-text">Weather Alerts</h3>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className={`flex items-start gap-3 p-4 rounded-2xl animate-scale-in ${
              alert.type === 'warning' 
                ? 'bg-yellow-500/10 border border-yellow-500/20' 
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`mt-0.5 ${
              alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
            }`}>
              {alert.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-weather-text text-sm mb-1">
                {alert.title}
              </h4>
              <p className="text-weather-text-muted text-xs">
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};