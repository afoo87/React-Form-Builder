import React, { useState, useEffect, useRef } from "react";

function camelize (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

const EmptyForm = () =>
    <>
        <div className="formFieldAlert">
            <div className="alertTitle">No fields selected</div>
            <div className="alertBody">You must have at least one field on your form to publish.</div>
        </div>
        <div className="dropArea">
            <div className="dropBody">Drag and drop a form field here</div>
        </div>
    </>

const FieldLabel = ({ label, propertyName }) =>
    <div className="labelWrapper">
        <label htmlFor={camelize(label)}>
            <div className="externalLabel"><span>{label}</span></div>
        </label>
        <small className="propertyName">{propertyName}</small>
    </div>

const useComponentActive = (initialIsActive, parentClickOutside) => {
    const [isComponentActive, setIsComponentActive] = useState(initialIsActive);
    const ref = useRef(null);

    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            parentClickOutside();
            setIsComponentActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentActive, setIsComponentActive };
}

const FormField = ({ 
    label, 
    propertyName, 
    type, 
    options=[], 
    preselected=false, 
    handleClick,
    handleClickOutside
}) => {

    const {ref, isComponentActive, setIsComponentActive } = useComponentActive(false, handleClickOutside);

    renderField = (label, type, options, preselected) => {
        switch(type) {
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
                    options.map((opt, i) => {
                        return <input type="checkbox" id={`${camelize(label) + i}`} value={opt.value} name={opt.text}></input>
                    })
                );
            case "dropdown":
                return (
                    <select>
                        {!preselected &&
                            <option selected value="">-- select an option --</option>
                        }
                        {options.map((opt) => {
                            return <option value={opt.value} selected={preselected === opt.value}>{opt.text}</option>
                        })}
                    </select>
                );
            case "multi-line text":
                return (<textarea></textarea>);
            case "radio":
                return (
                    <>
                        {options.map((opt) => {
                            return <input type="radio" name={opt.text} value={opt.value}></input>
                        })}
                    </>
                )
            case "header":
                return <h1>{label}</h1>;
            default:
                return (null);
        }
    };

    handleDragStart = (e, label) => {
        e.dataTransfer.setData('text/plain', label);

        // Create a new element as the drag image
        const dragImage = document.createElement('div');
        dragImage.innerText = label;
        dragImage.style.backgroundColor = 'rgb(234, 240, 246)';
        dragImage.style.padding = '8px';
        dragImage.style.borderRadius = '3px';
        // Set the drag image to the new element
        e.dataTransfer.setDragImage(dragImage, 0, 0);
    };

    manageClick = (e, label) => {
        handleClick(e, camelize(label));
        setIsComponentActive(true);
    }

    return (
        <div 
            ref={ref}
            id={camelize(label)}
            onClick={(e) => manageClick(e, label)}
        >
            <div className={`movableAreaContainer${isComponentActive ? '--visible': ''}`}>
                <div 
                    draggable
                    onDragStart={(e) => handleDragStart(e, label)}
                >
                    <div className="formField">
                        <FieldLabel 
                            label={label}
                            propertyName={propertyName}
                        />
                        {renderField(label, type, options, preselected)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DropTarget = ({ placement }) => {
    handleDragOver = (e) => {
        e.preventDefault();
    };

    renderDropTarget = () => {
        switch(placement) {
            case "horizontal":
                return <div className="fieldGroupDropTarget" onDragOver={(e) => handleDragOver(e)}></div>
            case "vertical":
                return <div className="fieldDropTarget" onDragOver={(e) => handleDragOver(e)}></div>
            default:
                return null;
        }
    };

    return (
        <div className="dropTarget">
            {renderDropTarget()}
        </div>
    )
};

export const FormEditor = ({
    fields=[], 
    dragItem={}
}) => {
    const [activeField, setActiveField] = useState(null);
    const [dragging, setDragging] = useState(dragItem);
    const [formFields, setFormFields] = useState(fields);

    handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    handleClickOutside = (e) => {
        setActiveField(null);
    };

    renderRow = (fields) => {
        return fields.map(item => 
            <FormField {...item} handleClick={handleClick} handleClickOutside={handleClickOutside}/>
        )
    };

    renderRowWithDT = (fields) => {
        let prevDrag = false;
        return fields.map((field, i) => {
            if (camelize(field.label) === dragging.label) {
                prevDrag = true;
                return <FormField {...field} handleClick={handleClick} handleClickOutside={handleClickOutside}/>
            } else if (prevDrag) {
                prevDrag = false;
                return (<>
                            <FormField {...field} handleClick={handleClick} handleClickOutside={handleClickOutside} />
                            { i+1 === fields.length && <DropTarget placement={"vertical"} />}
                        </>);
            } else {
                return (<>
                            <DropTarget placement={"vertical"} />
                            <FormField {...field} handleClick={handleClick} handleClickOutside={handleClickOutside} />
                            { i+1 === fields.length && <DropTarget placement={"vertical"} />}
                        </>);
            }
        })
    }

    fieldGroupContainer = (component) =>
        <div 
            wrap="nowrap" 
            direction="row" 
            className="formFieldFullGroupContainer" 
            style={{ display: 'flex' }}
        >
            {component}
        </div>

    renderForm = () =>
        formFields.map(dataRow =>
                fieldGroupContainer(renderRow(dataRow))
        )

    renderFormWithDT = () => {
        let prevDrag = false;

        const containsDragField = (dataRow) => {
            return dataRow.some(field => camelize(field.label) === dragging.label);
        };

        return formFields.map((dataRow, i) => {
            if (containsDragField(dataRow)) {
                prevDrag = true;
                if (dataRow.length === 1) {
                    return fieldGroupContainer(renderRow(dataRow))
                } else {
                    return fieldGroupContainer(renderRowWithDT(dataRow))
                }
            } else if (prevDrag) {
                prevDrag = false;
                if (formFields[i-1].length === 1) {
                    return (
                        <>
                            {formFields[i-1][0].type === 'header' ?
                                fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow))
                            }
                            { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                        </>
                    );
                } else {
                    return (
                        <>
                            <DropTarget placement={"horizontal"} />
                            {formFields[i][0].type === 'header' ?
                                fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow))
                            }
                            { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                        </>
                    );
                }
            } else {
                return (
                    <>
                        <DropTarget placement={"horizontal"} />
                        {formFields[i][0].type === 'header' ?
                            fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow))
                        }
                        { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                    </>
                );
            }
        });
    };

    return (
        <form>
            {(!formFields || formFields.length === 0) ? (
                <EmptyForm />
            ) : (
                <>
                    { Object.keys(dragging).length === 0 ? renderForm() : renderFormWithDT() }
                </>
            )}
            <input type="submit" value="Submit" />
        </form>
    )
};