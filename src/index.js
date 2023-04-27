import React from "react";
import { createRoot} from "react-dom/client";
import { FormEditor } from "./FormEditor";

const fourFields = [[{
    type: "single-lined text",
    label: 'First name',
    internalName: 'firstname'
}, {
    type: "single-lined text",
    label: 'Last name',
    internalName: 'lastname'
}, {
    type: "single-lined text",
    label: 'nickname',
    internalName: 'nickname'
}], [{
    type: "header",
    label: 'new header',
    internalName: 'header'
}], [{
    type: "single-lined text",
    label: 'Last name',
    internalName: 'lastname2'
}, {
    type: "single-lined text",
    label: 'nickname',
    internalName: 'nickname2'
}]];

const root = createRoot(document.getElementById("root"));
root.render(<FormEditor fields={fourFields} />);
