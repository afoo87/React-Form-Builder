import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { CreatePropertyModal } from "../src/CreatePropertyModal";

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
                    expect(document.getElementsByClassName("stepIndicatorPoint")[0]).not.toBeNull();
                });

                it("renders active step indicator text", () => {
                    render(<CreatePropertyModal />);
                    expect(document.getElementsByClassName("stepIndicatorText")[0].textContent).toContain("Basic Info");
                });
            });
            
            describe("Field Type", () => {
                it("renders step point", () => {
                    render(<CreatePropertyModal />);
                    expect(document.getElementsByClassName("stepIndicatorPoint")[1]).not.toBeNull();
                });

                it("renders step indicator text", () => {
                    render(<CreatePropertyModal />);
                    expect(document.getElementsByClassName("stepIndicatorText")[1].textContent).toContain("Field Type");
                });
            });

        });

        describe("Body", () => {

            describe("BasicInfoStep", () => {
            
                describe("Label Field", () => {
    
                    it("renders label", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.querySelector("label[for=labelInput]")).not.toBeNull();
                    });

                    it("renders 'Label' as content", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.querySelector("label[for=labelInput]").textContent).toContain("Label *");
                    });
        
                    it("renders text field", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.getElementById("labelInput")).not.toBeNull();
                    });

                    it("initially renders an empty text field", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.getElementById("labelInput").textContent).toBe("");
                    });
                });
    
                describe("Description Field", () => {
                    
                    it("renders label", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.querySelector("label[for=fieldDescription")).not.toBeNull();
                    });
                    
    
                    it("renders 'Description' as label content", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.querySelector("label[for=fieldDescription").textContent).toContain("Description");
                    });
    
                    it("renders text field", () => {
                        const step = 1;
                        render(<CreatePropertyModal step={step} />);
                        expect(document.getElementById("fieldDescription")).not.toBeNull();
                    });

                });

                it("renders BasicInfoStep when back button is clicked", () => {
                    const basicInfo = { label: "First name" };
                    const step = 2;
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                            step={step}
                        />
                    );
                    expect(
                        document.getElementById("basicInfoStep")
                    ).not.toBeNull();
                });
            });

            describe("FieldTypeStep", () => {
                it("does not render BasicInfoStep", () => {
                    const basicInfo = { label: "First name" };
                    const step = 2;
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                            step={step}
                        />
                    );
                    expect(
                        document.getElementById("basicInfoStep")
                    ).toBeNull();
                });

                it("renders FieldTypeStep", () => {
                    const basicInfo = { label: "First name" };
                    const step = 2;
                    render(
                        <CreatePropertyModal
                            basicInfo={basicInfo}
                            step={step}
                        />
                    );
                    expect(
                        document.getElementById("fieldTypeStep")
                      ).not.toBeNull();
                });

                it("renders label as title", () => {
                    const basicInfo = { label: "First name" }
                    render(<CreatePropertyModal basicInfo={basicInfo} />);
                    expect(document.querySelector("h4.fieldPropertyName").textContent).toBe("First name");
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

                it("renders search label", () => {

                });

                it("renders search field", () => {

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
                expect(document.querySelector("button.modalCancelBtn")).not.toBeNull();
            });

            it("renders content", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalCancelBtn").textContent).toContain("Cancel");
            });
        });

        describe("Next", () => {
            it("renders button", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalNextBtn")).not.toBeNull();
            });

            it("initially renders button disabled", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalNextBtn").disabled).toBe(true);
            });

            it("renders button content", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalNextBtn").textContent).toContain("Next");
            });

            it("renders enabled button when label field is filled", () => {
                const basicInfo = { label: "First name" };
                render(<CreatePropertyModal basicInfo={basicInfo} />);
                expect(document.querySelector("button.modalNextBtn").disabled).toBe(false);
            });
        });

        describe("Back", () => {
            it("renders button", () => {
                const step = 2;
                const basicInfo = { label: "First name"};
                render(<CreatePropertyModal basicInfo={basicInfo} step={step} />);
                expect(document.querySelector("button.modalBackBtn")).not.toBeNull();
            });
        });
        
    });
        
});