import React,{useState, useEffect} from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"; 
import InfoBox from "./components/InfoBox"
import Map from "./components/Map"
import Table from "./components/Table"
import './App.css';
import { sortData } from "./util";
import LineGraph from "./components/LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async() => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,              // United States, United Kingdom
          value: country.countryInfo.iso2     // UK, USA, FR
        }));

        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
      })
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}` ;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)

      // All of the data ... from the country response
      setCountryInfo(data);
    })

    // https://disease.sh/v3/covid-19/all 
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };

  

  return (
    <div className="app">  {/* BEM naming convention */}

    {/* ----------------------- Left Container ------------------------------- */}

      <div className="app__left">
        {/* --------- Header ------------- */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select 
              variant = "outlined" 
              onChange={onCountryChange} 
              value = {country}
            >
              {/* Loop through all the countries and show a drop down list of the options*/}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        {/* ---------------- Information Boxes ---------------- */}
        <div className="app__stats">
          {/* InfoBox title="Coronavirus cases" */}
          <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          {/* InfoBox title="Coronavirus recovery cases" */}
          <InfoBox title="Recovered" cases={countryInfo.todayDeaths} total={countryInfo.recovered}></InfoBox>
          {/* InfoBox title="Coronavirus death cases" */}  
          <InfoBox title="Deaths" cases={countryInfo.todayRecovered} total={countryInfo.deaths}></InfoBox>
        </div>

        {/* ---------------- Map ------------------------------ */}
        <Map></Map>
      </div>
      
    {/* ----------------------- Right Container ------------------------------- */}

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} ></Table>
          <h3>Worldwide new cases</h3>
          {/* Graph */}
          <LineGraph></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
