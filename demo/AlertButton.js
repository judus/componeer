import AbstractComponent from "../src/addons/AbstractComponent.js";

export default class AlertButton extends AbstractComponent {
	onInit() {
		this.handleClick = this.alert.bind(this);
		this.element.addEventListener('click', this.handleClick);
	}

	destroy() {
		this.element.removeEventListener('click', this.handleClick);
	}

	alert() {
		alert(this.options.alertText);
	}
}