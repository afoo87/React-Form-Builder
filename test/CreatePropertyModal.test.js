import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { CreatePropertyModal } from "../src/components/CreatePropertyModal";
import {
    buttonWithClass,
    element,
    elements,
    clickAndWait
} from "./testExtensions";

describe("CreatePropertyModal", () => {

    let container;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.replaceChildren(container);
    });

    const render = component =>
        act(() =>
            ReactDOM.createRoot(container).render(component)
        )

    describe("Header", () => {
        it("renders title", () => {
            render(<CreatePropertyModal />);
            expect(document.body.textContent).toContain("Create a new property");
        });
    });

    describe("Content", () => {

        describe("StepIndicator", () => {

            describe("Basic Info", () => {

                it("renders active step point", () => {
                    render(<CreatePropertyModal />);
                    expect(elements(".stepIndicatorPoint")[0]).not.toBeNull();
                });

                it("renders active step indicator text", () => {
                    render(<CreatePropertyModal />);
                    expect(elements(".stepIndicatorText")[0].textContent).toContain("Basic Info");
                });
            });
            
            describe("Field Type", () => {
                it("renders step point", () => {
                    render(<CreatePropertyModal />);
                    expect(elements(".stepIndicatorPoint")[1]).not.toBeNull();
                });

                it("renders step indicator text", () => {
                    render(<CreatePropertyModal />);
                    expect(elements(".stepIndicatorText")[1].textContent).toContain("Field Type");
                });
            });

        });

        describe("Body", () => {

            describe("BasicInfoStep", () => {

                describe("Label Field", () => {

                    it("renders label", () => {
                        render(<CreatePropertyModal />);
                        expect(element("label[for=labelInput]")).not.toBeNull();
                    });

                    it("renders 'Label' as content", () => {
                        render(<CreatePropertyModal />);
                        expect(element("label[for=labelInput]").textContent).toContain("Label *");
                    });

                    it("renders text field", () => {
                        render(<CreatePropertyModal />);
                        expect(element("#labelInput")).not.toBeNull();
                    });

                    it("initially renders an empty text field", () => {
                        render(<CreatePropertyModal />);
                        expect(element("#labelInput").textContent).toBe("");
                    });
                });
    
                describe("Description Field", () => {
                    
                    it("renders label", () => {
                        render(<CreatePropertyModal />);
                        expect(element("label[for=fieldDescription")).not.toBeNull();
                    });
                    
    
                    it("renders 'Description' as label content", () => {
                        render(<CreatePropertyModal />);
                        expect(element("label[for=fieldDescription").textContent).toContain("Description");
                    });
    
                    it("renders text field", () => {
                        render(<CreatePropertyModal />);
                        expect(element("#fieldDescription")).not.toBeNull();
                    });

                });

                it("renders BasicInfoStep when back button is clicked", async () => {
                    const basicInfo = { label: "First name" };
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                        />
                    );
                    await clickAndWait(buttonWithClass("modalNextBtn"));
                    await clickAndWait(buttonWithClass("modalBackBtn"));
                    expect(element("#basicInfoStep")).not.toBeNull();
                });
            });

            describe("FieldTypeStep", () => {
                it("does not render BasicInfoStep after clicking Next", async () => {
                    const basicInfo = { label: "First name" };
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                        />
                    );
                    await clickAndWait(buttonWithClass("modalNextBtn"));
                    expect(element("#basicInfoStep")).toBeNull();
                });

                it("does not render FieldTypeStep when clicking Next if label field is empty", async () => {
                    render(<CreatePropertyModal />);
                    await clickAndWait(buttonWithClass("modalNextBtn"));
                    expect(element("#fieldTypeStep")).toBeNull();
                });

                it("renders FieldTypeStep", async () => {
                    const basicInfo = { label: "First name" };
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                        />
                    );
                    await clickAndWait(buttonWithClass("modalNextBtn"));
                    expect(element("#fieldTypeStep")).not.toBeNull();
                });

                it("renders label as title", async () => {
                    const basicInfo = { label: "First name" }
                    render(<CreatePropertyModal basicInfo={basicInfo} />);
                    await clickAndWait(buttonWithClass("modalNextBtn"));
                    expect(element("h4.fieldPropertyName").textContent).toBe("First name");
                });


                /*
                it("renders field type - Checkboxes", () => {

                });

                describe("Sort Dropdown", () => {
                    it("renders label 'Sort'", () => {

                    });

                    it("renders field", () => {

                    });
                });

                describe("Search", () => {
                    it("renders search label", () => {

                    });

                    it("renders search field", () => {

                    });
                });
                

                it("renders options table", () => {

                });

                it("renders back button in footer", () => {

                });
                */
            });
        });
    });

    describe("Footer", () => {
        describe("Cancel", () => {
            it("renders button", () => {
                render(<CreatePropertyModal />);
                expect(buttonWithClass("modalCancelBtn")).not.toBeNull();
            });

            it("renders content", () => {
                render(<CreatePropertyModal />);
                expect(buttonWithClass("modalCancelBtn").textContent).toContain("Cancel");
            });
        });

        describe("Next", () => {
            it("renders button", () => {
                render(<CreatePropertyModal />);
                expect(buttonWithClass("modalNextBtn")).not.toBeNull();
            });

            it("initially renders button disabled", () => {
                render(<CreatePropertyModal />);
                expect(buttonWithClass("modalNextBtn").disabled).toBe(true);
            });

            it("renders button content", () => {
                render(<CreatePropertyModal />);
                expect(buttonWithClass("modalNextBtn").textContent).toContain("Next");
            });

            it("renders enabled button when label field is filled", () => {
                const basicInfo = { label: "First name" };
                render(<CreatePropertyModal basicInfo={basicInfo} />);
                expect(buttonWithClass("modalNextBtn").disabled).toBe(false);
            });
        });

        describe("Back", () => {
            it("renders button", async () => {
                const basicInfo = { label: "First name"};
                render(<CreatePropertyModal basicInfo={basicInfo} />);
                await clickAndWait(buttonWithClass("modalNextBtn"));
                expect(buttonWithClass("modalBackBtn")).not.toBeNull();
            });
        });
        
        describe("Create", () => {
            it("renders button", async () => {
                const basicInfo = { label: "First name"};
                render(<CreatePropertyModal basicInfo={basicInfo} />);
                await clickAndWait(buttonWithClass("modalNextBtn"));
                expect(buttonWithClass("modalCreateBtn")).not.toBeNull();
            });
        });
    });
        
});