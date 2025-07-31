import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

function SelectCountry(props) {
    const [selected, setSelected] = useState("US");

    const handleSelect = (code) => {
        props.onSelect(code);
    }

    return (
        <ReactFlagsSelect
            selected={selected}
            onSelect={(code) => {
                setSelected(code);
                handleSelect(code);
            }}
            className="flag"
            searchable
        />
    );
};

export default SelectCountry;