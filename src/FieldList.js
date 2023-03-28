import React from "react";

const FieldBox = ({id, title}) => (
    <div id={id} className="fieldBox">
        <div 
            id="dragHandle" 
            style={{
                color: "rgb(203, 214, 226)", 
                lineHeight: 0.3, 
                margin: "0px auto", 
                whiteSpace: "pre-line", 
                fontSize: "18px"}}>
        ...
        ...
        </div>
        <div>{title}</div>
    </div>
);

const fields ={ 
    "singleLinedText": "Single-lined Text",
    "number": "Number",
    "multilineText": "Multiline Text",
    "dropdown": "Dropdown",
    "radio": "Radio",
    "date": "Date",
    "checkboxes": "Checkboxes",
    "header": "Header"
};

export const FieldList = () => (
    <div>
        <div>Form Fields</div>
        <hr></hr>
        {Object.keys(fields).map((item, i) => (
            <FieldBox
                key={i}
                id={item}
                title={fields[item]}
            />
        ))}
    </div>
);