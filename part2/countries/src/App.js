import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'

const Filter = ({newSearch, handleSearchChange}) => {
  return (
    <div>
        Find Countries: <input value={newSearch} onChange={handleSearchChange}></input>
    </div>
  )
}

const SingleCountry = ({country}) => {
  const capital = country.capital[0];
  const [wind, setWind] = useState(0);
  const [temp, setTemp] = useState(0);
  const [iconSrc, setIconSrc] = useState("");

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_API_KEY}`).then(response => {
    let weatherData = response.data;
    let tempResult = (parseFloat(weatherData.main["temp"]) - 273.15).toFixed(2);
    setTemp(tempResult);
    setWind(weatherData.wind["speed"]);
    setIconSrc(`http://openweathermap.org/img/wn/${weatherData.weather[0]["icon"]}@2x.png`)

  });

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(value => <li key={value}>{value}</li>)}
      </ul>
      <img src={country.flags["png"]} alt="country flag"></img>
      <h2>Weather in {country.capital[0]}</h2>
      <p>Temperature: {temp} Celsius</p>
      <img alt="Weather Icon" src={iconSrc}></img>
      <p>Wind: {wind} m/s</p>
    </div>
  )
}

const Country =({country}) => {
  const [show, setShow] = useState(false);
  return (
      <div>
        {country.name.common} {" "}
        <button onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        {show && <SingleCountry country={country}/>}
      </div>
    )
}

const Countries = ({isCountry, countries}) => {
  const countryResults = countries.filter(country => isCountry(country));
  if (countryResults.length > 10) {
    return (<div>Too many matches. Specify another filter.</div>)
  } else if (countryResults.length > 1) {
    return (
      <ul>
        {countryResults.map(country => <li key={country.name.common}>{<Country country={country}/>}</li>)}
      </ul>
    )
  } else if (countryResults.length === 1) {
    return (
      <SingleCountry country={countryResults[0]}/>
    )
  } else {
    return (<div>No matches found! Try searching again.</div>)
  }
}

function App() {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const isCountry = (country) => {
    return country.name.common.toLowerCase().includes(newSearch.toLowerCase()) ||
    country.name.official.toLowerCase().includes(newSearch.toLowerCase());
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  }
  

  return (
    <div>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <Countries isCountry={isCountry} countries={countries} />
    </div>      
  );
}

export default App;
