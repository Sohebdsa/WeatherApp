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

import { useEffect , useState} from 'react';
function App() { 
  const ApiKey = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState(""); 
  const [displayData, setDisplayData] = useState([]); 

  

function getWeatherIcon(condition) {
  switch (condition) {
    case 'Clear':
      return <WbSunnyIcon sx={{ fontSize: 120, color: 'orange' }} />;
    case 'Clouds':
      return <CloudIcon sx={{ fontSize: 120, color: 'grey' }} />;
    case 'Rain':
      return <GrainIcon sx={{ fontSize: 120, color: 'blue' }} />;
    case 'Snow':
      return <AcUnitIcon sx={{ fontSize: 120, color: 'lightblue' }} />;
    default:
      return <WbSunnyIcon sx={{ fontSize: 120, color: 'orange' }} />;
  }
}


  const searchUrl = async (city) => { 
    const geoRes = await fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${ApiKey}` ); 
    const geoData = await geoRes.json(); 
    // console.log(geoData);
    getData(geoData[0].lat, geoData[0].lon);
    if (!geoData[0]) return; 
    setDisplayData([geoData[0].name]); 
  };

  const getData = async (lat,lon) => {
    const weatherRes = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}` ); 
    const weatherData = await weatherRes.json(); 
    // console.log(weatherData);
    setDisplayData(prev => [ ...prev, { humidity: weatherData.main.humidity, temp: weatherData.main.temp, wind: weatherData.wind.speed, visibility: weatherData.visibility ,condition: weatherData.weather[0].main } ]);
  }
    useEffect(() => { 
      searchUrl(city); }, []);
  console.log(displayData);
  return (
    <div className="container">
      <div className="innercontainer">
        <div className="nav">
          <h1>weather</h1>
          <div className="navright">
            <input
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <p onClick={() => searchUrl(city)}>
              <SearchIcon className="search-icon" />
            </p>
            </div>
        </div>
          {displayData.length > 0 ? <><div className="section">
          <div className="icon">
            {displayData[1] && getWeatherIcon(displayData[1].condition)}
          </div>
          <h1>{displayData[0]}</h1>
        </div>
        <div className="lastsection">
          <div className="lastp1">
            <div className="box"><p>{displayData[1]?.humidity}%</p>
              <p><WaterDropIcon/>Humidity</p></div>
            <div className="box"><p>{displayData[1]?.temp}°C</p>
              <p><ThermostatIcon/>Temperature</p></div>
          </div>
          <div className="lastp2">
            <div className="box"><p>{displayData[1]?.wind} kph (309°)</p>
              <p><AirIcon/>WindSpeed</p></div>
            <div className="box"><p>{displayData[1]?.visibility}km</p>
              <p><VisibilityIcon/>Visibility </p>
              </div>
          </div>
        </div></>: <>
          <div className="falsesection"
          style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%' ,color:'grey'}}
          >
          <h1>Enter City Name</h1>
        </div>
        </>}
      </div>
    </div>
  )
}

export default App
 
