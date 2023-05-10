import { useState, useEffect } from "react";
import { 
    arrMove, 
    isMoreThanOneFieldRow 
} from "./helperFunctions";

export const useFormFields = (fields) => {
    const [formFields, setFormFields] = useState(fields);

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

    const moveField = (toRow, toCol, draggedItem) => {
        const element = draggedItem.internalName ? findDraggedItem(formFields, draggedItem.internalName) : draggedItem; // either a new element or look up the element in formFields by internalName and get index?
        const {fromRow, fromCol} = findDraggedItemLocation(formFields, draggedItem.internalName);
        const newFormFields = [];
        const positionMatch = (pos, matchPos) => pos === matchPos;
        const rowPosMatch = (pos, to, from) => positionMatch(pos, to) && positionMatch(pos, from);
        formFields.map((row, i) => {
            if (rowPosMatch(i+1, toRow, fromRow) && toCol !== null) {
                // moving between the same row
                if (fromCol < toCol) {
                    // moving right
                    newFormFields.push(arrMove(row, fromCol - 1, toCol - 2));
                } else {
                    // moving left
                    newFormFields.push(arrMove(row, fromCol - 1, toCol - 1));
                }
            } else if (rowPosMatch(i+1, toRow, fromRow) && toCol === null) {
                // moving to a new row just one above
                newFormFields.push([element]);
                newFormFields.push([...row.slice(0, fromCol - 1), ...row.slice(fromCol)]);
            } else if (positionMatch(i+1, fromRow) && toCol === null) {
                // moving to a new row - REMOVE element from existing row
                if (isMoreThanOneFieldRow(row)) {
                    newFormFields.push([...row.slice(0, fromCol - 1), ...row.slice(fromCol)]);
                }
            } else if (positionMatch(i+1, toRow) && toCol === null) {
                // moving to a new row - ADD element to a new row
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
                    // add to beginning
                    newFormFields.push([element, ...row.slice(toCol - 1, row.length)]);
                } else {
                    // add any where else in the row
                    newFormFields.push([...row.slice(0, toCol - 1), element, ...row.slice(toCol - 1, row.length)]);
                }
            } else if (i === formFields.length - 1 && positionMatch(formFields.length + 1, toRow) && toCol === null) {
                // add element to last row

                // append old last row
                newFormFields.push(row);
                // append new last row
                newFormFields.push([element]);
            } else {
                newFormFields.push(row);
            }
        });
        setFormFields(newFormFields);
    };

    return {
        formFields,
        moveField
    }
};