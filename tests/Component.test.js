import Component from '../src/Component.js';
import EventBus from '../src/EventBus.js';
import EventBusProxy from "../src/EventBusProxy.js";


/**
 * @jest-environment jsdom
 */

// Mock the EventBus and EventBusProxy classes
jest.mock('../src/EventBusProxy.js', () => {
	return jest.fn().mockImplementation(() => {
		return {cleanup: jest.fn()};
	});
});

const mockEventBus = {
	publish: jest.fn(),
	subscribe: jest.fn(),
	unsubscribe: jest.fn()
};

class DummyClass {
	constructor({element, options, eventBus}) {
		this.element = element;
		this.options = options;
		this.eventBus = eventBus;
	}

	destroy() {}
}

const createMockElement = () => document.createElement('div');

describe('Component', () => {
	let validConfig;
	let validConfigWithSelector;
	let validConfigWithoutSelector;
	let invalidConfig;
	let mockEventBus;

	beforeEach(() => {
		validConfig = {
			class: DummyClass,
			name: 'DummyComponent',
			selector: '.dummy-selector',
			options: {option1: 'value1'},
			identification: () => 'unique-id'
		};
		validConfigWithSelector = {
			class: class MockClass {},
			selector: '.mock-class',
			options: {},
			identification: () => 'unique-id',
		};
		validConfigWithoutSelector = {
			class: class MockClass {},
			selector: '',
			options: {},
			identification: () => 'unique-id',
		};
		invalidConfig = {
			name: 'ComponentWithoutClass',
			// 'class' property is intentionally omitted here to simulate invalid configuration
			selector: '.selector',
			options: {},
		};
		mockEventBus = {}; // This should be replaced with a mock or spy if necessary
	});

	describe('constructor', () => {
		it('should throw an error if config is not provided', () => {
			expect(() => new Component()).toThrow('Component configuration must be an object.');
		});

		it('should throw an error if config.class is undefined', () => {
			expect(() => new Component({})).toThrow('A component is missing a class');
		});
	});

	describe('init', () => {
		it('should throw an error if config.applies is not a function', () => {
			const invalidAppliesConfig = {...validConfig, applies: "not a function"};
			expect(() => new Component(invalidAppliesConfig, mockEventBus)).toThrow('The "applies" configuration must be a function.');
		});

		it('should not create instances if applies returns false', () => {
			const configWithApplies = {...validConfigWithSelector, applies: () => false};
			const component = new Component(configWithApplies, mockEventBus);
			component.init();
			expect(component.instances.size).toBe(0);
		});

		it('should call make for each element matching the selector', () => {
			document.body.innerHTML = '<div class="mock-class"></div><div class="mock-class"></div>';
			const component = new Component(validConfigWithSelector, mockEventBus);
			component.init(document.body);
			expect(component.instances.size).toBe(2);
		});

		it('should throw an error if the provided context is not an HTMLElement', () => {
			const component = new Component(validConfigWithSelector, mockEventBus);
			expect(() => component.init("invalid")).toThrow('Provided context is not an HTMLElement.');
		});
	});

	describe('make', () => {
		it('should throw an error if element is not an HTMLElement', () => {
			const component = new Component(validConfigWithSelector, mockEventBus);
			expect(() => component.make({})).toThrow();
		});

		it('should create a new instance with a unique ID', () => {
			document.body.innerHTML = '<div class="mock-class"></div>';
			const component = new Component(validConfigWithSelector, mockEventBus);
			component.init(document.body);
			expect(component.instances.size).toBe(1);
		});

		it('should assign a random ID if no identification function is provided', () => {
			const configWithoutId = {...validConfigWithSelector};
			delete configWithoutId.identification;
			const component = new Component(configWithoutId, mockEventBus);
			component.make(document.createElement('div'));
			const [instanceID] = component.instances.keys();
			expect(instanceID).toMatch(/[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}/);
		});

		it('should create an instance without a selector', () => {
			const noSelectorConfig = {...validConfig, selector: null};
			const component = new Component(noSelectorConfig, mockEventBus);
			component.init();
			expect(component.instances.size).toBe(1);
		});

		it('should throw an error if identification is not a function', () => {
			const invalidIdentificationConfig = {...validConfig, identification: "not a function"};
			const component = new Component(invalidIdentificationConfig, mockEventBus);
			expect(() => component.make()).toThrow();
		});

		it('should throw an error if class is not a constructor', () => {
			const invalidIdentificationConfig = {...validConfig, class: "not a constructor"};
			const component = new Component(invalidIdentificationConfig, mockEventBus);
			expect(() => component.make()).toThrow();
		});

	});

	describe('getInstance', () => {
		it('should return undefined for non-existent ID', () => {
			const component = new Component(validConfig, mockEventBus);
			const instance = component.getInstance('non-existent-id');
			expect(instance).toBeUndefined();
		});
	});

	describe('destroyInstance', () => {
		it('should warn if trying to destroy a non-existent instance', () => {
			console.warn = jest.fn();
			const component = new Component(validConfig, mockEventBus);
			component.destroyInstance('non-existent-id');
			expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('No instance found with ID'));
		});

		it('should call the destroy method on the component instance if it exists', () => {
			const mockInstance = {destroy: jest.fn()};
			const component = new Component(validConfig, mockEventBus);
			const mockId = 'test-id';
			component.instances.set(mockId, mockInstance);

			component.destroyInstance(mockId);
			expect(mockInstance.destroy).toHaveBeenCalled();
		});

		it('should remove the instance from the instances map', () => {
			const mockInstance = {destroy: jest.fn()};
			const component = new Component(validConfig, mockEventBus);
			const mockId = 'test-id';
			component.instances.set(mockId, mockInstance);

			component.destroyInstance(mockId);
			expect(component.instances.has(mockId)).toBeFalsy();
		});

		it('should do nothing if trying to destroy a non-existent instance', () => {
			const component = new Component(validConfig, mockEventBus);
			const preDestroySize = component.instances.size;
			component.destroyInstance('non-existent-id');
			const postDestroySize = component.instances.size;
			expect(preDestroySize).toBe(postDestroySize);
		});

		it('should call cleanup on the EventBusProxy and remove the instance from eventBusProxies map', () => {
			const mockCleanup = jest.fn();
			EventBusProxy.mockImplementation(() => {
				return {cleanup: mockCleanup};
			});

			document.body.innerHTML = '<div class="dummy-selector"></div>';

			const component = new Component(validConfig, mockEventBus);
			component.init(document.body);
			const instanceID = validConfig.identification();
			component.destroyInstance(instanceID);
			expect(mockCleanup).toHaveBeenCalled();
			expect(component.eventBusProxies.has(instanceID)).toBe(false);
		});

	});

	describe('destroyAllInstances', () => {
		it('should destroy all instances', () => {
			const mockInstance = {destroy: jest.fn()};
			const component = new Component(validConfig, mockEventBus);
			component.instances.set('test-id-1', mockInstance);
			component.instances.set('test-id-2', mockInstance);

			component.destroyAllInstances();
			expect(mockInstance.destroy).toHaveBeenCalledTimes(2);
			expect(component.instances.size).toBe(0);
		});
	});

	describe('generateUUID', () => {
		it('should generate a UUID with the correct format', () => {
			const component = new Component(validConfig, mockEventBus);
			const uuid = component.generateUUID();
			expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}/);
		});

		it('should generate unique UUIDs', () => {
			const component = new Component(validConfig, mockEventBus);
			const uuid1 = component.generateUUID();
			const uuid2 = component.generateUUID();
			expect(uuid1).not.toBe(uuid2);
		});
	});
});