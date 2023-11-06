import Componeer from '../src/Componeer';
import Component from '../src/Component';
import EventBus from '../src/EventBus';

// Mock the Component and EventBus as you will likely want to assert on them without triggering their real behavior
jest.mock('../src/Component');
jest.mock('../src/EventBus');

describe('Container', () => {
	let container;
	let componentsConfig;
	let context;

	beforeEach(() => {
		// Reset the mocks before each test
		Component.mockClear();
		EventBus.mockClear();

		context = document;

		// Define a mock configuration for components
		componentsConfig = [
			{
				name: 'TestComponent', class: function TestComponent() {

				}
			}
		];

		// Initialize the Container with the componentsConfig
		container = new Componeer(componentsConfig, context);
	});

	describe('constructor', () => {
		it('should initialize components from the provided array', () => {

			// Suppose we have two component configurations for this example
			let config = [
				{
					name: 'ComponentOne',
					options: {someOption: 1}
				},
				{
					name: 'ComponentTwo',
					options: {someOption: 2}
				},
				{
					name: 'ComponentThree',
					options: {someOption: 3}
				}
			];

			// Re-create the Container instance with the new config
			container = new Componeer(config, context);

			// Now, we check that the Component constructor was called with the correct config and shared EventBus for each component config
			componentsConfig.forEach((config, index) => {
				expect(Component.mock.calls[index][0]).toBe(config);
				// EventBus is the second argument, so we check the type instead of the instance because it's a mock
				expect(Component.mock.calls[index][1]).toBeInstanceOf(EventBus);
				// The third argument should be the context, which we set up initially
				expect(Component.mock.calls[index][2]).toBe(context);
			});
		});

		it('should throw an error if components parameter is not an array', () => {
			expect(() => new Componeer("not an array")).toThrow();
		});
	});

	describe('getContext', () => {
		// Tests for getContext method
	});

	describe('initComponent', () => {
		it('should initialize a component by name', () => {

		});

		it('should warn and return false if the component does not exist', () => {
			// Mock console.warn to ensure it was called
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const result = container.initComponent('NonExistentComponent');
			expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
			expect(result).toBe(false);
			consoleWarnSpy.mockRestore();
		});
	});

	describe('init', () => {
		it('should initialize all components', () => {
			// Assert that init was called for each component
		});

		it('should warn if there are no components to initialize', () => {
			// This will likely involve creating a new Container with an empty array
		});
	});

	describe('destroy', () => {
		// Tests for destroy method
	});

	describe('destroyAll', () => {
		// Tests for destroyAll method
	});

	describe('get', () => {
		it('should retrieve a component by name', () => {
			// Assert you get the expected component
		});

		it('should warn and return null if the component does not exist', () => {
			// Similar to the test in 'init', ensure warn is called and null is returned
		});
	});

	describe('event bus integration', () => {
		it('should register an event listener', () => {
			// Test that 'on' method correctly registers an event listener
		});

		it('should remove an event listener', () => {
			// Test that 'off' method correctly removes an event listener
		});

		it('should emit events', () => {
			// Test that 'emit' method correctly emits events
		});
	});

});

