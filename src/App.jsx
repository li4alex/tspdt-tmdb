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
    { field: "Pos", headerName: "2025", maxWidth: 80, colId: "2025", filter: true },
    { field: "2024", maxWidth: 80, filter: true },
    { field: "2023", maxWidth: 80, filter: true, initialHide: true },
    { field: "Title",
      filter: true,
      maxWidth: 130,
      cellRenderer: (params) => {
        return <a href= {params.data.Providers.results.US.link} target="_blank" rel="noopener"> {params.value} </a>
      }
    },
    { field: "Director",
      filter: true,
      filterParams: directorFilterParams
      // cellStyle: { "white-space": "pre-line" }
    },
    { field: "Release Date", maxWidth: 128, filter: true },
    { field: "Year", maxWidth: 74, filter: true, initialHide: true },
    { field: "Country", maxWidth: 98, filter: true },
    { field: "Length", maxWidth: 91, filter: true },
    { field: "Genre", filter: true, initialHide: true },
    { field: "Colour", maxWidth: 90, filter: true, initialHide: true },
    { field: "Media Type", filter: true, initialHide: true },
    { headerName: "Free",
      colId: "Free",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        const providerData = params["data"]["Providers"]["results"][country]["free"];
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Flat Rate (Subscription)",
      colId: "Flat Rate (Subscription)",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.flatrate;
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Buy",
      colId: "Buy",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.buy;
        return retrieveProviders(providerData);
      }
    },
    { headerName: "Rent",
      colId: "Rent",
      filter: true,
      valueGetter: function (params) {
        const providerData = params.data.Providers.results.US.rent;
        return retrieveProviders(providerData);
      }
    }
  ]);

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
    gridRef.current.api.setGridOption("columnDefs", updateProviderCols());
  }, []);

  const updateProviderCols = () => {
    return [
      { field: "Pos", headerName: "2025", colId: "2025", maxWidth: 80, filter: true },
      { field: "2024", maxWidth: 80, filter: true },
      { field: "2023", maxWidth: 80, filter: true },
      { field: "Title", maxWidth: 130, filter: true, cellRenderer: (params) => {
        return <a href= {params["data"]["Providers"]["results"][selectedCountry]["link"]} target="_blank" rel="noopener"> {params.value} </a>
      } },
      { field: "Director",
        filter: true,
        filterParams: directorFilterParams},
      { field: "Release Date", maxWidth: 128, filter: true},
      { field: "Year", maxWidth: 74, filter: true},
      { field: "Country", maxWidth: 98, filter: true},
      { field: "Length", maxWidth: 91, filter: true},
      { field: "Genre", filter: true},
      { field: "Colour", maxWidth: 90, filter: true},
      { field: "Media Type", filter: true},
      { headerName: "Free",
        colId: "Free",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["free"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Flat Rate (Subscription)",
        colId: "Flat Rate (Subscription)",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["flatrate"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Buy",
        colId: "Buy",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["buy"];
          return retrieveProviders(providerData);
        }
      },
      { headerName: "Rent",
        colId: "Rent",
        filter: true,
        valueGetter: function (params) {
          const providerData = params["data"]["Providers"]["results"][selectedCountry]["rent"];
          return retrieveProviders(providerData);
        }
      },
    ];
  };

  const defaultColDef = {
    // flex: 1,
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  };

  const handleSelect = (country, params) => {
    selectedCountry = country;
    updateProviders();
  }

  const columnIds = [
    "2025",
    "2024",
    "2023",
    "Title",
    "Director",
    "Release Date",
    "Year",
    "Country",
    "Length",
    "Genre",
    "Colour",
    "Media Type",
    "Free",
    "Flat Rate (Subscription)",
    "Buy",
    "Rent"
  ];

  const [checked, setChecked] = useState([
    true,
    true,
    false,
    true,
    true,
    true,
    false,
    true,
    true,
    false,
    false,
    false,
    true,
    true,
    true,
    true
  ]);

  const handleChange = (position) => {
    const updatedChecked = checked.map((item, index) => {
      if (index === position) {
        if (item) {
          gridRef.current.api.setColumnsVisible([columnIds[index]], false);
        } else {
          gridRef.current.api.setColumnsVisible([columnIds[index]], true);
        }
        return !item;
      } else {
        return item;
      }
    });

    setChecked(updatedChecked);
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
      <div className="checkboxes">
          {columnIds.map((columnId, index) => {
            return (
              <label>
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={checked[index]}
                  onChange={() => handleChange(index)}
                />
                {columnId}
              </label>
            );
            }
          )}
      </div>
      <div style={{ width: "auto", height: "1080px" }}>
        <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        // onGridReady={onGridReady}
      />
      </div>
    </div>
  );
}

export default App;