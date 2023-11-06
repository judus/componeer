import Component from "./Component.js";
import EventBus from "./EventBus.js";
import ComponentProxy from "./ComponentProxy.js";

/**
 * Represents the main application controller.
 * It manages components and their lifecycle.
 */
export default class Componeer {
	/**
	 * Creates a new Componeer instance.
	 *
	 * @param {Array} components - Configuration object for the application.
	 * @param context
	 */
	constructor(components, context = document) {

		if(!Array.isArray(components)) {
			throw new Error("The components parameter must be an array.");
		}

		this.components = new Map();
		this.eventBus = new EventBus();
		this.context = this.getContext(context);

		components.forEach((config) => {
			this.register(config);
		});
	}

	register(config) {
		const component = new Component(config, this.eventBus, this.context);
		// Register the component.
		this.components.set(component.name, component);
	}

	getContext(context) {
		if(context instanceof HTMLElement) {
			// The context is already an HTMLElement, return it
			return context;
		} else if(typeof context === 'string') {
			// Try to find the element using the context as a selector
			const element = document.querySelector(context);
			if(element) {
				return element;
			} else {
				// If the selector doesn't match any elements, warn the user
				console.warn(`No element found with the selector '${context}'. Defaulting to 'document'.`);
			}
		}
		// If context is not provided, not a string, not an HTMLElement, or the selector found no element
		return document;
	}

	/**
	 * Initialize a specific component.
	 *
	 * @param {string} componentName - Name of the component to initialize.
	 * @param {HTMLElement} [context] - The DOM context for the component.
	 * @returns {boolean} Indicates whether the initialization was successful.
	 */
	initComponent(componentName, context) {
		if(!this.components.has(componentName)) {
			console.warn(`Component "${componentName}" not found.`);
			return false;
		}

		const component = this.components.get(componentName);

		if(Array.isArray(component.requires)) {
			component.requires.forEach(requirement => {
				if(this.components.has(requirement)) {
					this.initComponent(requirement, context);
				} else {
					console.warn(`Component "${requirement}" not found.`);
				}
			});
		}

		component.init(context);
		this.eventBus.emit('componentInitialized', componentName);
		return true;
	}

	/**
	 * Initialize components based on the provided argument(s).
	 * If no argument is provided, all components are initialized.
	 * If a string is provided, the component with that name is initialized.
	 * If an array is provided, each element is processed as a string representing the component name.
	 *
	 * @param {string|array} [components] - The name(s) of the components to initialize.
	 */
	init(components) {
		// Initialize all components if no argument is provided
		if(!components) {
			this.components.forEach((_, componentName) => {
				this.initComponent(componentName);
			});
		} else if(typeof components === 'string') {
			// Single component initialization
			this.initComponent(components);
		} else if(Array.isArray(components)) {
			// Array of components initialization
			components.forEach(componentName => {
				this.initComponent(componentName);
			});
		} else {
			throw new Error('Invalid argument provided to init method. Expected a string or an array of strings.');
		}
	}

	/**
	 * Destroys one, multiple, or all instances of a given component.
	 *
	 * @param {string} componentName - The name of the component.
	 * @param {number} [instanceId] - The index of a specific instance in the instances array.
	 *                                If not provided, all instances of the component will be destroyed.
	 */
	destroy(componentName, instanceId) {
		const component = this.components.get(componentName);
		if(component) {
			if(typeof instanceId !== 'undefined') {
				const instance = component.instances.get(instanceId);
				if(instance) {
					if(typeof instance.destroy === 'function') {
						instance.destroy();
					}
					component.instances.delete(instanceId);
				}
			} else {
				component.instances.forEach((instance, key) => {
					if(typeof instance.destroy === 'function') {
						instance.destroy();
					}
					component.instances.delete(key);
				});
			}
		}
	}

	/**
	 * Destroys all instances of all registered components.
	 */
	destroyAll() {
		for(const componentName of this.components.keys()) {
			this.destroy(componentName);
		}
	}

	recreate(componentName, instanceId) {
		const component = this.components.get(componentName);
		if(component) {
			if(typeof instanceId !== 'undefined') {
				this.recreateById(component, instanceId);
			} else {
				this.recreateAll(component);
			}
		}
	}

	recreateAll(component) {
		const instanceIds = Array.from(component.instances.keys());
		instanceIds.forEach((id) => {
			const instance = component.instances.get(id);
			if(instance) {
				if(typeof instance.destroy === 'function') {
					instance.destroy();
				}
				component.instances.delete(id);
			}
		});
		component.instances.clear();
		component.init();
	}

	recreateById(component, instanceId) {
		const instance = component.instances.get(instanceId);
		if(instance) {
			if(typeof instance.destroy === 'function') {
				instance.destroy();
			}
			component.instances.delete(instanceId);
			component.createInstance(instanceId);
		}
	}

	/**
	 * Retrieve a specific component.
	 *
	 * @param {string} componentName - Name of the component to retrieve.
	 * @returns {Component|undefined} - The retrieved component or undefined if not found.
	 */
	get(componentName) {
		const component = this.components.get(componentName);
		if(!component) {
			console.warn(`Component "${componentName}" not found.`);
			return null;
		}
		return component;
	}

	/**
	 * Retrieve a specific component proxy.
	 *
	 * @param {string} componentName - Name of the component to retrieve.
	 * @returns {ComponentProxy} - The retrieved component or undefined if not found.
	 */
	proxy(componentName) {
		const component = this.get(componentName);
		return new ComponentProxy(component);
	}

	/**
	 * Register a listener function to an event.
	 *
	 * @param {string} eventName - The name of the event to listen to.
	 * @param {Function} callback - The function to call when the event is triggered.
	 */
	on(eventName, callback) {
		this.eventBus.on(eventName, callback);
	}

	/**
	 * Removes a listener function from an event.
	 *
	 * @param {string} eventName - The name of the event to remove the listener from.
	 * @param {Function} callback - The specific listener function to remove.
	 */
	off(eventName, callback) {
		this.eventBus.off(eventName, callback);
	}

	/**
	 * Triggers an event, calling all its registered listener functions.
	 *
	 * @param {string} eventName - The name of the event to trigger.
	 * @param {...any} args - Arguments to pass to the listener functions.
	 */
	emit(eventName, ...args) {
		this.eventBus.emit(eventName, ...args);
	}
}
