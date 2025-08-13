'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import SelectCountry from "./components/SelectCountry";
import { Link } from "react-router";
import Checkbox from "./components/Checkbox";
import useWindowResizeThreshold from "./components/UseWindowResizeThreshold";

ModuleRegistry.registerModules([AllCommunityModule]);

let selectedCountry = "";

const MIN_BUY_WIDTH = 1344;
const MIN_RENT_WIDTH = 1207;
const MIN_COUNTRY_WIDTH = 1075;
const MIN_2024_WIDTH = 837;

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
  const windowWidth = useRef(window.innerWidth);
  // const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  // const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { field: "Pos", headerName: "2025", maxWidth: 80, colId: "2025", filter: true },
    { field: "2024", maxWidth: 80, filter: true },
    { field: "2023", maxWidth: 80, filter: true, initialHide: true },
    { field: "Title",
      filter: true,
      maxWidth: 130,
      cellRenderer: (params) => {
        if (params.data.Providers.results.US) {
          return <a href= {params.data.Providers.results.US.link} target="_blank" rel="noopener"> {params.value} </a>
        } else {
          return params.value;
        }        
      }
    },
    { field: "Director",
      maxWidth: 130,
      filter: true,
      filterParams: directorFilterParams
    },
    { field: "Release Date", maxWidth: 128, minWidth: 63, filter: true },
    { field: "Year", maxWidth: 74, filter: true, initialHide: true },
    { field: "Country", maxWidth: 98, filter: true },
    { field: "Length", headerName: "Mins", maxWidth: 91, filter: true },
    { field: "Genre", filter: true, initialHide: true },
    { field: "Colour", maxWidth: 90, filter: true, initialHide: true },
    { field: "Media Type", filter: true, initialHide: true },
    { headerName: "Free",
      colId: "Free",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        if (params["data"]["Providers"]["results"][country]) {
          const providerData = params["data"]["Providers"]["results"][country]["free"];
          return retrieveProviders(providerData);
        }
      }
    },
    { headerName: "Flat Rate (Subscription)",
      colId: "Flat Rate (Subscription)",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        if (params["data"]["Providers"]["results"][country]) {
          const providerData = params["data"]["Providers"]["results"][country]["flatrate"];
          return retrieveProviders(providerData);
        }
      }
    },
    { headerName: "Buy",
      colId: "Buy",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        if (params["data"]["Providers"]["results"][country]) {
          const providerData = params["data"]["Providers"]["results"][country]["buy"];
          return retrieveProviders(providerData);
        }
      }
    },
    { headerName: "Rent",
      colId: "Rent",
      filter: true,
      valueGetter: function (params) {
        const country = "US";
        if (params["data"]["Providers"]["results"][country]) {
          const providerData = params["data"]["Providers"]["results"][country]["rent"];
          return retrieveProviders(providerData);
        }
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
    fetch("./script/tmdb_final.json")
    .then(result => result.json())
    .then(rowData => setRowData(rowData));
  }, []);

  const updateProviders = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", updateProviderCols());
  }, []);

  const updateProviderCols = () => {
    return [
      { field: "Pos", headerName: "2025", colId: "2025", maxWidth: 80, filter: true },
      { field: "2024", maxWidth: 80, filter: true },
      { field: "2023", maxWidth: 80, filter: true },
      { field: "Title", maxWidth: 130, filter: true, cellRenderer: (params) => {
        if (params["data"]["Providers"]["results"][selectedCountry]) {
          return <a href= {params["data"]["Providers"]["results"][selectedCountry]["link"]} target="_blank" rel="noopener"> {params.value} </a>
        } else {
          return params.value;
        }
        
      } },
      { field: "Director",
        maxWidth: 130,
        filter: true,
        filterParams: directorFilterParams},
      { field: "Release Date", maxWidth: 128, minWidth: 63, filter: true},
      { field: "Year", maxWidth: 74, filter: true},
      { field: "Country", maxWidth: 98, filter: true},
      { field: "Length", headerName: "Mins", maxWidth: 91, filter: true},
      { field: "Genre", filter: true},
      { field: "Colour", maxWidth: 90, filter: true},
      { field: "Media Type", filter: true},
      { headerName: "Free",
        colId: "Free",
        filter: true,
        valueGetter: function (params) {
          if (params["data"]["Providers"]["results"][selectedCountry]) {
            const providerData = params["data"]["Providers"]["results"][selectedCountry]["free"];
            return retrieveProviders(providerData);
          }
        }
      },
      { headerName: "Flat Rate (Subscription)",
        colId: "Flat Rate (Subscription)",
        filter: true,
        valueGetter: function (params) {
          if (params["data"]["Providers"]["results"][selectedCountry]) {
            const providerData = params["data"]["Providers"]["results"][selectedCountry]["flatrate"];
            return retrieveProviders(providerData);
          }
        }
      },
      { headerName: "Buy",
        colId: "Buy",
        filter: true,
        valueGetter: function (params) {
          if (params["data"]["Providers"]["results"][selectedCountry]) {
            const providerData = params["data"]["Providers"]["results"][selectedCountry]["buy"];
            return retrieveProviders(providerData);
          }
        }
      },
      { headerName: "Rent",
        colId: "Rent",
        filter: true,
        valueGetter: function (params) {
          if (params["data"]["Providers"]["results"][selectedCountry]) {
            const providerData = params["data"]["Providers"]["results"][selectedCountry]["rent"];
            return retrieveProviders(providerData);
          }
        }
      },
    ];
  };

  const defaultColDef = {
    flex: 1,
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  };

  const handleSelect = (country, params) => {
    selectedCountry = country;
    updateProviders();
  }

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

  const columnIds = [
    "2025",
    "2024",
    "2023",
    "Title",
    "Director",
    "Release Date",
    "Year",
    "Country",
    "Mins",
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
  
  const onGridReady = useCallback((params) => {
    if (windowWidth.current <= MIN_BUY_WIDTH) {
      params.api.setColumnsVisible([columnIds[14]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 14) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
    if (windowWidth.current <= MIN_RENT_WIDTH) {
      params.api.setColumnsVisible([columnIds[15]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 15) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
    if (windowWidth.current <= MIN_COUNTRY_WIDTH) {
      params.api.setColumnsVisible([columnIds[7]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 7) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
    if (windowWidth.current <= MIN_2024_WIDTH) {
      params.api.setColumnsVisible([columnIds[1]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 1) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, []);

  const buyThreshold = useWindowResizeThreshold(MIN_BUY_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([columnIds[14]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 14) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [buyThreshold]);

  const rentThreshold = useWindowResizeThreshold(MIN_RENT_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([columnIds[15]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 15) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [rentThreshold]);

  const countryThreshold = useWindowResizeThreshold(MIN_COUNTRY_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([columnIds[7]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 7) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [countryThreshold]);

  const pos2024Threshold = useWindowResizeThreshold(MIN_2024_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([columnIds[1]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 1) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [pos2024Threshold]);

  return (
    <div>
      <div>
        <p>
          Best on desktop. Some columns will automatically hide when window width is reduced.
        </p>
        <p>
          Click on a column to sort by it. Click on the three dash menu icons to filter by that column. To reset a filter from blank/not blank, just select any other dropdown option and clear the text field.
        </p>
        <p>
          Provider data is sourced from The Movie Database, which does not provide direct streaming links.
        </p>
        <p>
          Movie titles are links to The Movie Database's country-specific streaming provider pages for the movies, which do have the relevant streaming links. If there is no link, there are no providers in that country.
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
        })}
      </div>
      <div className="grid-wrapper" style={{ width: "auto", height: "75lvh" }}>
        <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default App;