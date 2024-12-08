/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Droplet, 
  Wind, 
  Umbrella, 
  MapPin,
  ThermometerSun,
  Sunset,
  Sunrise
} from 'lucide-react';

import sunAnimation from '../public/lottie/sun.json';
import cloudyAnimation from '../public/lottie/cloudy.json';
import rainAnimation from '../public/lottie/rain.json';
import snowAnimation from '../public/lottie/snow.json';
import stormAnimation from '../public/lottie/storm.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime: string;
}

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  uv: number;
}

interface DailyForecast {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: WeatherCondition;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
}

interface WeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: {
    forecastday: DailyForecast[];
  };
}

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);

  const getWeatherAnimation = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return sunAnimation;
    if (conditionLower.includes('cloudy')) return cloudyAnimation;
    if (conditionLower.includes('rain')) return rainAnimation;
    if (conditionLower.includes('snow')) return snowAnimation;
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return stormAnimation;
    return sunAnimation; // Default
  };

  const getLocation = () => {
    return new Promise<{latitude: number, longitude: number}>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          () => {
            fetch('https://ipapi.co/json/')
              .then(response => response.json())
              .then(data => {
                resolve({
                  latitude: data.latitude,
                  longitude: data.longitude
                });
              })
              .catch(ipError => {
                reject(new Error('Unable to retrieve location'));
              });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const fetchWeatherData = async (locationData?: {latitude: number, longitude: number}) => {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    
    try {
      const useLocation = locationData || location;
      
      if (!useLocation) {
        throw new Error('No location available');
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${useLocation.latitude},${useLocation.longitude}&days=7&alerts=yes`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeWeather = async () => {
      try {
        const locationData = await getLocation();
        setLocation(locationData);
        await fetchWeatherData(locationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to retrieve location');
        setLoading(false);
      }
    };

    initializeWeather();
  }, []);

  const LoadingComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A30] to-[#1A3557] flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0B1A30]/50 via-[#1A3557]/30 to-transparent opacity-50 animate-pulse"></div>
      <div className="text-center z-10">
        <div className="relative">
          <Lottie 
            animationData={cloudyAnimation} 
            className="w-80 h-80 mx-auto transform scale-110 hover:scale-125 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-white/10 blur-2xl -z-10 animate-blob"></div>
        </div>
        <h2 className="text-3xl text-white font-extralight tracking-widest animate-pulse mt-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Gathering Atmospheric Insights
        </h2>
      </div>
    </div>
  );

  const ErrorComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#4A0E23] to-[#2C0F3D] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A0E23]/50 via-[#2C0F3D]/30 to-transparent opacity-50"></div>
      <div className="text-center z-10 relative">
        <div className="relative">
          <Lottie 
            animationData={stormAnimation} 
            className="w-96 h-96 mx-auto transform hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-white/10 blur-3xl -z-10 animate-blob"></div>
        </div>
        <h2 className="text-5xl text-white font-thin mb-6 tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Atmospheric Disruption
        </h2>
        <p className="text-white text-2xl opacity-80 max-w-2xl mx-auto px-4 drop-shadow-lg">
          {error || 'Unable to decode atmospheric signals'}
        </p>
      </div>
    </div>
  );

  const WeatherDisplay = () => {
    if (!weatherData) return null;

    const current = weatherData.current;
    const forecast = weatherData.forecast.forecastday[0];
    const weatherAnimation = getWeatherAnimation(current.condition.text);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="container mx-auto px-6 py-10">
          {/* Location and Main Weather */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <Lottie 
                animationData={weatherAnimation} 
                className="w-full max-w-md drop-shadow-2xl"
              />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-blue-300 w-6 h-6" />
                <h1 className="text-4xl font-light tracking-wide">
                  {weatherData.location.name}, {weatherData.location.country}
                </h1>
              </div>
              
              <div className="flex items-center space-x-6 mb-6">
                <h2 className="text-9xl font-thin tracking-tighter rounded-full bg-white/10 px-6 py-2">
                  {Math.round(current.temp_c)}°
                </h2>
                <div>
                  <p className="text-3xl font-light tracking-wide">{current.condition.text}</p>
                  <p className="text-xl opacity-75 tracking-wide">
                    Feels like {Math.round(current.feelslike_c)}°
                  </p>
                </div>
              </div>
              
              {/* Detailed Weather Stats */}
              <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <Wind className="text-blue-300 w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-75">Wind</p>
                    <p className="text-lg">{Math.round(current.wind_kph)} km/h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Droplet className="text-blue-300 w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-75">Humidity</p>
                    <p className="text-lg">{current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Umbrella className="text-blue-300 w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-75">Precipitation</p>
                    <p className="text-lg">{current.precip_mm} mm</p>
                  </div>
                </div>
              </div>

              {/* Sunrise and Sunset */}
              <div className="mt-6 flex items-center space-x-6 bg-white/10 backdrop-blur-lg p-4 rounded-3xl">
                <div className="flex items-center space-x-3">
                  <Sunrise className="text-yellow-300 w-6 h-6" />
                  <p className="text-lg">{forecast.astro.sunrise}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Sunset className="text-orange-300 w-6 h-6" />
                  <p className="text-lg">{forecast.astro.sunset}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Mini Cards */}
          <div className="mt-16 grid grid-cols-7 gap-4">
            {weatherData.forecast.forecastday.map((day: DailyForecast, index: number) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-lg p-4 rounded-3xl text-center hover:scale-105 transition-all duration-300 ease-in-out shadow-xl border border-white/10"
              >
                <p className="text-sm opacity-75 tracking-wider mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <Lottie 
                  animationData={getWeatherAnimation(day.day.condition.text)} 
                  className="w-20 h-20 mx-auto"
                />
                <div className="flex justify-center space-x-2 mt-2">
                  <p className="text-lg font-semibold">{Math.round(day.day.maxtemp_c)}°</p>
                  <p className="text-sm opacity-75 self-center">{Math.round(day.day.mintemp_c)}°</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;

  return <WeatherDisplay />;
};

export default WeatherDashboard;
