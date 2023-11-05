import Container from "../src/Container.js";
import ColorChanger from "./ColorChanger.js";
import AlertButton from "./AlertButton.js";

const app = new Container([
	{
		selector: '.container',
		class: ColorChanger,
		options: {}
	},
	{
		selector: '.alert-button',
		class: AlertButton,
		options: {
			alertText: 'Hey, I am a component'
		}
	}
]);

app.initAll();