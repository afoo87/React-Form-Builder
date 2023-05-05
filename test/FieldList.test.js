import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { FieldList } from "../src/components/FieldList";

describe("FieldList", () => {

    let container

    beforeEach(() => {
        container = document.createElement("div");
        document.body.replaceChildren(container);
    });

    const render = component =>
        act(() => 
            ReactDOM.createRoot(container).render(component)
        );

    it("renders section title", () => {
        render(<FieldList />);
        expect(document.body.textContent).toContain("Form Fields");
    });

    describe("Field Tile", () => {
        const itRendersDragHandle = (fieldName) =>
            it("renders drag handle", () => {
                render(<FieldList />);
                expect(document.getElementById(fieldName).textContent).toContain("... ...");
            });

        const itRendersFieldName = (fieldName, title) =>
            it("renders field name", () => {
                render(<FieldList />);
                expect(document.getElementById(fieldName).textContent).toContain(title);
            });
            
        describe("Single-lined Text", () => {
            itRendersDragHandle("singleLinedText");
            itRendersFieldName("singleLinedText", "Single-lined Text");
        });

        describe("Number", () => {
            itRendersDragHandle("number");
            itRendersFieldName("number", "Number");
        });

        describe("Multiline Text", () => {
            itRendersDragHandle("multilineText");
            itRendersFieldName("multilineText", "Multiline Text");
        });

        describe("Dropdown", () => {
            itRendersDragHandle("dropdown");
            itRendersFieldName("dropdown", "Dropdown");
        });

        describe("Radio", () => {
            itRendersDragHandle("radio");
            itRendersFieldName("radio", "Radio");
        });

        describe("Date", () => {
            itRendersDragHandle("date");
            itRendersFieldName("date", "Date");
        });

        describe("Checkboxes", () => {
            itRendersDragHandle("checkboxes");
            itRendersFieldName("checkboxes", "Checkboxes");
        });

        describe("Header", () => {
            itRendersDragHandle("header");
            itRendersFieldName("header", "Header");
        });
    });
});