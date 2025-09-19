import * as Constants from "/utils/Constants";
import { useCollapse } from "react-collapsed";
import Checkboxes from "./Checkboxes";

export default function CheckboxSection({ windowWidth, checked, setChecked, handleCheckbox }) {
  let expanded = true;
  if (windowWidth.current <= Constants.MIN_FREE_WIDTH) {
    expanded = false;
  }

  const { getCollapseProps, getToggleProps, isExpanded } =
    useCollapse({defaultExpanded: expanded});
 
  return (
    <div class="checkbox-button info-button">
      <button {...getToggleProps()}>
        {isExpanded ? "Hide Checkboxes" : "Show/Hide Columns"}
      </button>
      <section {...getCollapseProps()}>
        <fieldset>
          <Checkboxes
            windowWidth={windowWidth}
            checked={checked}
            setChecked={setChecked}
            handleCheckbox={handleCheckbox}
          />
        </fieldset>
      </section>
    </div>
  )
}


