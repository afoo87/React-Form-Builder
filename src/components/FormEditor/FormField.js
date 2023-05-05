import React from "react";
import { camelize } from "./helperFunctions";
import { useComponentActive } from "../../hooks/useComponentActive";

const FieldLabel = ({ label, internalName }) =>
    <div className="labelWrapper">
        <label htmlFor={camelize(label)}>
            <div className="externalLabel"><span>{label}</span></div>
        </label>
        <small className="internalName">{internalName}</small>
    </div>

export const FormField = ({ 
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
                        style={{ padding: '1px', paddingLeft: '27px', cursor: 'grab' }}
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
};