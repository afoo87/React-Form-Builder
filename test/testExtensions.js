import { act } from "react-dom/test-utils";

export const element = (selector) =>
    document.querySelector(selector);

export const elements = (selector) =>
    document.querySelectorAll(selector);

export const click = (element) =>
    act(() => element.click());

export const clickAndWait = async (element) =>
    act(async () => click(element));

export const buttonWithClass = (className) => 
    element(`button.${className}`);