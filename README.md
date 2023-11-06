# Componeer: Organized JavaScript Components

Componeer is a utility that helps you streamline your JavaScript code organization. Emphasizing component-based
architecture, it enables the bundling of features and behaviors into distinct, manageable component classes.

Componeer operates unobtrusively, focusing on instantiating classes (optionally) linked to DOM elements identified by
selectors. It avoids enforcing a specific API or necessitating class inheritance, thus minimizing the learning curve for
developers.

It encourages you to coherently encapsulate and stage those small yet crucial pieces of code — such as event handlers and
DOM manipulations that are often written directly into scripts without structure — for growing into more complex
components. As the components do not adhere to a proprietary API, they remain easy to port to other frameworks, ensuring
versatility and adaptability.

## Getting Started

Quick example:

```javascript
// main.js
import Container from "componeer/Container.js";
import ColorChanger from "./ColorChanger.js";
import AlertButton from "./AlertButton.js";

const app = new Container([
    {
        selector: '.container',
        class: ColorChanger
    },
    {
        selector: '.alert-button',
        class: AlertButton,
        options: {
            alertText: 'Hey, I am a component'
        }
    }
]);

app.init();
```

This code snippet shows how to instantiate a new Componeer container and initialize instances of ColorChanger and
AlertButton for each DOM element matching their respective selectors.

## Component Configuration

A component configuration is an object that tells Componeer how to instantiate a component:

```javascript
{
    class: MyComponentClass,      // The class that should be instantiated (required).
    selector: '.my-component',    // CSS Selector to find the DOM element (optional).
    name: 'MyComponent',          // Optional name for referencing the component instance.
    options: {                    // Variables or options to pass to the component's constructor.
        any: 'variables',
        you: 'want'
    }
}
```

### Configuration Properties

- **class** (required): The constructor of the component class to be instantiated. This is the only mandatory field in
  the configuration, as it defines the actual functionality of the component.
- **name** (optional): A name identifier for the component. If not defined, Componeer will use the class name by
  default.
  Naming components is beneficial when you want to retrieve instances of a specific component by name.
- **selector** (required if not global): The CSS selector used to find the DOM elements that the component will be
  attached
  to. If your component doesn't interact with a specific DOM element, this can be omitted.
- **options** (optional): An object containing properties that you want to pass to the component's constructor. This is
  where
  you can provide initial state, configuration settings, or dependencies required by the component.

### Component Constructor Parameters

When Componeer instantiates a component, it passes an object to the constructor with the following properties:

```javascript
constructor({element, options, eventBus})
{
    // Your constructor implementation.
}
```

- **element**: The DOM element tied to this component instance.
- **options**: The options object provided in the component configuration.
- **eventBus**: An optional event bus for facilitating communication between components.

## Component Examples

#### AlertButton Component

```javascript
// AlertButton.js
export default class AlertButton {
    /**
     * Creates an AlertButton component.
     * @param {Object} config - The configuration object for the component.
     * @param {HTMLElement} config.element - The DOM element tied to this component.
     * @param {Object} config.options - Options for the component.
     * @param {EventEmitter} config.eventBus - A shared event bus for the components.
     */
    constructor({element, options, eventBus}) {
        this.element = element;       // The DOM element associated with this component
        this.options = options;       // The options passed to the component
        this.eventBus = eventBus;     // The shared event bus

        // Set up a click event listener on the element
        this.element.addEventListener('click', () => {
            // Alert the text provided in the options
            alert(this.options.alertText);
        });
    }
}
```

#### AlertButton Component with EventBus

```javascript
// AlertButtonEventBus.js
export default class AlertButtonEventBus {
    constructor({element, options}) {
        this.element = element;
        this.options = options;

        this.eventBus.on('instance:init', () => {
            this.eventBus.off('instance:init');
            this.init();
        });
    }

    init() {
        this.element.addEventListener('click', () => {
            alert(this.options.alertText);
        });
    }
}
```

#### AbstractComponent Example

```javascript
// AbstractComponent.js
export default class AbstractComponent {
    constructor({element, options, eventBus}) {
        this.element = element;
        this.options = options;
        this.eventBus = eventBus;

        this.eventBus.on('instance:init', () => {
            this.eventBus.off('instance:init');
            this.onInit();
        });

        this.eventBus.on('instance:destroy', () => {
            this.eventBus.off('instance:destroy');
            this.onDestroy();
        });

        this.onCreate();
    }

    onCreate() {
    };

    onInit() {
    };

    onDestroy() {
    };
}
```

```javascript
// AlertButtonExtension.js
import AbstractComponent from "../src/AbstractComponent.js";

export default class AlertButtonExtension extends AbstractComponent {
    onInit() {
        this.element.addEventListener('click', () => {
            alert(this.options.alertText);
        });
    }
}
```

Each of these examples illustrates different ways to use Componeer components. The **AlertButton** component is a simple
example of a component that listens to click events. **AdvancedComponent** demonstrates the integration of an event bus
for
inter-component communication, and **AbstractComponent** shows how you can create an abstract class that enforces the
implementation of specific methods by any subclass.