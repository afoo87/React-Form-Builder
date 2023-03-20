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
    const singleField = [[{
        fieldType: "single-lined text",
        fieldLabel: 'First name',
        propertyName: 'firstname'
    }]];

    const twoFields = [[{
        fieldType: "single-lined text",
        fieldLabel: 'First name',
        propertyName: 'firstname'
    }, {
        fieldType: "single-lined text",
        fieldLabel: 'Last Name',
        propertyName: 'lastname'
    }]];

    const threeFields = [[{
        fieldType: "single-lined text",
        fieldLabel: 'First name',
        propertyName: 'firstname'
    }, {
        fieldType: "single-lined text",
        fieldLabel: 'Last name',
        propertyName: 'lastname'
    }, {
        fieldType: "single-lined text",
        fieldLabel: 'nickname',
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
                await clickAndWait(element("#clickableElement"));
                expect(elements('.movableAreaContainer--visible')).toHaveLength(0);
            });
        }); 
    });

    describe("Fields", () => {
        it("renders field label", () => {
            render(<FormEditor fields={singleField} />);
            expect(element(`label[for=${camelize(singleField[0][0].fieldLabel)}] .externalLabel`).textContent).toContain('First name');
        });

        it("renders field property name", () => {
            render(<FormEditor fields={singleField} />);
            expect(element(`label[for=${camelize(singleField[0][0].fieldLabel)}] .propertyName`).textContent).toContain('firstname');
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
                    fieldType: "number",
                    position: 1,
                    row: 1,
                    fieldLabel: 'phone number',
                    propertyName: 'phonenumber'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#phoneNumber input[type=number]")).not.toBeNull();
            });
        });

        describe("Single checkbox", () => {
            it("renders field", () => {
                const fields = [[{
                    fieldType: "boolean checkbox",
                    position: 1,
                    row: 1,
                    fieldLabel: 'Single Checkbox',
                    propertyName: 'checkbox'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#singleCheckbox input[type=checkbox]")).not.toBeNull();
            });
        });

        describe("Checkboxes", () => {
            it("renders field", () => {
                const fields = [[{
                    fieldType: "checkboxes",
                    position: 1,
                    row: 1,
                    values: ["apple", "banana"],
                    fieldLabel: 'Fruit Checkbox',
                    propertyName: 'checkboxes'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("input[id=fruitCheckbox0]")).not.toBeNull();
                expect(element("input[id=fruitCheckbox1]")).not.toBeNull();
            });
        });

        describe("Dropdown", () => {
            const dropDownField = [[{
                fieldType: "dropdown",
                position: 1,
                row: 1,
                values: ["apple", "banana"],
                fieldLabel: 'Fruit Dropdown',
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
                    fieldType: "dropdown",
                    position: 1,
                    row: 1,
                    values: ["apple", "banana"],
                    preselected: "apple",
                    fieldLabel: 'Fruit Dropdown',
                    propertyName: 'dropdown'
                }]];
                render(<FormEditor fields={fields} />);
                expect(Array.from(element("#fruitDropdown select").childNodes).find((option) => option.textContent === "apple").selected).toBe(true);
            });
        });

        describe("Multi-line Text", () => {
            it("renders field", () => {
                const fields = [[{
                    fieldType: "multi-line text",
                    fieldLabel: 'Optional Comment',
                    propertyName: 'optcomment'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("#optionalComment textarea")).not.toBeNull();
            });
        });

        describe("Radio", () => {
            it("renders buttons", () => {
                const fields = [[{
                    fieldType: "radio",
                    values: ["apple", "banana"],
                    preselected: "apple",
                    fieldLabel: 'Fruit Radio',
                    propertyName: 'radio'
                }]];
                render(<FormEditor fields={fields} />);
                fields[0][0].values.forEach((x) => {
                    expect(element(`input[type=radio][value=${x}]`)).not.toBeNull();
                });
            });

            it("initially has blank value chosen", () => {
                const fields = [[{
                    fieldType: "radio",
                    values: ["apple", "banana"],
                    preselected: "apple",
                    fieldLabel: 'Fruit Radio',
                    propertyName: 'radio'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("input[type=radio]:checked")).toBeNull();
            });
        });

        describe("Header", () => {
            it("renders field", () => {
                const fields = [[{
                    fieldType: "header",
                    style: { header: 1},
                    fieldLabel: 'This is a sample header.',
                    propertyName: 'sampleheader'
                }]];
                render(<FormEditor fields={fields} />);
                expect(element("h1").textContent).toContain("This is a sample header.");
            });
        });
    });

    describe("Drop Targets", () => {
        describe("Form Field", () => {
            describe("Field Group Drop Target", () => {
                it("does not render targets when not dragging", () => {
                    render(
                        <FormEditor 
                            fields={singleField} 
                        />
                    );
                    expect(elements(".fieldGroupDropTarget").length).toBe(0);
                });

                it("renders targets on drag", () => {
                    const dragItem = {
                        fieldType: "radio"
                    };
                    render(
                        <FormEditor 
                            dragItem={dragItem} 
                            fields={singleField} 
                        />
                    );
                    expect(elements(".fieldGroupDropTarget").length).toBe(2);
                });
            });
            

            describe("Form Field Drop Targets", () => {
                it("renders two targets when single field exists", () => {
                    const dragItem = {
                        fieldType: "radio"
                    };
                    render(
                        <FormEditor 
                            dragItem={dragItem} 
                            fields={singleField} 
                        />
                    );
                    expect(elements(".formFieldDropTarget").length).toBe(2);
                });

                it("renders three targets when two fields exists in the same row", () => {
                    const dragItem = {
                        fieldType: "radio"
                    };
                    render(
                        <FormEditor 
                            dragItem={dragItem} 
                            fields={twoFields} 
                        />
                    );
                    expect(elements(".formFieldDropTarget").length).toBe(3);
                });
            })
            
        });

        describe("Existing Field", () => {
            it("renders Field Group Drop Targets", () => {
                const dragItem = {
                    row: 1,
                    position: 2
                };
                render(
                    <FormEditor 
                        draggingField={draggingFormField} 
                        fields={twoFields} 
                    />
                );
                expect(elements(".fieldGroupDropTarget").length).toBe(2);
            });

            it.skip("renders Form Field Drop Targets", () => {
                
            });
        });
    });
});