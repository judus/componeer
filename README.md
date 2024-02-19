# Componeer: Organized JavaScript Components

### work in progress...

Componeer is a utility that helps you streamline your JavaScript code organization. Emphasizing component-based
architecture, it enables the bundling of features and behaviors into distinct, manageable component classes.

It encourages you to coherently encapsulate and stage those small yet crucial pieces of code — such as event handlers
and DOM manipulations that are often written directly into scripts without structure — for growing into more complex
components. As the components do not adhere to a proprietary API, they remain easy to port to other frameworks, ensuring
versatility and adaptability.

Componeer operates unobtrusively, focusing on instantiating classes (optionally) linked to DOM elements identified by
selectors. It avoids enforcing a specific API or necessitating class inheritance, thus minimizing learning efforts.


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

## Component Example


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
