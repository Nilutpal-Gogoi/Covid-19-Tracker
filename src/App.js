import React,{useState, useEffect} from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"; 
import InfoBox from "./components/InfoBox"
import Map from "./components/Map"
import Table from "./components/Table"
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType ] = useState("cases");

// This useEffect is written to give us the info regarding the no of cases in InfoBox when the app.js reloads i.e at the starting before clicking any country from dropdown option.
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);


  // This useEffect hook is used to fetch the data from the API 
  useEffect(() => {
    // This function fetches the data 
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
        setMapCountries(data);
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

      // Now to center the country on the map when we click it from the dropdown
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    });
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
          <InfoBox 
            isRed
            onClick = {e => setCasesType("cases")}
            title="Coronavirus cases" 
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}></InfoBox>
          
          {/* InfoBox title="Coronavirus recovery cases" */}
          <InfoBox 
            onClick = {e => setCasesType("recovered")}
            title="Recovered" 
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
          
          {/* InfoBox title="Coronavirus death cases" */}  
          <InfoBox
            isRed
            onClick = {e => setCasesType("deaths")}
            title="Deaths" 
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
        </div>

        {/* ---------------- Map ------------------------------ */}
        <Map 
          casesType={casesType} 
          countries = {mapCountries} 
          center ={mapCenter} 
          zoom={mapZoom}
        ></Map>
      </div>
      
    {/* ----------------------- Right Container ------------------------------- */}

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} ></Table>
          <h3 className="app__graphTitle">Worldwide new {casesType} </h3>
          <LineGraph className="app__graph" casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
