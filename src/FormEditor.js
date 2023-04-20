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
    draggedItem,
    rowId,
    handleDrop
}) => {

    const dragged = Object.keys(draggedItem).length > 0;
    const isDragExistingField = dragged && !!draggedItem.internalName;
    const isMatchDragField = f => draggedItem.internalName === f.internalName;
    const isDraggedCurrentField = f => isDragExistingField && isMatchDragField(f);
    const isHeader = f => f.type === 'header';

    const hasLeftDropTarget = (field, prevField) => {
        if (isHeader(draggedItem) || isHeader(field)) {
            return false;
        } 
        if (isDraggedCurrentField(field)) {
            return false;
        } 
        if (prevField && isDraggedCurrentField(prevField)) {
            return false;
        }
        return true;
    }

    const hasRightDropTarget = (field, prevField, isLastField) => {
        if (draggedItem.type === 'header' || field.type === 'header') {
            return false;
        } 
        if (isDraggedCurrentField(field)) {
            return false;
        } 
        if (prevField && isDraggedCurrentField(prevField)) {
            return isLastField;
        }
        return isLastField;
    }

    renderRow = () => {
        return fields.map((field, i) => {
            let prevField = fields[i-1];
            let isLastField = i + 1 === fields.length;

            return (
                <>
                    <RenderIf isTrue={dragged && hasLeftDropTarget(field, prevField)}>
                        <DropTarget 
                            row={rowId}
                            column={i+1}
                            placement={"vertical"} 
                            handleDrop={handleDrop}
                        />
                    </RenderIf>
                    <FormField 
                        {...field} 
                        handleClick={handleClick} 
                        handleClickOutside={handleClickOutside}
                        handleDragStart={handleDragStart}
                    />
                    <RenderIf isTrue={dragged && hasRightDropTarget(field, prevField, isLastField)}>
                        <DropTarget
                            row={rowId}
                            column={fields.length + 1}
                            placement={"vertical"}
                            handleDrop={handleDrop}
                        />
                    </RenderIf>
                </>
            )
        })
    }

    return (
        <div 
            wrap="nowrap" 
            direction="row" 
            className="formFieldFullGroupContainer" 
            style={{ display: 'flex' }}
        >
            {renderRow()}
        </div>
    )
}


const DropTarget = ({ placement, row, column=null }) => {
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

    handleDrop = (e, row, column) => {
        setFormFields()
    };

    renderForm = () => {
        const dragged = Object.keys(draggedItem).length > 0;
        const isSingleFieldRow = row => row.length === 1;
        const isMatchDragField = f => draggedItem.internalName === f.internalName;
        const isSingleAndDragged = row =>  isSingleFieldRow(row) && isMatchDragField(row[0]);
        const isHeader = field => field.type === 'header';

        const hasTopDropTarget = (dataRow, prevRow) => {
            if (isSingleAndDragged(dataRow)) {
                return false;
            }
            if (prevRow && isSingleAndDragged(prevRow) && isHeader(draggedItem)) {
                return false;
            }

            return true;
        }

        const hasBottomDropTarget = (dataRow, prevRow) => {
            if (isSingleAndDragged(dataRow)) {
                return false;
            } 
            if (prevRow && !(isSingleAndDragged(prevRow) && isHeader(draggedItem))) {
                return false;
            }
            return true;

        }

        return formFields.map((row, i) => {
                    let prevRow = formFields[i-1];
                    let isLastRow = i + 1 === formFields.length;

                    return (
                        <>
                            <RenderIf isTrue={dragged && hasTopDropTarget(row, prevRow)}>
                                <DropTarget
                                    row={i+1}
                                    placement={"horizontal"}
                                    handleDrop={handleDrop}
                                />
                            </RenderIf>
                            <FormRow 
                                fields={row} 
                                handleClick={handleClick} 
                                handleClickOutside={handleClickOutside}
                                handleDragStart={handleDragStart}
                                draggedItem={draggedItem}
                                rowId={i+1}
                                handleDrop={handleDrop}
                            />
                            <RenderIf isTrue={dragged && isLastRow && hasBottomDropTarget(row, prevRow)}>
                                <DropTarget 
                                    row={formFields.length + 1}
                                    placement={"horizontal"}
                                    handleDrop={handleDrop}
                                />
                            </RenderIf>
                        </>
                    )
                })
    }

    return (
        <form>
            { formFields == false ? <EmptyForm /> : renderForm() }
            <input type="submit" value="Submit" />
        </form>
    )
};