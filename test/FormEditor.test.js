import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { FormEditor } from "../src/FormEditor";
import {
    element,
    elements
} from "./testExtensions";

describe("Form Editor", () => {

    let container;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.replaceChildren(container);
    });

    const render = component =>
        act(() => 
            ReactDOM.createRoot(container).render(component)
        );


    it("renders a form", () => {
        render(<FormEditor />);
        expect(element("form")).not.toBeNull();
    });

    it("renders a submit button", () => {
        render(<FormEditor />);
        expect(element("input[type=submit]")).not.toBeNull();
    });

    describe("No fields contained in Form Editor", () => {

        describe("Alert message", () => {

            it("renders alert title", () => {
                const title = "No fields selected";
                render(<FormEditor />);
                expect(elements(".alertTitle")[0].textContent).toContain(title);
            });

            it("renders alert body", () => {
                const body = "You must have at least one field on your form to publish.";
                render(<FormEditor />);
                expect(elements(".alertBody")[0].textContent).toContain(body);
            });

        });

        describe("Drop area", () => {

            it("renders area", () => {
                render(<FormEditor />);
                expect(elements(".dropArea")[0]).not.toBe(undefined);
            });

            it("renders body", () => {
                const body = "Drag and drop a form field here";
                render(<FormEditor />);
                expect(elements(".dropBody")[0].textContent).toContain(body);
            });

        });
    });
});