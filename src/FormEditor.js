import React, {useState} from "react";

export const FormEditor = ({fields, dragItem=null}) => {
    const [activeField, setActiveField] = useState(null);
    const [dragging, setDragging] = useState(dragItem);

    handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    handleClickOutside = (e) => {
        setActiveField(null);
    };

    handleDrag = (e) => {
        // handles drag for exist fields on form
            // 1. get field label
            // 2. get current position with fieldId and type
            // 3. update state of dragging item
                // a. calculate drop targets
                // b. re-render form with drop targets
    };

    getFieldComponent = (item) => {
        switch(item.fieldType) {
            case "single-lined text":
                return (
                    <input type="text" style={{ pointerEvents: 'none' }}></input>
                );
            case "multi-line text":
                return (
                    <textarea></textarea>
                );
            case "number":
                return (
                    <input type="number" style={{ pointerEvents: 'none' }}></input>
                );
            case "boolean checkbox":
                return (
                    <input type="checkbox" style={{ pointerEvents: 'none' }}></input>
                );
            case "checkboxes":
                return (
                    item.values.map((x, i) => {
                        return <input type="checkbox" id={`${camelize(item.fieldLabel) + i}`} value={x} name={x}></input>
                    })
                );
            case "dropdown":
                return (
                    <select>
                        {!item.preselected &&
                            <option selected value="">-- select an option --</option>
                        }
                        {item.values.map((x) => {
                            return <option value={x} selected={item.preselected === x}>{x}</option>
                        })}
                    </select>
                );
            case "multi-line text":
                return (<textarea></textarea>);
            case "radio":
                return (
                    <>
                        {item.values.map((x) => {
                            return <input type="radio" name={camelize(item.fieldLabel)} value={x}></input>
                        })}
                    </>
                )
            case "header":
                return <h1>{item.fieldLabel}</h1>;
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
                    {fields.map(dataRow =>
                        <>
                            {dragging &&
                                <div className="fieldGroupDropTarget"></div>
                            }
                            <div wrap="nowrap" direction="row" className="formFieldFullGroupContainer" style={{ display: 'flex' }}>
                                {dataRow.map(item => 
                                    <div 
                                        id={camelize(item.fieldLabel)} 
                                        onClick={(e) => handleClick(e, camelize(item.fieldLabel))}
                                    >
                                        <div className={`movableAreaContainer${(activeField === camelize(item.fieldLabel)) ? '--visible': ''}`}>
                                            <div draggable
                                                onDrag={(e) => this.handleDrag(e)}
                                            >
                                                <div className="formField">
                                                    <label htmlFor={camelize(item.fieldLabel)}>
                                                        <div className="externalLabel"><span>{item.fieldLabel}</span></div>
                                                        <div className="propertyName"><span>{item.propertyName}</span></div>
                                                    </label>
                                                    {getFieldComponent(item)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                            {dragging &&
                                <div className="fieldGroupDropTarget"></div>
                            }
                            </>
                    )}
                </>
            )}
            <input type="submit" value="Submit" />
        </form>
    )
};