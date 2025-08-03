import React from "react";
import { Eye, Wind, Droplets, Gauge, Sun, Thermometer } from "lucide-react";

interface WeatherDetailsProps {
  data: any;
  airQuality?: any;
}

const getAirQualityColor = (aqi: number) => {
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-500";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  if (aqi <= 300) return "bg-purple-500";
  return "bg-red-800";
};

const getAirQualityText = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const formatSunTime = (timestamp: number, timezone: number) => {
  const date = new Date(timestamp * 1000);
  // Convert UTC timestamp to local timezone
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localTime = new Date(utcTime + (timezone * 1000));
  return localTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

const getUVRecommendation = (uv: number) => {
  if (uv <= 2) return "Low - Safe";
  if (uv <= 5) return "Moderate - Caution";
  if (uv <= 7) return "High - Protection";
  if (uv <= 10) return "Very High - Extra care";
  return "Extreme - Avoid sun";
};

const getHumidityLevel = (humidity: number) => {
  if (humidity < 30) return "Low - Dry";
  if (humidity <= 60) return "Comfortable";
  return "High - Humid";
};

const getWindDirection = (deg: number) => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(deg / 22.5) % 16];
};

const getPressureTrend = (pressure: number) => {
  if (pressure < 1013) return "Low - Stormy";
  if (pressure <= 1020) return "Normal";
  return "High - Clear";
};

const getVisibilityLevel = (visibility: number) => {
  if (visibility < 1000) return "Poor";
  if (visibility < 5000) return "Moderate";
  if (visibility < 10000) return "Good";
  return "Excellent";
};

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, airQuality }) => {
  const {
    main: { temp, feels_like, humidity, pressure },
    wind,
    visibility,
    sys: { sunrise, sunset },
    timezone,
    dt
  } = data;

  // Extract wind speed safely
  const speed = wind?.speed || 0;
  
  const uvIndex = 5; // Mock UV index as OpenWeather free tier doesn't include UV
  const aqi = airQuality?.list?.[0]?.main?.aqi || 1;
  const aqiValue = airQuality?.list?.[0]?.main?.aqi ? Math.floor(aqi * 50) : 25; // Convert 1-5 scale to better range

  // Calculate sun progress with current time
  const currentTime = Math.floor(Date.now() / 1000);
  const localSunrise = sunrise;
  const localSunset = sunset;
  const sunProgress = Math.max(0, Math.min(100, 
    ((currentTime - localSunrise) / (localSunset - localSunrise)) * 100
  ));

  const detailsData = [
    {
      icon: <Sun className="h-6 w-6" />,
      label: "UV Index",
      value: uvIndex.toString(),
      subtitle: getUVRecommendation(uvIndex)
    },
    {
      icon: <Thermometer className="h-6 w-6" />,
      label: "Feels like",
      value: `${Math.round(feels_like)}°`,
      subtitle: `${Math.round(feels_like - temp)}° ${feels_like > temp ? 'warmer' : 'cooler'}`
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      label: "Humidity",
      value: `${humidity}%`,
      subtitle: getHumidityLevel(humidity)
    },
    {
      icon: <Wind className="h-6 w-6" />,
      label: "Wind",
      value: `${Math.round(speed * 3.6)} km/h`,
      subtitle: getWindDirection(wind?.deg || 0)
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      label: "Pressure",
      value: `${pressure} hPa`,
      subtitle: getPressureTrend(pressure)
    },
    {
      icon: <Eye className="h-6 w-6" />,
      label: "Visibility",
      value: `${Math.round(visibility / 1000)} km`,
      subtitle: getVisibilityLevel(visibility)
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto animate-fade-in">
      {/* Air Quality Section */}
      <div className="weather-card-glass rounded-3xl p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-weather-text">Air Quality</h3>
          <span className="text-sm text-weather-text-muted">›</span>
        </div>
        <div className="mb-2">
          <span className="text-2xl font-bold text-weather-text">{getAirQualityText(aqiValue)} </span>
          <span className="text-xl text-weather-text-muted">{aqiValue}</span>
        </div>
        <p className="text-sm text-weather-text-muted mb-4">
          Air quality is suitable for outdoor activity.
        </p>
        <div className="w-full h-2 bg-weather-card-border rounded-full overflow-hidden">
          <div 
            className={`h-full ${getAirQualityColor(aqiValue)} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(aqiValue, 100)}%` }}
          />
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        {detailsData.map((item, index) => (
          <div 
            key={item.label}
            className="weather-card-glass rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-weather-text-muted">{item.icon}</div>
              <span className="text-sm text-weather-text-muted">{item.label}</span>
            </div>
            <div className="text-2xl font-bold text-weather-text mb-1">{item.value}</div>
            {item.subtitle && (
              <div className="text-xs text-weather-text-muted">{item.subtitle}</div>
            )}
          </div>
        ))}
      </div>

      {/* Sunrise/Sunset Section */}
      <div className="weather-card-glass rounded-3xl p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-weather-text-muted" />
            <span className="text-lg font-semibold text-weather-text">Sunrise</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-weather-text-muted" />
            <span className="text-lg font-semibold text-weather-text">Sunset</span>
          </div>
        </div>
        
        <div className="relative mb-4">
          <div className="w-full h-2 bg-weather-card-border rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-accent to-weather-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sunProgress}%` }}
            />
          </div>
          <div 
            className="absolute top-0 w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg transition-all duration-1000 ease-out"
            style={{ left: `calc(${sunProgress}% - 8px)`, top: '-4px' }}
          />
        </div>
        
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-weather-text">
              {formatSunTime(sunrise, timezone)}
            </div>
            <div className="text-sm text-weather-text-muted">Sunrise</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-weather-text">
              {formatSunTime(sunset, timezone)}
            </div>
            <div className="text-sm text-weather-text-muted">Sunset</div>
          </div>
        </div>
      </div>
    </div>
  );
};