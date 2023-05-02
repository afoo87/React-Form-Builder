import React, { useState, useEffect, useRef } from "react";
import { 
    camelize,
    isHeader,
    isMatchDragField,
    RenderIf 
} from "./helperFunctions";

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
    setDraggedItem
}) => {
    const {ref, isComponentActive, setIsComponentActive } = useComponentActive(false, handleClickOutside);

    const renderField = (label, type, options, preselected) => {
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

    const handleDragStart = (e, internalName, label, type) => {
        setDraggedItem({'internalName': internalName, 'label': label, 'type': type});
        // Create a new element as the drag image
        const dragImage = document.createElement('div');

        dragImage.textContent = label;
        dragImage.style.backgroundColor = 'rgb(234, 240, 246)';
        dragImage.style.padding = '8px';
        dragImage.style.borderRadius = '3px';
        // Set the drag image to the new element
        e.dataTransfer.setDragImage(dragImage, 0, 0);
    };
    
    const handleDragEnd = (e) => {
        setDraggedItem({});
    };

    const manageClick = (e, internalName) => {
        handleClick(e, internalName);
        setIsComponentActive(true);
    };

    return (
            <div 
                ref={ref}
                id={camelize(label)}
                onClick={(e) => manageClick(e, internalName)}
            >
                <div className={`movableAreaContainer${isComponentActive ? '--visible': ''}`}>
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, internalName, label, type)}
                        onDragEnd={(e) => handleDragEnd(e)}
                    >
                        <div className="formField">
                            {type !== 'header' && 
                                <FieldLabel 
                                    label={label}
                                    internalName={internalName}
                                />
                            }
                            {renderField(label, type, options, preselected)}
                        </div>
                    </div>
                </div>
            </div>
    )
}

const FormRow = ({ 
    fields, 
    handleClick, 
    handleClickOutside,
    setDraggedItem,
    draggedItem,
    rowId,
    handleDrop
}) => {
    const isDragged = (dragItem) => Object.keys(dragItem).length > 0;
    const isDragExistingField = (dragItem) => isDragged(dragItem) && !!dragItem.internalName;
    const isCurrentFieldDragged = (dragItem, f) => isDragExistingField(dragItem) && isMatchDragField(dragItem, f);
    const isFullRow = (row) => row.length === 3;
    const isAnyFieldsDragged = (row, dragItem) => row.some((f) => isMatchDragField(dragItem, f));

    const hasLeftDropTarget = (field, prevField) =>
        !(
            isHeader(draggedItem) || 
            isHeader(field) ||
            isCurrentFieldDragged(draggedItem, field) ||
            (prevField && isCurrentFieldDragged(draggedItem, prevField)) ||
            (isFullRow(fields) && !isAnyFieldsDragged(fields, draggedItem))
        )

    const hasRightDropTarget = (field) =>
        !(
            isHeader(draggedItem) || 
            isHeader(field) ||
            isCurrentFieldDragged(draggedItem, field) ||
            (isFullRow(fields) && !isAnyFieldsDragged(fields, draggedItem))
        )

    const renderRow = () => {
        return fields.map((field, i) => {
            let prevField = fields[i-1];
            let isLastField = i + 1 === fields.length;

            return (
                <>
                    <div
                        style={{ width: '0', zIndex: '1'}}
                    >
                        <RenderIf isTrue={isDragged(draggedItem) && hasLeftDropTarget(field, prevField)}>
                            <DropTarget 
                                row={rowId}
                                column={i+1}
                                placement={"vertical"} 
                                handleDrop={handleDrop}
                            />
                        </RenderIf>
                    </div>
                    <FormField 
                        {...field} 
                        handleClick={handleClick} 
                        handleClickOutside={handleClickOutside}
                        setDraggedItem={setDraggedItem}
                    />
                    <RenderIf isTrue={isLastField && isDragged(draggedItem) && hasRightDropTarget(field)}>
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
        <div className="formFieldFullGroupContainer">
            <div 
                wrap="nowrap" 
                direction="row"
                style={{ display: 'flex', maxWidth: '100%', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", boxSizing: "border-box" }}
            >
                {renderRow()}
            </div>
        </div>
    )
}


const DropTarget = ({ 
    placement, 
    row, 
    column=null 
}) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
    }

    const handleDrop = (e) => {
        // Calculate Drop Target Location
        // Get id of dropped item
        // Apply changes
        JSON.parse(e.dataTransfer.getData('text/plain'));
    };

    const renderDropTarget = () => {
        switch(placement) {
            case "horizontal":
                return (
                    <div
                        className="dropzoneHolder"
                        style={{ position: 'relative', boxSizing: 'border-box'}}
                    >
                        <div 
                            className="fieldGroupDropTarget" 
                            style={{ height: '18px', width: '479px', border: '2px dashed #7087E7', borderRadius: '6px', borderColor: '#7087E7', backgroundColor: isDraggingOver ? '#7087E7' : '#DDE4FF' }}
                        ></div>
                        <div
                            onDragOver={(e) => handleDragOver(e)}
                            onDragLeave={(e) => handleDragLeave(e)}
                            onDrop={(e) => handleDrop(e)}
                            style={{ height: '65px', top: '-25px', width: '100%', zIndex: '1', position: 'absolute' }}
                        ></div>
                    </div>
                )
                
            case "vertical":
                return (
                        <div
                            className="dropzoneHolder"
                            style={{ position: 'relative', boxSizing: 'border-box' }}
                        >
                            <div 
                                className="fieldDropTarget" 
                                style={{ height: '40px', width: '21px', border: '2px dashed #7087E7', borderRadius: '6px', borderColor: '#7087E7', backgroundColor: isDraggingOver ? '#7087E7' : '#DDE4FF', zIndex: '1' }}
                            ></div>
                            <div
                                onDragOver={(e) => handleDragOver(e)}
                                onDragLeave={(e) => handleDragLeave(e)}
                                onDrop={(e) => handleDrop(e)}
                                style={{ zIndex: '2', top: '-20px', left: '-10px', width: '30px', height: '80px', position: "absolute", boxSizing: 'border-box'}}
                            >
                            </div>
                        </div>
                        )
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

const Form = ({
    draggedItem,
    formFields,
    handleClick,
    handleClickOutside,
    setDraggedItem,
    handleDrop,
}) => {
    const isDragged = (dragItem) => Object.keys(dragItem).length > 0;
    const isSingleFieldRow = row => row.length === 1;
    const isSingleAndDragged = row =>  isSingleFieldRow(row) && isMatchDragField(draggedItem, row[0]);
    const isDraggedAndHeader = (row, dragField) => isSingleAndDragged(row) && isHeader(dragField);

    const hasTopDropTarget = (currentRow, prevRow) => {
        return !(
            isSingleAndDragged(currentRow) ||
            (!!prevRow && isSingleAndDragged(prevRow))
        )
    }

    const hasBottomDropTarget = (currentRow) =>
        !isSingleAndDragged(currentRow)

    return formFields.map((row, i) => {
                let prevRow = formFields[i-1];
                let isLastRow = i + 1 === formFields.length;

                return (
                    <>
                        <div
                            style={{ paddingTop: '6px', paddingLeft: '45px', paddingRight: '18px', width: '100%', height: '16px'}}
                        >
                            <RenderIf isTrue={isDragged(draggedItem) && hasTopDropTarget(row, prevRow)}>
                                <DropTarget
                                    row={i+1}
                                    placement={"horizontal"}
                                    handleDrop={handleDrop}
                                />
                            </RenderIf>
                        </div>
                        <FormRow 
                            fields={row} 
                            handleClick={handleClick} 
                            handleClickOutside={handleClickOutside}
                            setDraggedItem={setDraggedItem}
                            draggedItem={draggedItem}
                            rowId={i+1}
                            handleDrop={handleDrop}
                        />
                        <RenderIf isTrue={isLastRow && isDragged(draggedItem) && hasBottomDropTarget(row, prevRow)}>
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

export const FormEditor = ({
    fields=[], 
    dragItem={}
}) => {
    const [activeField, setActiveField] = useState(null);
    const [draggedItem, setDraggedItem] = useState(dragItem);
    const [formFields, setFormFields] = useState(fields);

    const handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    const handleClickOutside = (e) => {
        setActiveField(null);
    };

    const handleDrop = (e, toRow, toCol) => {
        e.preventDefault();
        const element = draggedItem.internalName ? findDraggedItem(formFields, draggedItem.internalName) : draggedItem; // either a new element or look up the element in formFields by internalName and get index?
        const newFormFields = [];
        formFields.map((row, i) => {
            if (i === toRow) {
                if (toCol === 0) {
                    newFormFields.push(element);
                    newFormFields.push(row);
                } else {
                    newFormFields.push(row.slice(0, toCol - 1) + element + row.slice(toCol, row.length));
                }
            }
            if (i === fromRow) {
                if (row.length > 1) {
                    newFormFields.push([...row.slice(0, fromCol), ...row.slice(fromCol + 1)]);
                }
            } else {
                newFormFields.push(row)
            }
        });
        setFormFields(newFormFields);
        // Or setDrop(Row, Col, Item)
        // then when user saves the new field with internalName... then run the code to setFormFields()
        // This is because when the field is Dropped when it is from the fieldList, it requires an internalName to save.
    };

    return (
        <form style={{width: "100%"}}>
            { formFields == false 
                ?   <EmptyForm /> 
                :   
                    <Form 
                        draggedItem={draggedItem}
                        formFields={formFields}
                        handleClick={handleClick}
                        handleClickOutside={handleClickOutside}
                        setDraggedItem={setDraggedItem}
                        handleDrop={handleDrop}
                    />
            }
            <input type="submit" value="Submit" />
        </form>
    )
};

