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

    const handleDrop = (e, row, column=null) => {
        // Calculate Drop Target Location
        // Get id of dropped item
        // Apply changes
        console.log(row);
        console.log(column);
        JSON.parse(e.dataTransfer.getData('text/plain'));
    };

    return (
        <div className={placement === "horizontal" ? 'fieldGroupDropTarget' : 'fieldDropTarget'}>
            <DropzoneHolder>
                <FormFieldDropzone
                    handleDragOver={(e) => handleDragOver(e)}
                    handleDragLeave={(e) => handleDragLeave(e)}
                    handleDrop={(e) => handleDrop(e, row, column)}
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