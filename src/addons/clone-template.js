import {createTemplate} from "./create-template.js";

export function cloneTemplate(templateText, deep = true) {
    const template = createTemplate(templateText);
    return template.content.cloneNode(deep);
}