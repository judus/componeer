import AbstractComponent from "../src/addons/AbstractComponent.js";
import NodeManager from "../src/addons/NodeManager.js";
import {cloneTemplate} from "../src/addons/clone-template.js";
import {createTemplate} from "../src/addons/create-template.js";

export default class ColorChanger extends AbstractComponent {
	constructor(options) {
		super(options);
		this.nodes = new NodeManager();

		// Attach a shadow root only if it does not already exist
		if(!this.element.shadowRoot) {
			this.shadowRoot = this.element.attachShadow({mode: 'open'});
		} else {
			this.shadowRoot = this.element.shadowRoot;
			// Optionally, clear the existing shadow root content
			while(this.shadowRoot.firstChild) {
				this.shadowRoot.removeChild(this.shadowRoot.firstChild);
			}
		}
	}

	onInit() {
		this.clickHandler = this.handleClick.bind(this);
		this.element.addEventListener('click', this.clickHandler);
	}

	handleClick() {
		const count = this.nodes.nodes.size;
		const node = cloneTemplate(`<template><div>${count}</div></template>`);
		this.nodes.appendChild(this.shadowRoot, node);
	}

	destroy() {
		this.nodes.clearAll(this.shadowRoot);
		this.element.removeEventListener('click', this.clickHandler);
	}

	changeColor() {
		this.element.style.backgroundColor = this.getRandomColor();
	}

	getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for(let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}