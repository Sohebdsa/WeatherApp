import './App.css'
import SearchIcon from '@mui/icons-material/Search';
import SunnyIcon from '@mui/icons-material/Sunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain'; // for rain
import AcUnitIcon from '@mui/icons-material/AcUnit'; // for snow

import { useEffect, useState } from 'react';
function App() {
  const ApiKey = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  function getWeatherIcon(condition) {
    const iconStyle = { fontSize: 120, color: '#f4e4a6', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))' };

    switch (condition) {
      case 'Clear':
        return <WbSunnyIcon sx={iconStyle} />;
      case 'Clouds':
        return <CloudIcon sx={iconStyle} />;
      case 'Rain':
        return <GrainIcon sx={iconStyle} />;
      case 'Snow':
        return <AcUnitIcon sx={iconStyle} />;
      case 'Drizzle':
        return <GrainIcon sx={iconStyle} />;
      case 'Thunderstorm':
        return <GrainIcon sx={iconStyle} />;
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
        return <CloudIcon sx={iconStyle} />;
      default:
        return <WbSunnyIcon sx={iconStyle} />;
    }
  }


  const searchUrl = async (city) => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${ApiKey}`);
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        setError("City not found. Please try again.");
        setLoading(false);
        return;
      }

      setDisplayData([geoData[0].name]);
      await getData(geoData[0].lat, geoData[0].lon);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getData = async (lat, lon) => {
    try {
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}`);
      const weatherData = await weatherRes.json();

      const visibilityInKm = (weatherData.visibility / 1000).toFixed(1);

      setDisplayData(prev => [
        ...prev,
        {
          humidity: weatherData.main.humidity,
          temp: Math.round(weatherData.main.temp),
          wind: weatherData.wind.speed.toFixed(1),
          visibility: visibilityInKm,
          condition: weatherData.weather[0].main
        }
      ]);
    } catch (err) {
      setError("Failed to fetch weather details.");
      console.error(err);
    }
  }

  useEffect(() => {
    searchUrl(city);
  }, []);

  return (
    <div className="container">
      <div className="innercontainer">
        <div className="nav">
          <h1>Weather</h1>
          <div className="navright">
            <input
              type="text"
              placeholder="Enter City Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUrl(city)}
            />
            <p onClick={() => searchUrl(city)}>
              <SearchIcon className="search-icon" />
            </p>
          </div>
        </div>

        {loading ? (
          <div className="falsesection">
            <h1>Loading weather data...</h1>
          </div>
        ) : error ? (
          <div className="falsesection">
            <h1>{error}</h1>
          </div>
        ) : displayData.length > 1 ? (
          <>
            <div className="section">
              <div className="icon">
                {displayData[1] && getWeatherIcon(displayData[1].condition)}
              </div>
              <h1>{displayData[0]}</h1>
            </div>
            <div className="lastsection">
              <div className="lastp1">
                <div className="box">
                  <p>{displayData[1]?.humidity}%</p>
                  <p><WaterDropIcon />Humidity</p>
                </div>
                <div className="box">
                  <p>{displayData[1]?.temp}°C</p>
                  <p><ThermostatIcon />Temperature</p>
                </div>
              </div>
              <div className="lastp2">
                <div className="box">
                  <p>{displayData[1]?.wind} m/s</p>
                  <p><AirIcon />Wind Speed</p>
                </div>
                <div className="box">
                  <p>{displayData[1]?.visibility} km</p>
                  <p><VisibilityIcon />Visibility</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="falsesection">
            <h1>Enter a city name to get started</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

