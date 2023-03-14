import React, {useState} from "react";

export const FormEditor = ({fields}) => {
    const [activeField, setActiveField] = useState(null);

    handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    handleClickOutside = (e) => {
        setActiveField(null);
    };

    getFieldComponent = (fieldType) => {
        switch(fieldType) {
            case "single-lined text":
                return (
                    <input type="text" style={{ pointerEvents: 'none' }}></input>
                );
            case "multiline text":
                return (
                    <textarea></textarea>
                )
            default:
                return (null);
        }
    };

    camelize = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    };

    return (
        <form>
            {(!fields || fields.length === 0) ? (
                <>
                    <div className="formFieldAlert">
                    <div className="alertTitle">No fields selected</div>
                    <div className="alertBody">You must have at least one field on your form to publish.</div>
                    </div>
                    <div className="dropArea">
                        <div className="dropBody">Drag and drop a form field here</div>
                    </div>
                </>
            ) : (
                <>
                    <div id="clickableElement" onClick={handleClickOutside}></div>
                    {fields.map((item) =>
                        <div 
                            id={camelize(item.fieldLabel)} 
                            onClick={(e) => handleClick(e, camelize(item.fieldLabel))}
                        >
                            <div className={`movableAreaContainer${(activeField === camelize(item.fieldLabel)) ? '--visible': ''}`}>
                                <div className="formField">
                                    <label htmlFor={camelize(item.fieldLabel)}>
                                        <div wrap="wrap" direction="row">
                                            <div className="externalLabel"><span>{item.fieldLabel}</span></div>
                                            <div className="propertyName"><span>{item.propertyName}</span></div>
                                        </div>
                                    </label>
                                    {getFieldComponent(item.fieldType)}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <input type="submit" value="Submit" />
        </form>
    )
};