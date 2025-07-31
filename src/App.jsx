'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import SelectCountry from "./components/SelectCountry";
import { Link } from "react-router";
import Checkbox from "./components/Checkbox";

ModuleRegistry.registerModules([AllCommunityModule]);

let selectedCountry = "";

const directorFilterParams = {
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/æ/g, "ae")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/ñ/g, "n")
      .replace(/[òóôõö]/g, "o")
      .replace(/œ/g, "oe")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y");
  },
};

const App = () => {
  const gridRef = useRef(null);
  // const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  // const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
    // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "Pos", headerName: "2025", maxWidth: 65 },
    { field: "2024", maxWidth: 65 },
    { field: "2023", maxWidth: 65 },
    { field: "Title",
      cellRenderer: (params) => {
        return <a href= {params.data.Providers.results.US.link} target="_blank" rel="noopener"> {params.value} </a>
      }
    },
    { field: "Director",
      filter: true,
      filterParams: directorFilterParams},
    { field: "Year", filter: true},
    { field: "Country", filter: true},
    { field: "Length", filter: true},
    { field: "Genre", filter: true},
    { field: "Colour", filter: true},
    { field: "Media Type", filter: true},
    { field: "Release Date", filter: true},
    { headerName: "Free",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        const providerData = params["data"]["Providers"]["results"][country]["free"];
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Flat Rate (Subscription)",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.flatrate;
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Buy",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.buy;
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Rent",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.rent;
        return retrieveProviders(providerData);
      }
    }
  ]);

  const LinkCellRenderer = (params) => (
    <Link to={`https://google.com`}>params.value</Link>
  );

  function retrieveProviders(providerData) {
    if (providerData) {
      let result = "";
      for (let i = 0; i < providerData.length; i++) {
        result += providerData[i].provider_name + ", ";
      }
      return result.slice(0, result.length - 2);
    }
  };

  useEffect(() => {
    fetch("./script/tmdb_final_10.json")
    .then(result => result.json())
    .then(rowData => setRowData(rowData));
  }, []);

  // const onGridReady = useEffect(() => {
  //   fetch("./script/tmdb_final_10_us.json")
  //   .then(result => result.json())
  //   .then(rowData => setRowData(rowData));
  // }, []);


  const updateProviders = useCallback(() => {
    // console.log("updateProviders country: " + country);
    gridRef.current.api.setGridOption("columnDefs", updateProviderCols());
  }, []);

  const updateProviderCols = () => {
    console.log("updateProviderCols selectedCountry: " + selectedCountry);
    // console.log("Providers.results." + country + ".link");
    // console.log("country: " + country);
    // console.log("Providers.results." + selectedCountry + ".link");
    return [
      { field: "Pos", headerName: "2025", maxWidth: 70 },
      { field: "2024", maxWidth: 70 },
      { field: "2023", maxWidth: 70 },
      { field: "Title", cellRenderer: (params) => {
        return <a href= {params["data"]["Providers"]["results"][selectedCountry]["link"]} target="_blank" rel="noopener"> {params.value} </a>
      } },
      { field: "Director",
        filter: true,
        filterParams: directorFilterParams},
      { field: "Year", filter: true},
      { field: "Country", filter: true},
      { field: "Length", filter: true},
      { field: "Genre", filter: true},
      { field: "Colour", filter: true},
      { field: "Media Type", filter: true},
      { field: "Release Date", filter: true},
      { headerName: "Free",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["free"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Flat Rate (Subscription)",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["flatrate"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Buy",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["buy"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Rent",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["rent"];
          return retrieveProviders(providerData);
        }
      }
    ];
  };

  const defaultColDef = {
    flex: 1,
  };

  const handleSelect = (country, params) => {
    console.log("handleSelect country: " + country);
    selectedCountry = country;
    updateProviders();
  }

  // function onBtExclude2025() {
  //   gridRef.current.api.setColumnsVisible(["Pos"], false);
  // }

  const [checked2025, setChecked2025] = React.useState(true);

  const handleChange2025 = () => {
    setChecked2025(!checked2025);
    if (checked2025) {
      gridRef.current.api.setColumnsVisible(["Pos"], false);
    } else {
      gridRef.current.api.setColumnsVisible(["Pos"], true);
    }
  };

  return (
    <div>
      <div>
        <p>
          Provider data is sourced from The Movie Database, which does not provide direct streaming links.
        </p>
        <p>
          Movie titles are links to The Movie Database's streaming provider pages for the movies, which do have the relevant streaming links.
        </p>
      </div>
      <div>
        <SelectCountry onSelect={handleSelect} />
      </div>
      {/* <div>
        <button onClick={onBtExclude2025}>2025</button>
      </div> */}
      <div>
        <Checkbox
          label="2025"
          value={checked2025}
          onChange={handleChange2025}
        />
      </div>
      <div style={{ width: "1400px", height: "500px" }}>
        <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        // onGridReady={onGridReady}
        frameworkComponents={{
          LinkCellRenderer
        }}
      />
      </div>
    </div>
  );
}

export default App;