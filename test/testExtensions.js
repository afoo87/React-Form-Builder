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

export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

export const labelFor = (formElement) =>
    element(`label[for=${formElement}]`);