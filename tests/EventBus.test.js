import EventBus from '../src/EventBus';

describe('EventBus', () => {
	let eventBus;

	beforeEach(() => {
		// Set up a new EventBus for each test to ensure there is no cross-test pollution
		eventBus = new EventBus();
	});

	test('should allow adding and triggering an event listener', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBus.on(eventName, mockCallback);
		eventBus.emit(eventName, 'data1', 'data2');

		// Assert
		expect(mockCallback).toHaveBeenCalledWith('data1', 'data2');
	});

	test('should allow removing a specific event listener', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBus.on(eventName, mockCallback);
		eventBus.off(eventName, mockCallback);
		eventBus.emit(eventName);

		// Assert
		expect(mockCallback).not.toHaveBeenCalled();
	});

	test('should remove all event listeners for an event when off is called without a callback', () => {
		// Arrange
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBus.on(eventName, mockCallback1);
		eventBus.on(eventName, mockCallback2);
		eventBus.off(eventName);
		eventBus.emit(eventName);

		// Assert
		expect(mockCallback1).not.toHaveBeenCalled();
		expect(mockCallback2).not.toHaveBeenCalled();
	});

	test('should not call listeners of different events', () => {
		// Arrange
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();

		// Act
		eventBus.on('event1', mockCallback1);
		eventBus.on('event2', mockCallback2);
		eventBus.emit('event1');

		// Assert
		expect(mockCallback1).toHaveBeenCalled();
		expect(mockCallback2).not.toHaveBeenCalled();
	});

	test('should not fail if triggering an event with no listeners', () => {
		// Arrange
		const eventName = 'testEvent';

		// Act and Assert
		expect(() => {
			eventBus.emit(eventName);
		}).not.toThrow();
	});

	test('should not fail if removing a listener for an event with no listeners', () => {
		// Arrange
		const mockCallback = jest.fn();
		const eventName = 'testEvent';

		// Act and Assert
		expect(() => {
			eventBus.off(eventName, mockCallback);
		}).not.toThrow();
	});

	test('should not remove other listeners when a specific listener is removed', () => {
		// Arrange
		const mockCallback1 = jest.fn();
		const mockCallback2 = jest.fn();
		const eventName = 'testEvent';

		// Act
		eventBus.on(eventName, mockCallback1);
		eventBus.on(eventName, mockCallback2);
		eventBus.off(eventName, mockCallback1);
		eventBus.emit(eventName);

		// Assert
		expect(mockCallback1).not.toHaveBeenCalled();
		expect(mockCallback2).toHaveBeenCalled();
	});
});
