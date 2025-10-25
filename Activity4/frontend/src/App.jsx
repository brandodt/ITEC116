import React, { useState } from "react";
import { SearchSection } from "./components/SearchSection";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/weather/${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.error) {
        setError("City Not Found");
        setWeatherData(null);
      } else {
        setWeatherData(data);
      }
    } catch (e) {
      setError("Failed to fetch weather");
      setWeatherData(null);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1A1A1A] rounded-lg p-8 shadow-2xl">
        <SearchSection onSearch={handleSearch} disabled={loading} />
        <div className="mt-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : weatherData ? (
            <>
              <CurrentWeather
                city={weatherData.city}
                temperature={weatherData.temperature}
                condition={weatherData.condition}
              />
              <HourlyForecast hourly={weatherData.hourly} />
            </>
          ) : (
            <div className="text-center py-16 text-[#666666]">
              Enter a city name to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
