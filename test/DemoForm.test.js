import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { DemoForm } from "../src/DemoForm";

describe("DemoForm", () => {
    
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
        const form = { title: "Contact Form" };
        render(<DemoForm form={form} />);
        expect(document.querySelector("form")).not.toBeNull();
    });

    it("renders the form title", () => {
        const form = { title: "Contact Form" };
        render(<DemoForm form={form} />);
        expect(document.body.textContent).toContain("Contact Form");
    });

    it.skip("renders a text input field", () => {
        const form = { title: "Contact Form", "first name": { type: "input"} };
        render(<DemoForm form={form} />);
        expect(document.querySelector("form").elements["first_name"]).toBeInputFieldOfType("text");
    });
});