import React, { useState } from "react";
import { SearchSection } from "./components/SearchSection";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";

// Mock weather data for demonstration
const mockWeatherData = {
  bacoor: {
    city: "Bacoor City",
    temperature: 30,
    condition: "Mostly Cloudy",
    hourly: [
      { time: "Now", temp: 30, icon: "cloud" },
      { time: "3 PM", temp: 31, icon: "cloud" },
      { time: "4 PM", temp: 30, icon: "cloud-rain" },
      { time: "5 PM", temp: 29, icon: "cloud-rain" },
      { time: "6 PM", temp: 28, icon: "cloud" },
      { time: "7 PM", temp: 27, icon: "cloud" },
      { time: "8 PM", temp: 26, icon: "moon" },
      { time: "9 PM", temp: 26, icon: "moon" },
      { time: "10 PM", temp: 25, icon: "moon" },
      { time: "11 PM", temp: 25, icon: "moon" },
    ],
  },
  london: {
    city: "London",
    temperature: 12,
    condition: "Rainy",
    hourly: [
      { time: "Now", temp: 12, icon: "cloud-rain" },
      { time: "3 PM", temp: 13, icon: "cloud-rain" },
      { time: "4 PM", temp: 13, icon: "cloud-rain" },
      { time: "5 PM", temp: 12, icon: "cloud" },
      { time: "6 PM", temp: 11, icon: "cloud" },
      { time: "7 PM", temp: 10, icon: "cloud" },
      { time: "8 PM", temp: 10, icon: "moon" },
      { time: "9 PM", temp: 9, icon: "moon" },
      { time: "10 PM", temp: 9, icon: "moon" },
      { time: "11 PM", temp: 8, icon: "moon" },
    ],
  },
  tokyo: {
    city: "Tokyo",
    temperature: 18,
    condition: "Sunny",
    hourly: [
      { time: "Now", temp: 18, icon: "sun" },
      { time: "3 PM", temp: 19, icon: "sun" },
      { time: "4 PM", temp: 19, icon: "sun" },
      { time: "5 PM", temp: 18, icon: "sun" },
      { time: "6 PM", temp: 17, icon: "cloud-sun" },
      { time: "7 PM", temp: 16, icon: "moon" },
      { time: "8 PM", temp: 15, icon: "moon" },
      { time: "9 PM", temp: 14, icon: "moon" },
      { time: "10 PM", temp: 14, icon: "moon" },
      { time: "11 PM", temp: 13, icon: "moon" },
    ],
  },
  "new york": {
    city: "New York",
    temperature: 22,
    condition: "Partly Cloudy",
    hourly: [
      { time: "Now", temp: 22, icon: "cloud-sun" },
      { time: "3 PM", temp: 23, icon: "cloud-sun" },
      { time: "4 PM", temp: 23, icon: "cloud-sun" },
      { time: "5 PM", temp: 22, icon: "cloud" },
      { time: "6 PM", temp: 21, icon: "cloud" },
      { time: "7 PM", temp: 20, icon: "cloud" },
      { time: "8 PM", temp: 19, icon: "moon" },
      { time: "9 PM", temp: 18, icon: "moon" },
      { time: "10 PM", temp: 17, icon: "moon" },
      { time: "11 PM", temp: 17, icon: "moon" },
    ],
  },
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cityKey = city.toLowerCase();
    const data = mockWeatherData[cityKey];

    if (data) {
      setWeatherData(data);
      setLoading(false);
    } else {
      setError("City Not Found");
      setWeatherData(null);
      setLoading(false);
    }
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
