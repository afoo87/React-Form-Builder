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
    isMoreThanOneFieldRow,
    isSingleAndDragged,
    isSingleFieldRow,
} from "./helperFunctions";
import styles from "./styles.css";


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
    const [formFields, setFormFields] = useState(fields);

    const handleClick = (e, fieldId) => {
        setActiveField(fieldId);
    };

    const handleClickOutside = (e) => {
        setActiveField(null);
    };

    const moveField = (fields, draggedItem, toRow, toCol, fromRow, fromCol) => {
        const element = draggedItem.internalName ? findDraggedItem(fields, draggedItem.internalName) : draggedItem; // either a new element or look up the element in formFields by internalName and get index?
        const newFormFields = [];
        fields.map((row, i) => {
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
    };

    const findDraggedItem = (fields, internalName) => {
        for (let r = 0; r < fields.length; r++) {
            for (let c = 0; c < fields[r].length; c++) {
                if (fields[r][c].internalName === internalName) {
                    return fields[r][c];
                }
            }
        }
    };

    const findDraggedItemLocation = (fields, internalName) => {
        for (let r = 0; r < fields.length; r++) {
            for (let c = 0; c < fields[r].length; c++) {
                if (fields[r][c].internalName === internalName) {
                    return { fromRow: r + 1, fromCol: c + 1};
                }
            }
        }
    };

    const move = (arr, from, to) => {
        const clone = [...arr];
        Array.prototype.splice.call(clone, to, 0,
          Array.prototype.splice.call(clone, from, 1)[0]
        );
        return clone;
    };

    const handleDrop = (e, toRow, toCol) => {
        const element = draggedItem.internalName ? findDraggedItem(formFields, draggedItem.internalName) : draggedItem; // either a new element or look up the element in formFields by internalName and get index?
        const {fromRow, fromCol} = findDraggedItemLocation(formFields, draggedItem.internalName);
        const newFormFields = [];
        const positionMatch = (pos, match_pos) => pos === match_pos;
        const rowPosMatch = (pos, to, from) => positionMatch(pos, to) && positionMatch(pos, from);
        formFields.map((row, i) => {
            if (rowPosMatch(i+1, toRow, fromRow) && toCol !== null) {
                // moving between the same row
                if (fromCol < toCol) {
                    newFormFields.push(move(row, fromCol - 1, toCol - 2));
                } else {
                    newFormFields.push(move(row, fromCol - 1, toCol - 1));
                }
            } else if (rowPosMatch(i+1, toRow, fromRow) && toCol === null) {
                // moving to a new row just one above
                newFormFields.push([element]);
                newFormFields.push([...row.slice(0, fromCol - 1), ...row.slice(fromCol)]);
            } else if (positionMatch(i+1, fromRow) && toCol === null) {
                // moving to a new row
                //remove element from existing row
                if (isMoreThanOneFieldRow(row)) {
                    newFormFields.push([...row.slice(0, fromCol - 1), ...row.slice(fromCol)]);
                }
            } else if (positionMatch(i+1, toRow) && toCol === null) {
                // add element to a new row
                newFormFields.push([element]);
                // append former row in row position
                newFormFields.push(row);
            } else if (positionMatch(i+1, fromRow) && toCol !== null) {
                // remove element from existing row and append edited row
                if (isMoreThanOneFieldRow(row)) {
                    newFormFields.push([...row.slice(0, fromCol - 1), ...row.slice(fromCol)]);
                }
            } else if (positionMatch(i+1, toRow) && toCol !== null) {
                // add element to an existing row and append edited row
                if (toCol === 1) {
                    newFormFields.push([element, ...row.slice(toCol - 1, row.length)]);
                } else {
                    newFormFields.push([...row.slice(0, toCol - 1), element, ...row.slice(toCol - 1, row.length)]);
                }
            } else {
                newFormFields.push(row);
            }
        });
        setFormFields(newFormFields);
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

