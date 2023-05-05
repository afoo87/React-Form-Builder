export const isDragged = (dragItem) => Object.keys(dragItem).length > 0;

export const isHeader = f => f.type === 'header';

export const isMatchDragField = (df, f) => df.internalName === f.internalName;

export const isDragExistingField = (dragItem) => isDragged(dragItem) && !!dragItem.internalName;

export const isCurrentFieldDragged = (dragItem, f) => isDragExistingField(dragItem) && isMatchDragField(dragItem, f);

export const isFullRow = (row) => row.length === 3;

export const isAnyFieldsDragged = (row, dragItem) => row.some((f) => isMatchDragField(dragItem, f));

export const isSingleFieldRow = row => row.length === 1;

export const isSingleAndDragged = (row, dragItem) =>  isSingleFieldRow(row) && isMatchDragField(dragItem, row[0]);

export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};