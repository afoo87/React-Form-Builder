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

describe("FormEditor", () => {
    const singleField = [[{
        type: "single-lined text",
        label: 'First name',
        propertyName: 'firstname'
    }]];

    const twoFields = [[{
        type: "single-lined text",
        label: 'First name',
        propertyName: 'firstname'
    }, {
        type: "single-lined text",
        label: 'Last Name',
        propertyName: 'lastname'
    }]];

    const threeFields = [[{
        type: "single-lined text",
        label: 'First name',
        propertyName: 'firstname'
    }, {
        type: "single-lined text",
        label: 'Last name',
        propertyName: 'lastname'
    }, {
        type: "single-lined text",
        label: 'nickname',
        propertyName: 'nickname'
    }]];

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

    describe("Draggable Container", () => {
        describe("Drag Handle", () => {
            it("renders drag handle active on field on mouse click", async () => {
                render(<FormEditor fields={singleField} />);
                await clickAndWait(element('#firstName'));
                expect(element('#firstName > .movableAreaContainer--visible')).not.toBeNull();
            });
    
            it("renders drag handle to another field when clicked", async () => {
                render(<FormEditor fields={twoFields} />);
                await clickAndWait(element("#firstName"));
                await clickAndWait(element("#lastName"));
                expect(element('#firstName > .movableAreaContainer--visible')).toBeNull();
                expect(element('#lastName > .movableAreaContainer--visible')).not.toBeNull();
            });

            it("removes drag handle on mouse click outside of any non-field elements", async () => {
                render(<FormEditor fields={twoFields} />);
                await clickAndWait(element("#firstName"));
                await clickAndWait(element("#lastName"));
                await clickAndWait(document.body);
                expect(elements('.movableAreaContainer--visible')).toHaveLength(0);
            });
        }); 
    });

    describe("Fields", () => {
        it("renders field label", () => {
            render(<FormEditor fields={singleField} />);
            expect(element(`label[for=${camelize(singleField[0][0].label)}] .externalLabel`).textContent).toContain('First name');
        });

        it("renders field property name", () => {
            render(<FormEditor fields={singleField} />);
            expect(element(`small.propertyName`).textContent).toContain('firstname');
        });

        it("renders two fields in one row", () => {
            render(<FormEditor fields={twoFields} />);
            expect(elements(".formFieldFullGroupContainer .formField").length).toBe(2);
        });

        it("renders three fields in one row", () => {
            render(<FormEditor fields={threeFields} />);
            expect(elements(".formFieldFullGroupContainer .formField").length).toBe(3);
        });

        describe("Single-lined Field", () => {
            it("renders field", () => {
                render(<FormEditor fields={singleField} />);
                expect(element("#firstName input[type=text]")).not.toBeNull();
            });
        });

        describe("Number", () => {
            it("renders field", () => {
                const fields = [[{
                    type: "number",
                    position: 1,
                    row: 1,
                    label: 'phone number',
                    propertyName: 'phonenumber'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#phoneNumber input[type=number]")).not.toBeNull();
            });
        });

        describe("Single checkbox", () => {
            it("renders field", () => {
                const fields = [[{
                    type: "boolean checkbox",
                    position: 1,
                    row: 1,
                    label: 'Single Checkbox',
                    propertyName: 'checkbox'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#singleCheckbox input[type=checkbox]")).not.toBeNull();
            });
        });

        describe("Checkboxes", () => {
            it("renders field", () => {
                const fields = [[{
                    type: "checkboxes",
                    position: 1,
                    row: 1,
                    options: [
                        {text: "apple", value: "apple"},
                        {text: "banana", value: "banana"}],
                    label: 'Fruit Checkbox',
                    propertyName: 'checkboxes'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("input[id=fruitCheckbox0]")).not.toBeNull();
                expect(element("input[id=fruitCheckbox1]")).not.toBeNull();
            });
        });

        describe("Dropdown", () => {
            const dropDownField = [[{
                type: "dropdown",
                position: 1,
                row: 1,
                options: [
                    {text: "apple", value: "apple"},
                    {text: "banana", value: "banana"}],
                label: 'Fruit Dropdown',
                propertyName: 'dropdown'
            }]];

            it("renders field", () => {
                render(<FormEditor fields={dropDownField} />);
                expect(element("#fruitDropdown select")).not.toBeNull();
            });

            it("initially has a blank value chosen", () => {
                render(<FormEditor fields={dropDownField} />);
                expect(element("#fruitDropdown select").childNodes[0].value).toEqual("");
            });

            it("pre-selects the existing value", () => {
                const fields = [[{
                    type: "dropdown",
                    position: 1,
                    row: 1,
                    options: [
                        {text: "apple", value: "apple"},
                        {text: "banana", value: "banana"}],
                    preselected: "apple",
                    label: 'Fruit Dropdown',
                    propertyName: 'dropdown'
                }]];
                render(<FormEditor fields={fields} />);
                expect(Array.from(element("#fruitDropdown select").childNodes).find((option) => option.textContent === "apple").selected).toBe(true);
            });
        });

        describe("Multi-line Text", () => {
            it("renders field", () => {
                const fields = [[{
                    type: "multi-line text",
                    label: 'Optional Comment',
                    propertyName: 'optcomment'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#optionalComment textarea")).not.toBeNull();
            });
        });

        describe("Radio", () => {
            it("renders buttons", () => {
                const fields = [[{
                    type: "radio",
                    options: [
                        {text: "apple", value: "apple"},
                        {text: "banana", value: "banana"}],
                    preselected: "apple",
                    label: 'Fruit Radio',
                    propertyName: 'radio'
                }]];
                render(<FormEditor fields={fields} />);
                fields[0][0].options.forEach((opt) => {
                    expect(element(`input[type=radio][value=${opt.value}]`)).not.toBeNull();
                });
            });

            it("initially has blank value chosen", () => {
                const fields = [[{
                    type: "radio",
                    options: [
                        {text: "apple", value: "apple"},
                        {text: "banana", value: "banana"}],
                    preselected: "apple",
                    label: 'Fruit Radio',
                    propertyName: 'radio'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("input[type=radio]:checked")).toBeNull();
            });
        });

        describe("Header", () => {
            it("renders field", () => {
                const fields = [[{
                    type: "header",
                    style: { header: 1},
                    label: 'This is a sample header.',
                    propertyName: 'sampleheader'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("h1").textContent).toContain("This is a sample header.");
            });
        });
    });

    describe("Drop Target", () => {
        it("renders no drop targets around current dragged field if exists in form and is 'Header'", () => {
            const headerField = [[{
                type: "header",
                label: 'sample header',
                propertyName: 'sampleheader'
            }]];
            const draggedField = {
                type: "header",
                label: camelize(headerField[0][0].label)
            };
            render(<FormEditor fields={headerField} dragItem={draggedField} />);
            expect(elements(".fieldGroupDropTarget").length).toBe(0);
            expect(elements(".fieldDropTarget").length).toBe(0);
        });

        it("renders no drop targets around current dragged field if field is only one in row", () => {
            const draggedField = {
                type: singleField[0][0].type,
                label: camelize(singleField[0][0].label)
            };
            render(<FormEditor fields={singleField} dragItem={draggedField} />);
            expect(elements(".fieldGroupDropTarget").length).toBe(0);
            expect(elements(".fieldDropTarget").length).toBe(0);
        });

        it("renders drop targets around field if dragged is new field", () => {
            const draggedField = {
                type: 'single-lined text'
            };
            render(<FormEditor fields={singleField} dragItem={draggedField} />);
            expect(elements(".fieldGroupDropTarget").length).toBe(2);
            expect(elements(".fieldDropTarget").length).toBe(2);
        });

        it("renders drop targets above and below existing 'Header' field if dragged is new field", () => {
            const draggedField = {
                type: 'single-lined text'
            };
            const headerField = [[{
                type: "header",
                style: { header: 1},
                label: 'This is a sample header.',
                propertyName: 'sampleheader'
            }]];
            render(<FormEditor fields={headerField} dragItem={draggedField} />);
            expect(elements(".fieldGroupDropTarget").length).toBe(2);
            expect(elements(".fieldDropTarget").length).toBe(0);
        });

        it("renders drop targets between fields with rows of length two and dragged is new field", () => {
            const draggedField = {
                type: 'single-lined text'
            };
            render(<FormEditor fields={twoFields} dragItem={draggedField} />);
            expect(elements(".fieldDropTarget").length).toBe(3);
        });

        it("renders drop targets between fields  in the same row as current dragged field but not between dragged field", () => {
            const draggedField = {
                type: 'single-lined text',
                label: 'nickname'
            };
            const twoFields = [[{
                type: "single-lined text",
                label: 'First name',
                propertyName: 'firstname'
            }, {
                type: "single-lined text",
                label: 'Last name',
                propertyName: 'lastname'
            }, {
                type: "single-lined text",
                label: 'nickname',
                propertyName: 'nickname'
            }]];
            render(<FormEditor fields={twoFields} dragItem={draggedField} />);
            expect(elements(".fieldDropTarget").length).toBe(2);
        });
    });
});