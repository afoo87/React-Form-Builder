import React, { useState } from "react";
import styles from "./styles.css";

const DropzoneHolder = ({ children }) => (
    <div className={styles['dropzone-holder']}>
        {children}
    </div>
);

const FormFieldDropzone = ({
    placement,
    handleDragOver,
    handleDragLeave,
    handleDrop
}) =>
    <div
        className={`${styles['form-field-dropzone']} ${styles[`form-field-dropzone--${placement}`]}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    ></div>

const DashedDropzone = ({ placement, isDraggingOver }) =>
    <div 
        className={`${styles['dashed-dropzone']} ${styles[`dashed-dropzone--${placement}`]} ${isDraggingOver ? styles['dashed-dropzone-hover'] : ''}`} 
    />

export const DropTarget = ({ 
    placement, 
    row, 
    column=null,
    handleDrop
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

    const handleDropTarget = (e, row, column=null) => {
        // Calculate Drop Target Location
        // Get id of dropped item
        // Apply changes
        handleDrop(e, row, column);
    };

    return (
        <div className={placement === "horizontal" ? 'fieldGroupDropTarget' : 'fieldDropTarget'}>
            <DropzoneHolder>
                <FormFieldDropzone
                    handleDragOver={(e) => handleDragOver(e)}
                    handleDragLeave={(e) => handleDragLeave(e)}
                    handleDrop={(e) => handleDropTarget(e, row, column)}
                    placement={placement}
                />
                <DashedDropzone 
                    placement={placement}
                    isDraggingOver={isDraggingOver}
                />
            </DropzoneHolder>
        </div>
    )
};