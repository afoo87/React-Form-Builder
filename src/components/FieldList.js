import React from "react";

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

const Field = ({ id, title }) =>
    <div id={id}>
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

const hubspotFieldTypes = {fieldTypes: {
                divider: "Divider",
                text:"Single-line text",
                number:"Number",
                booleancheckbox:"Single checkbox",
                checkbox:"Checkboxes",
                select:"Dropdown",
                textarea:"Multi-line text",
                radio:"Radio",
                date:"Date",
                file:"File",
                matrixRating:"Matrix rating",
                starRating:"Star rating",
                smileyRating:"Smileys",
                range:"Slider",rating:"Scale rating",
                header:"Header Text",
                paragraph:"Paragraph (RichText)",
                image:"Image",
                page:"Page"
            }
    }

export const FieldList = () => 
    <div>
        <div>Form Fields</div>
        <hr></hr>
        {Object.keys(fields).map((item, i) => (
            <Field
                key={i}
                id={item}
                title={fields[item]}
            />
        ))}
    </div>