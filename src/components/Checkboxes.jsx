import React, { useState, useEffect, useRef, useCallback } from "react";
// import useWindowResizeThreshold from "/components/UseWindowResizeThreshold";
import * as Constants from "/utils/Constants";

export default function Checkboxes({ windowWidth, checked, setChecked, handleCheckbox }) {
  useEffect(() => {
    const initialChecked = checked.map((item, index) => {
      if (windowWidth.current <= Constants.MIN_BUY_WIDTH && index === 14) {
        return false;
      }
      if (windowWidth.current <= Constants.MIN_RENT_WIDTH && index === 15) {
        return false;
      }
      if (windowWidth.current <= Constants.MIN_COUNTRY_WIDTH && index === 7) {
        return false;
      }
      if (windowWidth.current <= Constants.MIN_2024_WIDTH && index === 1) {
        return false;
      }
      if (windowWidth.current <= Constants.MIN_DIRECTOR_WIDTH && index === 4) {
        return false;
      }
      if (windowWidth.current <= Constants.MIN_RELEASE_DATE_WIDTH && index === 5) {
        return false;
      }
      else {
        return item;
      }
    });
    setChecked(initialChecked);
  }, []);
  
  return (
    Constants.COLUMN_IDS.map((columnId, index) => {
      return (
        <label htmlFor={`checkbox-${index}`} key= {columnId}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={checked[index]}
            onChange={() => handleCheckbox(index)}
          />
          {columnId}
        </label>
      );
    })
  )
}
