export default class AbstractComponent {
	constructor({element, options, eventBus}) {
		this.element = element;
		this.options = options;
		this.eventBus = eventBus;

		this.eventBus.on('instance:init', () => {
			this.eventBus.off('instance:init');
			this.onInit();
		});

		this.eventBus.on('instance:destroy', () => {
			this.eventBus.off('instance:destroy');
			this.onDestroy();
		});

		this.onCreate();
	}

	onCreate() {};

	onInit() {};

	onDestroy() {};
}