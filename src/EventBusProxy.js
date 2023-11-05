export default class EventBusProxy {
	constructor(eventBus, component) {
		this.eventBus = eventBus;
		this.component = component;
		this.listeners = new Map();
	}

	on(eventName, callback) {
		this.eventBus.on(eventName, callback);
		// Track the event subscription
		if(!this.listeners.has(eventName)) {
			this.listeners.set(eventName, []);
		}
		this.listeners.get(eventName).push(callback);
	}

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

	emit(eventName, ...args) {
		this.eventBus.emit(eventName, ...args);
	}

	cleanup() {
		for(const [eventName, callbacks] of this.listeners.entries()) {
			callbacks.forEach(callback => {
				this.eventBus.off(eventName, callback);
			});
		}
		this.listeners.clear();
	}
}
