/**
 * The EventBus class provides a simple mechanism to manage and trigger events.
 */
export default class EventBus {
	/**
	 * Initializes a new EventBus instance.
	 */
	constructor() {
		// Object to store arrays of event listener functions keyed by event name.
		this.listeners = {};
	}

	/**
	 * Registers a listener function to an event.
	 *
	 * @param {string} eventName - The name of the event to listen to.
	 * @param {Function} callback - The function to call when the event is triggered.
	 */
	on(eventName, callback) {
		// If the event does not exist, initialize it with an empty array.
		if(!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		// Add the listener function to the array of this event's listeners.
		this.listeners[eventName].push(callback);
	}

	/**
	 * Removes a listener function from an event.
	 * If no callback is provided, removes all listeners from the event.
	 *
	 * @param {string} eventName - The name of the event to remove the listener from.
	 * @param {Function} [callback] - The specific listener function to remove.
	 */
	off(eventName, callback) {
		// If the event does not exist, or there's no listener for this event, simply return.
		if(!this.listeners[eventName]) return;

		// If no specific callback is provided, remove all listeners from this event.
		if(!callback) {
			delete this.listeners[eventName];
			return;
		}

		// Filter out the specified callback function from this event's listeners.
		this.listeners[eventName] = this.listeners[eventName].filter(listener => listener !== callback);
	}

	/**
	 * Triggers an event, calling all its registered listener functions.
	 *
	 * @param {string} eventName - The name of the event to trigger.
	 * @param {...any} args - Arguments to pass to the listener functions.
	 */
	emit(eventName, ...args) {
		// If there's no listener for this event, simply return.
		if(!this.listeners[eventName]) return;

		// Call each listener function with the provided arguments.
		this.listeners[eventName].forEach(callback => {
			callback(...args);
		});
	}
}