export default class AbstractComponent {
	constructor({element, options, eventBus}) {
		this.element = element;
		this.options = options;
		this.eventBus = eventBus;

		this.eventBus.once('instance:init', () => {
			this.onInit();
		});

		this.eventBus.once('instance:destroy', () => {
			this.onDestroy();
		});

		this.onCreate();
	}

	onCreate() {};

	onInit() {};

	onDestroy() {};
}