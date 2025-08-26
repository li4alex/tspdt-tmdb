'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import SelectCountry from "./SelectCountry";
import useWindowResizeThreshold from "./UseWindowResizeThreshold";
import * as Constants from "/utils/Constants";
import Checkboxes from "./Checkboxes";
import useFetchJson from "/utils/UseFetchJson";

ModuleRegistry.registerModules([AllCommunityModule]);

let selectedCountry = "US";

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

const TablePage = () => {
  const { data, loading } = useFetchJson("/tmdb_2025-08-24.json");
  const gridRef = useRef(null);
  const windowWidth = useRef(window.innerWidth);
  const columnDefinitions = () => {
    return [
      { field: "Pos", headerName: "2025", colId: "2025", maxWidth: 80, filter: true },
      { field: "2024", maxWidth: 80, filter: true },
      { field: "2023", maxWidth: 80, filter: true, initialHide: true },
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
      { field: "Year", maxWidth: 74, filter: true, initialHide: true },
      { field: "Country", maxWidth: 98, filter: true},
      { field: "Length", headerName: "Mins", colId: "Mins", maxWidth: 91, filter: true},
      { field: "Genre", filter: true, initialHide: true },
      { field: "Colour", maxWidth: 90, filter: true, initialHide: true },
      { field: "Media Type", filter: true, initialHide: true },
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

  const [colDefs, setColDefs] = useState(columnDefinitions);

  const defaultColDef = {
    flex: 1,
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  };

  const onGridReady = useCallback((params) => {
    if (windowWidth.current <= Constants.MIN_BUY_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[14]], false);
    }
    if (windowWidth.current <= Constants.MIN_RENT_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[15]], false);
    }
    if (windowWidth.current <= Constants.MIN_COUNTRY_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[7]], false);
    }
    if (windowWidth.current <= Constants.MIN_2024_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[1]], false);
    }
    if (windowWidth.current <= Constants.MIN_DIRECTOR_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[4]], false);
    }
    if (windowWidth.current <= Constants.MIN_RELEASE_DATE_WIDTH) {
      params.api.setColumnsVisible([Constants.COLUMN_IDS[5]], false);
    }
  }, []);

  function retrieveProviders(providerData) {
    if (providerData) {
      let result = "";
      for (let i = 0; i < providerData.length; i++) {
        result += providerData[i].provider_name + ", ";
      }
      return result.slice(0, result.length - 2);
    }
  };

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
  
  const handleCheckbox = (position) => {
    const updatedChecked = checked.map((item, index) => {
      if (index === position) {
        if (item) {
          gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[index]], false);
        } else {
          gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[index]], true);
        }
        return !item;
      } else {
        return item;
      }
    });

    setChecked(updatedChecked);
  }; 

  const handleSelect = (country) => {
    selectedCountry = country;
    setColDefs(columnDefinitions);
  }

  const buyThreshold = useWindowResizeThreshold(Constants.MIN_BUY_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[14]], false);
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

  const rentThreshold = useWindowResizeThreshold(Constants.MIN_RENT_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[15]], false);
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

  const countryThreshold = useWindowResizeThreshold(Constants.MIN_COUNTRY_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[7]], false);
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

  const pos2024Threshold = useWindowResizeThreshold(Constants.MIN_2024_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[1]], false);
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

  const directorThreshold = useWindowResizeThreshold(Constants.MIN_DIRECTOR_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[4]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 4) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [directorThreshold]);

  const releaseDateThreshold = useWindowResizeThreshold(Constants.MIN_RELEASE_DATE_WIDTH);

  useEffect(() => {
    if (gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([Constants.COLUMN_IDS[5]], false);
      const updatedChecked = checked.map((item, index) => {
        if (index === 5) {
          return false
        } else {
          return item;
        }
      });
      setChecked(updatedChecked); 
    }
  }, [releaseDateThreshold]);

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
        <Checkboxes
          windowWidth={windowWidth}
          checked={checked}
          setChecked={setChecked}
          handleCheckbox={handleCheckbox}
        />
      </div>
      <div className="grid-wrapper" style={{ width: "auto", height: "75lvh" }}>
        <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default TablePage;