
import React, { useState, useEffect, useCallback } from "react";
import { WeatherSearch } from "./WeatherSearch";
import { WeatherCard } from "./WeatherCard";
import { ForecastCard } from "./ForecastCard";
import { FavoritesBar } from "./FavoritesBar";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherAlerts } from "./WeatherAlerts";
import { HourlyForecast } from "./HourlyForecast";
import { toast } from "@/hooks/use-toast";

// You MUST SET your OpenWeatherMap API key here:
const OPENWEATHERMAP_API_KEY = "02ec4e4dfebcc6f0e7c990e801d3575d";
const AIR_QUALITY_API_KEY = "668e53569f1cc1c348c50d5b13c5add7bcf2bcb3";

function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

// https://openweathermap.org/api/one-call-3
// We'll fetch current weather and forecast by city name.
async function fetchWeather(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

async function fetchAirQuality(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error getting air quality");
  return res.json();
}

async function fetchForecast(city: string) {
  // Forecast API needs coordinates
  const weather = await fetchWeather(city);
  const { coord } = weather;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const res = await fetch(forecastUrl);
  if (!res.ok) throw new Error("Error getting forecast");
  const forecast = await res.json();
  
  // Also fetch air quality
  let airQuality = null;
  try {
    airQuality = await fetchAirQuality(coord.lat, coord.lon);
  } catch (e) {
    // Air quality data unavailable - silently continue
  }
  
  return { forecast, weather, airQuality };
}

// Extract one forecast per day (pick midday as "daily" marker)
function reduceForecastList(list: any[]) {
  const daily: any[] = [];
  const grouped: Record<string, any[]> = {};
  list.forEach((entry) => {
    const day = entry.dt_txt.split(" ")[0];
    grouped[day] = grouped[day] || [];
    grouped[day].push(entry);
  });
  Object.keys(grouped).forEach((day) => {
    // Pick closest to midday
    const midday =
      grouped[day].reduce((prev, curr) =>
        Math.abs(new Date(curr.dt_txt).getHours() - 12) <
        Math.abs(new Date(prev.dt_txt).getHours() - 12)
          ? curr
          : prev
      );
    daily.push(midday);
  });
  // Return next 5 days
  return daily.slice(0, 5);
}

function getLocalDay(tsUtc: number, timezone: number) {
  const date = new Date((tsUtc + timezone) * 1000);
  return date
    .toLocaleDateString(undefined, { weekday: "short" });
}

export const WeatherDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [airQuality, setAirQuality] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherFavorites") || "[]");
    } catch {
      return [];
    }
  });

  const saveFavorites = (list: string[]) => {
    localStorage.setItem("weatherFavorites", JSON.stringify(list));
    setFavorites(list);
  };

  const handleSearch = useCallback(async (city: string) => {
    setLoading(true);
    try {
      const { forecast: fc, weather, airQuality: aq } = await fetchForecast(city);
      setCurrent(weather);
      setForecast(reduceForecastList(fc.list));
      setHourlyForecast(fc.list.slice(0, 24)); // Get 24 hours of forecast
      setAirQuality(aq);
    } catch (err: any) {
      setCurrent(null);
      setForecast([]);
      setHourlyForecast([]);
      setAirQuality(null);
      toast({
        title: "Error fetching weather",
        description: err.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFavorite = useCallback(() => {
    if (!current) return;
    const city = current.name;
    if (favorites.includes(city)) {
      saveFavorites(favorites.filter((c) => c !== city));
    } else {
      saveFavorites([...favorites, city]);
      toast({ title: "Added to favorites", description: city + " added." });
    }
  }, [current, favorites]);

  const handleSelectFavorite = (city: string) => {
    handleSearch(city);
  };

  const handleRemoveFavorite = (city: string) => {
    saveFavorites(favorites.filter((c) => c !== city));
  };

  // On mount, load last searched city OR favorite
  useEffect(() => {
    if (favorites.length > 0) {
      handleSearch(favorites[0]);
    }
  // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full px-4 pb-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 mt-6 text-center text-weather-text tracking-tight animate-scale-in">
        Weather Dashboard
      </h1>
      <div className="text-center mb-6 text-weather-text-muted text-lg">
        Get real-time weather &amp; 5-day forecast for any city.
      </div>
      <WeatherSearch onSearch={handleSearch} loading={loading} />

      <FavoritesBar
        favorites={favorites}
        onSelect={handleSelectFavorite}
        onRemove={handleRemoveFavorite}
      />

      {current && (
        <WeatherCard
          data={current}
          isFavorite={favorites.includes(current.name)}
          onFavorite={handleFavorite}
        />
      )}

      {current && (
        <WeatherAlerts 
          data={current} 
          airQuality={airQuality} 
        />
      )}

      {hourlyForecast.length > 0 && current && (
        <HourlyForecast 
          forecast={hourlyForecast} 
          timezone={current.timezone} 
        />
      )}

      {current && (
        <WeatherDetails 
          data={current} 
          airQuality={airQuality} 
        />
      )}

      {forecast.length > 0 && current && (
        <div className="animate-fade-in">
          <div className="text-2xl font-semibold text-weather-text mb-4 text-center">
            5-Day Forecast
          </div>
          <div className="flex overflow-x-auto pb-4 w-full max-w-4xl mx-auto gap-2 md:gap-4">
            {forecast.map((day, idx) => (
              <ForecastCard
                key={day.dt}
                day={getLocalDay(day.dt, current.timezone)}
                desc={day.weather[0].description}
                isDay={(() => {
                  const hour = new Date((day.dt + current.timezone) * 1000).getUTCHours();
                  return hour >= 6 && hour < 19;
                })()}
                tempMin={day.main.temp_min}
                tempMax={day.main.temp_max}
                humidity={day.main.humidity}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !current && (
        <div className="text-center text-weather-text-muted my-12 text-lg animate-pulse-slow">
          Enter a city to begin.
        </div>
      )}

      <div className="text-xs text-weather-text-muted text-center mt-8">
        Powered by <a className="underline hover:text-weather-primary transition-colors" href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>
      </div>
    </div>
  );
};
