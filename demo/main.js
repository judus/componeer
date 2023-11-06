import Componeer from "../src/Componeer.js";
import ColorChanger from "./ColorChanger.js";
import AlertButton from "./AlertButton.js";
import Router from "../src/addons/Router.js";

const app = new Componeer([
	{
		selector: '.container',
		class: ColorChanger,
		options: {}
	},
]);

app.register({
	selector: '.alert-button',
	class: AlertButton,
	options: {
		alertText: 'Hey, I am a component'
	}
});

app.init();


const colorChanger = app.proxy('ColorChanger');
colorChanger.changeColor();

document.body.querySelector('.destroy-button').addEventListener('click', () => {
	app.destroy('ColorChanger');
});

document.body.querySelector('.recreate-button').addEventListener('click', () => {
	app.recreate('ColorChanger');
});


/* Further usage example */
/*

const router = new Router(app);

router.route('/404', () => {
	console.log('Page not found');
});

router.route('/home', () => {
	app.init('ColorChanger');
});

router.route('/services', () => {
	app.init('ColorChanger');
});

router.init();

 */