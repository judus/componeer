import EventBusProxy from "./EventBusProxy.js";

/**
 * Represents a single component within the application.
 * A component may have multiples instances.
 */
export default class Component {
	/**
	 * Creates a new Component instance.
	 *
	 * @param {Object} config - Array containing the component's name (optional) and configuration object.
	 * @param eventBus
	 * @param context
	 */
	constructor(config, eventBus, context = document) {

        if(!config || typeof config !== 'object') {
            throw new Error('Component configuration must be an object.');
        }

        if(config.class === undefined) {
            throw new Error('A component is missing a class');
        }

        this.eventBus = eventBus;
        this.eventBusProxies = new Map();

        this.name = config.name || config.class.name;
        this.class = config.class || null;
        this.selector = config.selector || null;
        this.options = config.options || null;

        this.identification = config.identification || null;
		this.requires = config.requires || null;
		this.applies = null;

        if(config.applies && typeof config.applies !== 'function') {
            throw new Error('The "applies" configuration must be a function.');
        }

        if(typeof config.applies === 'function') {
            this.applies = config.applies(this);
        }

        this.instances = new Map(); // Use a map to store instances
        this.context = context;
	}

	/**
	 * Initialize the component.
	 *
	 * @param {HTMLElement} [context] - The DOM context for the component.
	 */
	init(context) {
		if(this.applies !== false) {
			if(!this.selector) {
				this.make();
                this.eventBus.emit('instance:init', this.options);
            } else {
                if(context && !(context instanceof HTMLElement)) {
                    throw new Error('Provided context is not an HTMLElement.');
                }

                if(context) this.context = context;
                this.context.querySelectorAll(this.selector).forEach(element => {
                    this.make(element);
                    this.eventBus.emit('instance:init', element, this.options);
                });
            }
        }
	}

    createInstance(config, instanceId = null) {
        console.warn('not implemented yet');
    }

    generateUUID() {
        const random = () => (Math.random() * 0x100000000 >>> 0).toString(16).padStart(8, '0');
        const seed = performance.now() * Math.random();
        const part1 = (seed & 0xFFFFFFFF).toString(16).padStart(8, '0');
        return `${part1}-${random()}-${random()}-${random()}-${random()}`;
    }
	/**
	 * Create an instance of the component.
	 *
	 * @param {HTMLElement} element
	 */
    make(element = null) {
		if(element && !(element instanceof HTMLElement)) {
			throw new Error('Element provided is not an HTMLElement.');
		}

		if(typeof this.class !== 'function') {
			throw new Error(`The class for "${this.name}" component is not a constructor.`);
		}

		if(this.identification && typeof this.identification !== 'function') {
            throw new Error('The identification configuration must be a function.');
        }

        const eventBusProxy = new EventBusProxy(this.eventBus, this);

        const instance = new this.class({
            element: element,
            options: this.options,
            eventBus: eventBusProxy
        });

        const instanceID = this.getInstanceId();
        this.instances.set(instanceID, instance);
        this.eventBusProxies.set(instanceID, eventBusProxy);
    }

    getInstanceId() {
        let instanceID;

        if(typeof this.identification === 'function') {
            instanceID = this.identification();
        } else {
            instanceID = this.generateUUID();
        }

        while(this.instances.has(instanceID)) {
            instanceID += '-' + Math.floor(Math.random() * 1000);
        }

        return instanceID;
    }

    getInstance(id) {
        return this.instances.get(id);
    }

    destroyInstance(id) {
        const instance = this.getInstance(id);
        const eventBusProxy = this.eventBusProxies.get(id);

        if(instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }

        if(eventBusProxy) {
            eventBusProxy.cleanup();
            this.eventBusProxies.delete(id);
        }

        this.instances.delete(id);

        if(!instance) {
            console.warn(`No instance found with ID: ${id}`);
        }
    }

    destroyAllInstances() {
        for(const id of this.instances.keys()) {
            this.destroyInstance(id);
        }
    }
}
