export default class EventBusProxy {
    /**
     * Creates an instance of EventBusProxy.
     * @param {EventBus} eventBus - The EventBus instance to proxy.
     * @param {Component} component - The component that owns this EventBusProxy.
     */
    constructor(eventBus, component) {
        this.eventBus = eventBus;
        this.component = component;
        this.listeners = new Map();
    }

    /**
     * Registers an event listener for the specified event on the proxied event bus.
     *
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} callback - The callback function to be invoked when the event is emitted.
     */
    on(eventName, callback) {
        this.eventBus.on(eventName, callback);
        // Track the event subscription
        if(!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    /**
     * Removes an event listener for the specified event on the proxied event bus.
     *
     * @param {string} eventName - The name of the event to remove the listener for.
     * @param {Function} callback - The callback function to remove.
     */
    off(eventName, callback) {
        this.eventBus.off(eventName, callback);
        // Update the tracking
        if(this.listeners.has(eventName)) {
            const callbacks = this.listeners.get(eventName);
            const index = callbacks.indexOf(callback);
            if(index > -1) {
                callbacks.splice(index, 1);
            }
            if(callbacks.length === 0) {
                this.listeners.delete(eventName);
            }
        }
    }

    /**
     * Emits an event with the given arguments on the proxied event bus.
     *
     * @param {string} eventName - The name of the event to emit.
     * @param {...any} args - Arguments to be passed to the event listeners.
     */
    emit(eventName, ...args) {
        this.eventBus.emit(eventName, ...args);
    }

    /**
     * Registers a one-time event listener for the specified event on the proxied event bus.
     * The event listener will be invoked only once and then automatically removed.
     *
     * @param {string} eventName - The name of the event to register the one-time listener for.
     * @param {Function} callback - The callback function to invoke the first time the event is emitted.
     */
    once(eventName, callback) {
        const onceWrapper = (...args) => {
            callback(...args);
            this.off(eventName, onceWrapper);
        };

        this.on(eventName, onceWrapper);
    }

    /**
     * Cleans up all event listeners registered through this proxy. This should be called
     * when the component is unmounted or no longer needs to listen to events to prevent
     * memory leaks.
     */
    cleanup() {
        for(const [eventName, callbacks] of this.listeners.entries()) {
            callbacks.forEach(callback => {
                this.eventBus.off(eventName, callback);
            });
        }
        this.listeners.clear();
    }
}
