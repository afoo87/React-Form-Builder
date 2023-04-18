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

const FieldLabel = ({ label, internalName }) =>
    <div className="labelWrapper">
        <label htmlFor={camelize(label)}>
            <div className="externalLabel"><span>{label}</span></div>
        </label>
        <small className="internalName">{internalName}</small>
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
    internalName, 
    type, 
    options=[], 
    preselected=false, 
    handleClick,
    handleClickOutside,
    handleDragStart
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

    onDragStart = (e, internalName, label) => {
        handleDragStart({'name': internalName, 'label': label});
        e.dataTransfer.setData('text/plain', `{'name': ${internalName}, 'label': ${label}}`);

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
                    onDragStart={(e) => onDragStart(e, internalName, label)}
                >
                    <div className="formField">
                        <FieldLabel 
                            label={label}
                            internalName={internalName}
                        />
                        {renderField(label, type, options, preselected)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const RenderIf = ({ children, isTrue }) => isTrue ? children : null

const FormRow = ({ 
    fields, 
    handleClick, 
    handleClickOutside,
    handleDragStart,
    draggedItem
}) => {
    let prevDrag = false;

    const containsDragField = (dataRow) => {
        return dataRow.some(field => field.internalName === draggedItem.internalName);
    };

    return (
        <div 
            wrap="nowrap" 
            direction="row" 
            className="formFieldFullGroupContainer" 
            style={{ display: 'flex' }}
        >
            {fields.map((field, i) => {
                if (containsDragField(fields)) {
                    if (!!draggedItem.internalName && draggedItem.internalName === field.internalName) {
                        prevDrag = true;
                        <FormField 
                            {...field} 
                            handleClick={handleClick} 
                            handleClickOutside={handleClickOutside}
                            handleDragStart={handleDragStart}
                        />
                    } else if (prevDrag) {
                        prevDrag = false;
                        return (<>
                                    <FormField 
                                        {...field} 
                                        handleClick={handleClick} 
                                        handleClickOutside={handleClickOutside}
                                        handleDragStart={handleDragStart}
                                    />
                                    <RenderIf isTrue={i+1 === fields.length}>
                                        <DropTarget placement={"vertical"} />
                                    </RenderIf>
                                </>);
                    } else {
                        return (<>
                                    <DropTarget placement={"vertical"} />
                                    <FormField 
                                        {...field} 
                                        handleClick={handleClick} 
                                        handleClickOutside={handleClickOutside}
                                        handleDragStart={handleDragStart}
                                    />
                                    <RenderIf isTrue={i+1 === fields.length}>
                                        <DropTarget placement={"vertical"} />
                                    </RenderIf>
                                </>);
                    }
                } else {
                    return (
                        <FormField 
                            {...field} 
                            handleClick={handleClick} 
                            handleClickOutside={handleClickOutside}
                            handleDragStart={handleDragStart}
                        />
                    )
                }
            }
            )}
        </div>
    )
}


const DropTarget = ({ placement }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    handleDrop = (e) => {
        // Calculate Drop Target Location
        // Get id of dropped item
        // Apply changes
        JSON.parse(e.dataTransfer.getData('text/plain'));
    };

    renderDropTarget = () => {
        switch(placement) {
            case "horizontal":
                return <div 
                            className="fieldGroupDropTarget" 
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e)}
                            style={{ border: isDraggingOver ? '2px dashed #7087E7' : 'none', color: '#DDE4FF' }}
                        ></div>
            case "vertical":
                return <div 
                            className="fieldDropTarget" 
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e)}
                            style={{ border: isDraggingOver ? '2px dashed #7087E7' : 'none', color: '#DDE4FF' }}
                        ></div>
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
    const [draggedItem, setDraggedItem] = useState(dragItem);
    const [formFields, setFormFields] = useState(fields);

    handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    handleClickOutside = (e) => {
        setActiveField(null);
    };

    handleDragStart = (e, dragged) => {
        // Update draggedItem
        setDraggedItem(dragged)
    };

    handleDragOver = (e) => {
        // Calculate where the field would be dropped
        // if over row 1 then ... ?
        // if in between row 1 then ... ?
    };

    renderRowWithDT = (fields) => {
        let prevDrag = false;
        return fields.map((field, i) => {
            if (!!draggedItem.internalName && draggedItem.internalName === field.internalName) {
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
                <FormRow 
                    fields={dataRow} 
                    handleClick={handleClick} 
                    handleClickOutside={handleClickOutside}
                    handleDragStart={handleDragStart}
                    draggedItem
                />
        )

    renderFormWithDT = () => {
        let prevDrag = false;

        const containsDragField = (dataRow) => {
            return dataRow.some(field => field.internalName === draggedItem.internalName);
        };

        return formFields.map((dataRow, i) => {
            if (containsDragField(dataRow)) {
                prevDrag = true;
                return dataRow.length === 1 ?   <FormRow 
                                                    fields={dataRow} 
                                                    handleClick={handleClick} 
                                                    handleClickOutside={handleClickOutside}
                                                    handleDragStart={handleDragStart}
                                                    draggedItem
                                                /> : fieldGroupContainer(renderRowWithDT(dataRow))
            } else if (prevDrag) {
                prevDrag = false;
                if (formFields[i-1].length === 1) {
                    return (
                        <>
                            {formFields[i-1][0].type === 'header' ?
                                <FormRow 
                                    fields={dataRow} 
                                    handleClick={handleClick} 
                                    handleClickOutside={handleClickOutside}
                                    handleDragStart={handleDragStart}
                                    draggedItem
                                /> : fieldGroupContainer(renderRowWithDT(dataRow))
                            }
                            { i+1 === formFields.length && <DropTarget placement={"horizontal"} /> }
                        </>
                    );
                } else {
                    return (
                        <>
                            <DropTarget placement={"horizontal"} />
                            {formFields[i][0].type === 'header' ?
                                <FormRow 
                                    fields={dataRow} 
                                    handleClick={handleClick} 
                                    handleClickOutside={handleClickOutside}
                                    handleDragStart={handleDragStart}
                                    draggedItem
                                /> : fieldGroupContainer(renderRowWithDT(dataRow))
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
                            <FormRow 
                                fields={dataRow} 
                                handleClick={handleClick} 
                                handleClickOutside={handleClickOutside}
                                handleDragStart={handleDragStart}
                                draggedItem
                            /> : fieldGroupContainer(renderRowWithDT(dataRow))
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
                    { Object.keys(draggedItem).length === 0 ? renderForm() : renderFormWithDT() }
                </>
            )}
            <input type="submit" value="Submit" />
        </form>
    )
};


const renderTopDropTarget = (draggedItem, dataRow, prevRow) => {
    if (draggedItem) {
        if (dataRow.length === 1 && draggedItem.internalName === dataRow[0].internalName) {
            return false;
        } else if (prevRow.length === 1 && draggedItem.internalName === prevRow[0].internalName && draggedItem.type === 'header') {
            return false;
        } else {
            return true;
        }
    }

    return false;
}

const renderBottomDropTarget = (draggedItem, dataRow, prevRow, last) => {
    if (draggedItem) {
        if (last) {
            if (dataRow.length === 1 && draggedItem.internalName === dataRow[0].internalName) {
                return false;
            } else if (prevRow.length === 1 && draggedItem.internalName === prevRow[0].internalName && draggedItem.type === 'header') {
                return true;
            } else {
                return true;
            }
        }
    }

    return false;
}

formRows.map((row, i) => {
    const prevRow = formRows[i-1];
    const isLastRow = i + 1 == formRows.length;

    return (
        <>
            <RenderIf isTrue={renderTopDropTarget(draggedItem, row, prevRow)}>
                <DropTarget />
            </RenderIf>
            <FormRow 
                fields={row} 
                handleClick={handleClick} 
                handleClickOutside={handleClickOutside}
                handleDragStart={handleDragStart}
                draggedItem
            />
            <RenderIf isTrue={renderBottomDropTarget(draggedItem, row, prevRow, isLastRow)}>
                <DropTarget />
            </RenderIf>
        </>
    )
});