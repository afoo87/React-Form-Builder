import React from "react";

export const RenderIf = ({ children, isTrue }) => isTrue ? children : null

export const isHeader = f => f.type === 'header';
export const isMatchDragField = (df, f) => df.internalName === f.internalName;

export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};