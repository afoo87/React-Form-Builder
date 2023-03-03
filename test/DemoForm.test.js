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

    it("renders the form title", () => {
        const form = { title: "Contact Form" };
        render(<DemoForm form={form} />);
        expect(document.body.textContent).toContain("Contact Form");
    });
});