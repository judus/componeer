import Component from "./Component.js";
import EventBus from "./EventBus.js";

/**
 * Represents the main application controller.
 * It manages components and their lifecycle.
 */
export default class Container {
	/**
	 * Creates a new Componeer instance.
	 *
	 * @param {Array} components - Configuration object for the application.
	 */
	constructor(components, context = document.body) {

		if(!Array.isArray(components)) {
			throw new Error("The components parameter must be an array.");
		}

		this.components = new Map();
		this.eventBus = new EventBus();
		this.context = this.getContext(context);

		components.forEach((config) => {
			let component = new Component(config, this.eventBus, this.context);
			this.components.set(component.name, component);
		});
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
	 */
	init(componentName, context) {
		if(!this.components.has(componentName)) {
			console.warn(`Component "${componentName}" not found.`);
			return false;
		}

		const component = this.components.get(componentName);

		if(Array.isArray(component.requires)) {
			component.requires.forEach(requirement => {
				if(this.components.has(requirement)) {
					this.components.get(requirement).init(context);
				} else {
					console.warn(`Component "${requirement}" not found.`);
				}
			});
		}

		this.components.get(componentName).init(context);
		this.eventBus.emit('componentInitialized', componentName);

	}

	/**
	 * Initialize all components.
	 *
	 * @param {HTMLElement} [context] - The DOM context for the components.
	 */
	initAll() {
		if(this.components.size === 0) {
			console.warn("No components available to initialize.");
			return;
		}
		this.components.forEach(component => {
			this.init(component.name, this.context);
		});
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
					instance.destroy();
					component.instances.delete(instanceId);
				}
			} else {
				component.instances.forEach((instance, key) => {
					instance.destroy();
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
