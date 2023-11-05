import AbstractComponent from "../src/AbstractComponent.js";

export default class AlertButton extends AbstractComponent {
	onInit() {
		this.element.addEventListener('click', () => {
			alert(this.options.alertText);
		});
	}
}