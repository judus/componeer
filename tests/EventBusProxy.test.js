import EventBus from '../src/EventBus';
import EventBusProxy from '../src/EventBusProxy';

describe('EventBusProxy', () => {
	let eventBus;
	let eventBusProxy;
	let component;
	let mockCallback;


	beforeEach(() => {
		// Set up a new EventBus and a dummy component for each test
		eventBus = new EventBus();
		component = {}; // Mocked component, can be more elaborate if needed
		eventBusProxy = new EventBusProxy(eventBus, component);
		mockCallback = jest.fn();

	});

	test('should allow adding and triggering an event listener through the proxy', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBusProxy.on(eventName, mockCallback);
		eventBusProxy.emit(eventName, 'data1', 'data2');

		// Assert
		expect(mockCallback).toHaveBeenCalledWith('data1', 'data2');
	});

	test('should allow removing a specific event listener through the proxy', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBusProxy.on(eventName, mockCallback);
		eventBusProxy.off(eventName, mockCallback);
		eventBusProxy.emit(eventName);

		// Assert
		expect(mockCallback).not.toHaveBeenCalled();
	});

	test('should cleanup all event listeners', () => {
		// Arrange
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();
		const eventName1 = 'testEvent1';
		const eventName2 = 'testEvent2';

		// Act
		eventBusProxy.on(eventName1, mockCallback1);
		eventBusProxy.on(eventName2, mockCallback2);
		eventBusProxy.cleanup();
		eventBus.emit(eventName1);
		eventBus.emit(eventName2);

		// Assert
		expect(mockCallback1).not.toHaveBeenCalled();
		expect(mockCallback2).not.toHaveBeenCalled();
		expect(eventBusProxy.listeners.size).toBe(0);
	});

	test('should not call listeners of different events through the proxy', () => {
		// Arrange
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();

		// Act
		eventBusProxy.on('event1', mockCallback1);
		eventBusProxy.on('event2', mockCallback2);
		eventBusProxy.emit('event1');

		// Assert
		expect(mockCallback1).toHaveBeenCalled();
		expect(mockCallback2).not.toHaveBeenCalled();
	});

	test('should track event listeners', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBusProxy.on(eventName, mockCallback);

		// Assert
		expect(eventBusProxy.listeners.has(eventName)).toBe(true);
		expect(eventBusProxy.listeners.get(eventName)).toContain(mockCallback);
	});

	test('should track the event listener after registration', () => {
		eventBusProxy.on('testEvent', mockCallback);
		expect(eventBusProxy.listeners.get('testEvent')).toContain(mockCallback);
	});

	test('should stop tracking event listener after removal', () => {
		eventBusProxy.on('testEvent', mockCallback);
		eventBusProxy.off('testEvent', mockCallback);

		// Assuming that the event should still exist but without any listeners
		const listenersForEvent = eventBusProxy.listeners.get('testEvent') || [];

		// Since the off method should remove the callback, not the event,
		// we expect the array to be defined but empty.
		expect(listenersForEvent).toBeDefined();
		expect(listenersForEvent).toHaveLength(0); // No listener should be left
	});

	test('should clear all listeners when cleanup is called', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBusProxy.on(eventName, mockCallback);
		eventBusProxy.cleanup();

		// Assert
		expect(eventBusProxy.listeners.size).toBe(0);
	});
});
