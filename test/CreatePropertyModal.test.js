import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { CreatePropertyModal } from "../src/CreatePropertyModal";

describe("Create Property Modal", () => {

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

        describe("Step Indicator", () => {

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

            describe("Basic Info Step", () => {
            
                describe("Label Field", () => {
    
                    it("renders label", () => {
                        render(<CreatePropertyModal />);
                        expect(document.querySelector("label[for=labelInput]")).not.toBeNull();
                    });

                    it("renders 'Label' as content", () => {
                        render(<CreatePropertyModal />);
                        expect(document.querySelector("label[for=labelInput]").textContent).toContain("Label *");
                    });
        
                    it("renders text field", () => {
                        render(<CreatePropertyModal />);
                        expect(document.getElementById("labelInput")).not.toBeNull();
                    });
    
                });
    
                describe("Description Field", () => {
                    
                    it("renders label", () => {
                        render(<CreatePropertyModal />);
                        expect(document.querySelector("label[for=fieldDescription")).not.toBeNull();
                    });
                    
    
                    it("renders 'Description' as label content", () => {
                        render(<CreatePropertyModal />);
                        expect(document.querySelector("label[for=fieldDescription").textContent).toContain("Description");
                    });
    
                    it("renders text field", () => {
                        render(<CreatePropertyModal />);
                        expect(document.getElementById("fieldDescription")).not.toBeNull();
                    });
                });
            });

            describe("Field Type Step", () => {
                // Set up includes valid inputs for Basic Info Step
                // then click through to Field Type Step
                
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
            it("renders next button", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalNextBtn")).not.toBeNull();
            });

            it("renders content", () => {
                render(<CreatePropertyModal />);
                expect(document.querySelector("button.modalNextBtn").textContent).toContain("Next");
            });
        });
        
    });
        
});