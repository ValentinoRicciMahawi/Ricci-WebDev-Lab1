import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(5);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const API_KEY = '537c75019e524fb69db63915252011';

  const validateDays = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 14) {
      return false;
    }
    return true;
  };

  const getWeatherForecast = async () => {
    setError('');
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    if (!validateDays(days)) {
      setError('Please enter a valid number of days (1-14)');
      return;
    }

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}`;
      const response = await axios.get(url);
      
      setWeather(response.data.current);
      setForecast(response.data.forecast.forecastday);
      
      // Add to history if not already exists
      if (!history.includes(city)) {
        setHistory(prevHistory => [...prevHistory, city]);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('City not found. Please check the city name.');
      } else {
        setError('An error occurred while fetching weather data.');
      }
      setWeather(null);
      setForecast([]);
    }
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    setDays(value);
    
    if (value && !validateDays(value)) {
      setError('Days must be between 1 and 14');
    } else {
      setError('');
    }
  };

  const getWeatherIcon = (condition) => {
    const weatherIcons = {
      'Sunny': '☀️',
      'Clear': '🌙',
      'Partly cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Mist': '🌫️',
      'Patchy rain possible': '🌦️',
      'Patchy snow possible': '🌨️',
      'Patchy sleet possible': '🌨️',
      'Patchy freezing drizzle possible': '🌨️',
      'Thundery outbreaks possible': '⛈️',
      'Light rain': '🌧️',
      'Moderate rain': '🌧️',
      'Heavy rain': '🌧️',
      'Light snow': '🌨️',
      'Moderate snow': '🌨️',
      'Heavy snow': '🌨️',
    };
    
    return weatherIcons[condition] || '🌈';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🌤️ Weather Forecast App
        </h1>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                City Name
              </label>
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getWeatherForecast()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Forecast Days (1-14)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={handleDaysChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={getWeatherForecast}
            className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          >
            Get Weather Forecast
          </button>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Current Weather */}
        {weather && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Current Weather in {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-4xl mb-2">{getWeatherIcon(weather.condition.text)}</p>
                <p className="text-gray-600 text-sm">{weather.condition.text}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{weather.temp_c}°C</p>
                <p className="text-gray-600 text-sm">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-700">{weather.humidity}%</p>
                <p className="text-gray-600 text-sm">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-700">{weather.wind_kph} km/h</p>
                <p className="text-gray-600 text-sm">Wind Speed</p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {days}-Day Weather Forecast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300 hover:border-blue-400"
                >
                  <div className="text-center mb-3">
                    <p className="font-semibold text-gray-800 text-lg">
                      {new Date(day.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-gray-500 text-sm">{day.date}</p>
                  </div>
                  
                  <div className="text-center mb-3">
                    <p className="text-5xl mb-2">
                      {getWeatherIcon(day.day.condition.text)}
                    </p>
                    <p className="text-gray-600 font-medium">
                      {day.day.condition.text}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-semibold text-red-500">
                        {day.day.maxtemp_c}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-semibold text-blue-500">
                        {day.day.mintemp_c}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rain:</span>
                      <span className="font-semibold text-gray-700">
                        {day.day.daily_chance_of_rain}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search History */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📍 Search History
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCity(item);
                    setError('');
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition duration-200 text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHistory([])}
              className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;