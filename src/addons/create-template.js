import {createDOM} from './create-dom.js'
export function createTemplate(templateText) {
	const dom = createDOM(templateText);
	return dom.querySelector('template');
}