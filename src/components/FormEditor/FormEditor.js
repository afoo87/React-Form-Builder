import React, { useState } from "react";
import { DropTarget } from "./DropTarget";
import { EmptyForm } from "./EmptyForm";
import { FormField } from "./FormField";
import { RenderIf } from "./RenderIf";
import { 
    isAnyFieldsDragged,
    isCurrentFieldDragged,
    isDragged,
    isFormEmpty,
    isFullRow,
    isHeader,
    isSingleAndDragged,
} from "./helperFunctions";
import styles from "./styles.css";
import { useFormFields } from "./useFormFields";


const DropTargetContainer = ({ placement, children }) => (
    <div className={styles[`drop-target-container--${placement}`]}>{children}</div>
);


const FormRow = ({ 
    fields,
    handleClick, 
    handleClickOutside,
    setDraggedItem,
    draggedItem,
    rowId,
    handleDrop
}) => {
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
                    <DropTargetContainer placement={"vertical"}>
                        <RenderIf isTrue={isDragged(draggedItem) && hasLeftDropTarget(field, prevField)}>
                            <DropTarget 
                                row={rowId}
                                column={i+1}
                                placement={"vertical"} 
                                handleDrop={handleDrop}
                            />
                        </RenderIf>
                    </DropTargetContainer>
                    <FormField 
                        {...field} 
                        handleClick={handleClick} 
                        handleClickOutside={handleClickOutside}
                        setDraggedItem={setDraggedItem}
                    />
                    <RenderIf isTrue={isLastField}>
                        <DropTargetContainer placement={"vertical"}>
                            <RenderIf isTrue={isLastField && isDragged(draggedItem) && hasRightDropTarget(field)}>
                                <DropTarget
                                    row={rowId}
                                    column={fields.length + 1}
                                    placement={"vertical"}
                                    handleDrop={handleDrop}
                                />
                            </RenderIf>
                        </DropTargetContainer>
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
};


const Form = ({
    draggedItem,
    formFields,
    handleClick,
    handleClickOutside,
    setDraggedItem,
    handleDrop,
}) => {
    const hasTopDropTarget = (currentRow, prevRow) =>
        !(
            isSingleAndDragged(currentRow, draggedItem) ||
            (!!prevRow && isSingleAndDragged(prevRow, draggedItem))
        )

    const hasBottomDropTarget = (currentRow) => 
        !isSingleAndDragged(currentRow, draggedItem)

    return formFields.map((row, i) => {
                let prevRow = formFields[i-1];
                let isLastRow = i + 1 === formFields.length;

                return (
                    <div direction="row" className={styles['ui-flex--row']}>
                        <div className={`${styles['form-field-group-full-container']} ${styles['form-field-group']} ${styles['ui-box']}`}>
                            <div
                                className={styles['ui-flex--column']}
                                direction="column" 
                                wrap="nowrap"
                            >
                                <DropTargetContainer placement={"horizontal"}>
                                    <RenderIf isTrue={isDragged(draggedItem) && hasTopDropTarget(row, prevRow)}>
                                        <DropTarget
                                            row={i+1}
                                            placement={"horizontal"}
                                            handleDrop={handleDrop}
                                        />
                                    </RenderIf>
                                </DropTargetContainer>
                                <FormRow 
                                    fields={row} 
                                    handleClick={handleClick} 
                                    handleClickOutside={handleClickOutside}
                                    setDraggedItem={setDraggedItem}
                                    draggedItem={draggedItem}
                                    rowId={i+1}
                                    handleDrop={handleDrop}
                                />
                                <RenderIf isTrue={isLastRow}>
                                    <DropTargetContainer placement={"horizontal"}>
                                        <RenderIf isTrue={isLastRow && isDragged(draggedItem) && hasBottomDropTarget(row, prevRow)}>
                                            <DropTarget 
                                                row={formFields.length + 1}
                                                placement={"horizontal"}
                                                handleDrop={handleDrop}
                                            />
                                        </RenderIf>
                                    </DropTargetContainer>
                                </RenderIf>
                            </div>
                        </div>
                    </div>
                )
            })
};


export const FormEditor = ({
    fields=[], 
    dragItem={}
}) => {
    const [activeField, setActiveField] = useState(null);
    const [draggedItem, setDraggedItem] = useState(dragItem);
    const {formFields, moveField} = useFormFields(fields);

    const handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    const handleClickOutside = (e) => {
        setActiveField(null);
    };

    const handleDrop = (e, toRow, toCol) => {
        moveField(toRow, toCol, draggedItem);
    };

    return (
        <form style={{width: "100%"}}>
            { isFormEmpty(formFields)
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

