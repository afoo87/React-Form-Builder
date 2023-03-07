import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { FieldProperties } from "../src/FieldProperties";

describe("Field Properties", () => {

    let container;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.replaceChildren(container);
    });

    const render = component =>
        act(() =>
            ReactDOM.createRoot(container).render(component)
        )

    describe("Create Property", () => {

        it("renders title", () => {
            render(<FieldProperties />);
            expect(document.body.textContent).toContain("Create a new property");
        });
    
        describe("Field Label", () => {

            it("renders label", () => {
                render(<FieldProperties />);
                expect(document.querySelector("label[for=labelInput]")).not.toBeNull();
            });

            it("renders 'Label' as content", () => {
                render(<FieldProperties />);
                expect(document.querySelector("label[for=labelInput]").textContent).toContainText("Label");
            });

            it("renders text field", () => {
                render(<FieldProperties />);
                expect(document.getElementById("labelInput")).not.toBeNull();
            });

        });
        
    });
});