import React from "react";
import { MenuItem, FormControl, Select } from "@material-ui/core"; 
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);

  // STATE = How to write a variable in REACT <<<<<<<<<<<<<<<<<<<<<


  return (
    <div className="app">  {/* BEM naming convention */}
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant = "outlined" value = "abc">
            {/* Loop through all the countries and show a drop down list of the options*/}

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option Two</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
            <MenuItem value="worldwide">Yoooo</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      
      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBox */}
      {/* InfoBox */}
      {/* InfoBox */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
      </div>
  );
}

export default App;
