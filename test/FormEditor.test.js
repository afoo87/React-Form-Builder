import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { FormEditor } from "../src/FormEditor";
import {
    camelize,
    clickAndWait,
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

    describe("Empty Form Editor", () => {

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

    describe("Fields", () => {
        describe("Draggable Container", () => {
            describe("Drag Handle", () => {
                // mouse over and mouse exit events are not supported in jsdom
                // will try react-testing-library with user-events module

                it("renders drag handle active on field on mouse click", async () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'firstName',
                        propertyName: 'firstname'
                    }];
                    render(<FormEditor fields={fields} />);
                    await clickAndWait(element("#firstName"));
                    expect(element('#firstName > .movableAreaContainer--visible')).not.toBeNull();
                });
        
                it("renders drag handle to another field when clicked", async () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'firstName',
                        propertyName: 'firstname'
                    }, {
                        fieldType: "single-lined text",
                        position: 2,
                        row: 1,
                        fieldLabel: 'lastName',
                        propertyName: 'lastname'
                    }];
                    render(<FormEditor fields={fields} />);
                    await clickAndWait(element("#firstName"));
                    await clickAndWait(element("#lastName"));
                    expect(element('#firstName > .movableAreaContainer--visible')).toBeNull();
                    expect(element('#lastName > .movableAreaContainer--visible')).not.toBeNull();
                });

                it("removes drag handle on mouse click outside of any non-field elements", async () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'firstName',
                        propertyName: 'firstname'
                    }, {
                        fieldType: "single-lined text",
                        position: 2,
                        row: 1,
                        fieldLabel: 'lastName',
                        propertyName: 'lastname'
                    }];
                    render(<FormEditor fields={fields} />);
                    await clickAndWait(element("#firstName"));
                    await clickAndWait(element("#lastName"));
                    await clickAndWait(element("#clickableElement"));
                    expect(elements('.movableAreaContainer--visible')).toHaveLength(0);
                });
            }); 

            describe("Single-lined Field", () => {

                it("renders field label", () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'first name',
                        propertyName: 'firstname'
                    }];
                    render(<FormEditor fields={fields} />);
                    expect(element(`label[for=${camelize(fields[0].fieldLabel)}] .externalLabel`).textContent).toContain('first name');
                });
        
                it("renders field property name", () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'first name',
                        propertyName: 'firstname'
                    }];
                    render(<FormEditor fields={fields} />);
                    expect(element(`label[for=${camelize(fields[0].fieldLabel)}] .propertyName`).textContent).toContain('firstname');
                });
        
                it("renders field", () => {
                    const fields = [{
                        fieldType: "single-lined text",
                        position: 1,
                        row: 1,
                        fieldLabel: 'first name',
                        propertyName: 'firstname'
                    }];
                    render(<FormEditor fields={fields} />);
                    expect(element("#firstName input[type=text]")).not.toBeNull();
                });
            });
        });
        

        
    });

});