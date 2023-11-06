import {createTemplate} from "./create-template.js";

export function cloneTemplate(templateText, deep = true) {
    // Use createTemplate to get the template element from the string
    const template = createTemplate(templateText);

    // Clone the content of the template
    return template.content.cloneNode(deep);
}