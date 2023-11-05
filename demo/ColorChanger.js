import AbstractComponent from "../src/AbstractComponent.js";

export default class ColorChanger extends AbstractComponent {
	onInit() {
		this.element.addEventListener('click', () => {
			this.element.style.backgroundColor = this.getRandomColor();
		});

		this.eventBus.on('alert', (text) => {
			this.element.style.backgroundColor = this.getRandomColor();
		});
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