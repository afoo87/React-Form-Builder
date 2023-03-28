import React, { useState } from "react";

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

const FormField = ({ 
    fieldLabel, 
    propertyName, 
    fieldType, 
    values=[], 
    preselected=false, 
    handleClick, 
    activeField
}) => {

    renderField = (label, fieldType, values, preselected) => {
        switch(fieldType) {
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
                    values.map((x, i) => {
                        return <input type="checkbox" id={`${camelize(label) + i}`} value={x} name={x}></input>
                    })
                );
            case "dropdown":
                return (
                    <select>
                        {!preselected &&
                            <option selected value="">-- select an option --</option>
                        }
                        {values.map((x) => {
                            return <option value={x} selected={preselected === x}>{x}</option>
                        })}
                    </select>
                );
            case "multi-line text":
                return (<textarea></textarea>);
            case "radio":
                return (
                    <>
                        {values.map((x) => {
                            return <input type="radio" name={camelize(label)} value={x}></input>
                        })}
                    </>
                )
            case "header":
                return <h1>{label}</h1>;
            default:
                return (null);
        }
    };

    handleDrag = (e) => {
        // handles drag for exist fields on form
            // 1. get field label
            // 2. get current position with fieldId and type
            // 3. update state of dragging item
                // a. calculate drop targets
                // b. re-render form with drop targets
    };

    return (
        <div 
            id={camelize(fieldLabel)} 
            onClick={(e) => handleClick(e, camelize(fieldLabel))}
        >
            <div className={`movableAreaContainer${(activeField === camelize(fieldLabel)) ? '--visible': ''}`}>
                <div draggable
                    onDrag={(e) => this.handleDrag(e)}
                >
                    <div className="formField">
                        <FieldLabel 
                            label={fieldLabel}
                            propertyName={propertyName}
                        />
                        {renderField(fieldLabel, fieldType, values, preselected)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DropTarget = ({ placement }) => {

    renderDropTarget = () => {
        switch(placement) {
            case "horizontal":
                return <div className="fieldGroupDropTarget"></div>
            case "vertical":
                return <div className="fieldDropTarget"></div>
            default:
                return null;
        }
    };

    return (
        <div className="dropTarget">
            {renderDropTarget()}
        </div>
    )
}

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
            <FormField {...item} handleClick={handleClick} activeField={activeField}/>
        )
    };

    renderRowWithDT = (fields) => {
        let prevDrag = false;
        return fields.map((field, i) => {
            if (camelize(field.fieldLabel) === dragging.fieldLabel) {
                prevDrag = true;
                return <FormField {...field} handleClick={handleClick} activeField={activeField}/>
            } else if (prevDrag) {
                prevDrag = false;
                return (<>
                            <FormField {...field} handleClick={handleClick} activeField={activeField}/>
                            { i+1 === fields.length && <DropTarget placement={"vertical"} />}
                        </>);
            } else {
                return (<>
                            <DropTarget placement={"vertical"} />
                            <FormField {...field} handleClick={handleClick} activeField={activeField}/>
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
            return dataRow.some(field => camelize(field.fieldLabel) === dragging.fieldLabel);
        };

        return formFields.map((dataRow, i) => {
            if (containsDragField(dataRow)) {
                prevDrag = true;
                { dataRow.length === 1 ? 
                    fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow)) }
            } else if (prevDrag) {
                prevDrag = false;
                if (formFields[i-1].length === 1) {
                    {formFields[i-1][0].fieldType === 'header' ?
                        fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow))
                    }
                    { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                } else {
                    return (
                        <>
                            <DropTarget placement={"horizontal"} />
                            {formFields[i][0].fieldType === 'header' ?
                                fieldGroupContainer(renderRow(dataRow)) : fieldGroupContainer(renderRowWithDT(dataRow))
                            }
                            { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                        </>
                    )
                }
            } else {
                return (
                    <>
                        <DropTarget placement={"horizontal"} />
                        {formFields[i][0].fieldType === 'header' ?
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
                    <div id="clickableElement" onClick={handleClickOutside}></div>
                    { Object.keys(dragging).length === 0 ? renderForm() : renderFormWithDT() }
                </>
            )}
            <input type="submit" value="Submit" />
        </form>
    )
};