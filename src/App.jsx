import './App.css'
import SearchIcon from '@mui/icons-material/Search';
import SunnyIcon from '@mui/icons-material/Sunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect , useState} from 'react';
function App() { 
  const ApiKey='YourApikey' 
  const [city, setCity] = useState("london"); 
  const [displayData, setDisplayData] = useState([]); 

  const searchUrl = async (city) => { 
    const geoRes = await fetch( `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${ApiKey}` ); 
    const geoData = await geoRes.json(); 
    if (!geoData[0]) return; 
    setDisplayData([geoData[0].name]); 
  };
    useEffect(() => { 
      searchUrl(city); }, []);
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
          <div className="section">
          <div className="icon"><SunnyIcon sx={{ fontSize: 120, color: 'orange' }} /></div>
          <h1>`${geoData[0].name}`</h1>
        </div>
        <div className="lastsection">
          <div className="lastp1">
            <div className="box"><p>77%</p>
              <p><WaterDropIcon/>Humidity</p></div>
            <div className="box"><p>36°deg</p>
              <p><ThermostatIcon/>Temperature</p></div>
          </div>
          <div className="lastp2">
            <div className="box"><p>10.1 kph (309°)</p>
              <p><AirIcon/>WindSpeed</p></div>
            <div className="box"><p>3.5 km</p>
              <p><VisibilityIcon/>Visibility </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
 
