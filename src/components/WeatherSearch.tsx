
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch, loading }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="relative mb-8">
      <ThemeToggle />
      <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl mx-auto animate-scale-in">
        <div className="relative flex-1">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="weather-card-glass pl-12 pr-4 py-4 text-lg font-medium border-2 border-weather-card-border/30 focus:border-weather-primary/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
            disabled={loading}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-weather-text-muted" />
        </div>
        <Button
          type="submit"
          disabled={loading || !city.trim()}
          className="px-6 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-weather-primary hover:bg-weather-primary/90 text-primary-foreground disabled:opacity-50 min-w-[120px]"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>
    </div>
  );
};
