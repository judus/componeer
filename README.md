# Componeer: Organized JavaScript Components

*When you don’t have a modern JS framework at hand — or simply don’t want to use one — Componeer offers a lightweight, old-school approach that still holds up. It’s not fancy, but it gets the job done. I've used it for years, and it continues to serve me well.*

To be honest, if you already know how to cleanly organize your JavaScript code, you might not *need* something like Componeer. But once your scripts start growing, and you want a bit more structure without dragging in a full-blown framework, this utility can save you time and keep things sane.

Componeer helps you group behaviors and features into small, consistent components. It’s especially useful for encapsulating logic like event handlers, DOM manipulation, or UI behaviors — all without locking you into a specific API or framework.

## How It Works (Under the Hood)

At its core, Componeer is just a glorified, structured `forEach` loop over your component configs. No magic, no reactive system.

Here’s a very simplified, pseudo-code version:

```javascript
configList.forEach(config => {
    const elements = config.selector
        ? document.querySelectorAll(config.selector)
        : [null]; // If no selector is provided, instantiate once

    elements.forEach(element => {
        const instance = new config.class({
            element,
            options: config.options || {},
            eventBus
        });

        if (config.name) {
            this.instances[config.name] = instance;
        }
    });
});
```

It instantiates your classes, optionally hooks them up to DOM elements, and passes in options. That’s it.&#x20;

(Yes, there's a whole API lurking beneath — lifecycle hooks, getters/setters, reloading, and other arcane rituals — but if you're reaching for all of that, you might be better off switching to an actual JS framework.)

---

## Getting Started

A quick example:

```javascript
// main.js
import Container from "componeer/Container.js";
import ColorChanger from "./ColorChanger.js";
import AlertButton from "./AlertButton.js";

const app = new Componeer([
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

This example finds elements with the `.container` and `.alert-button` classes and attaches the `ColorChanger` and `AlertButton` components to them.

---

## Component Configuration

Each component config is an object that tells Componeer what to instantiate and where.

```javascript
{
    class: MyComponentClass,      // Required: your class to instantiate
    selector: '.my-component',    // Optional: CSS selector for elements to bind to
    name: 'MyComponent',          // Optional: reference name for this component
    options: {                    // Optional: passed to your component constructor
        any: 'variables',
        you: 'want'
    }
}
```

### Config Fields

* **class** (required): The actual class you want to instantiate.
* **selector** (optional): CSS selector to find matching DOM elements. If omitted, your component is instantiated once with no element.
* **name** (optional): If provided, you can reference the instance later via `app.instances[name]`.
* **options** (optional): Any custom data you want to pass into your component.

---

## Component Constructor Format

Componeer passes a single object to your component’s constructor. Here’s the format:

```javascript
constructor({element, options, eventBus}) {
    // Set up your component
}
```

* **element**: The DOM element tied to this instance, or `null` if no selector was provided.
* **options**: The object you passed in the config.
* **eventBus**: An optional shared event bus, useful for communication between components.

---

## Example Component

```javascript
// AlertButton.js
export default class AlertButton {
    constructor({element, options, eventBus}) {
        this.element = element;
        this.options = options;
        this.eventBus = eventBus;

        this.element.addEventListener('click', () => {
            alert(this.options.alertText);
        });
    }
}
```

Simple, clear, and decoupled from everything else.

---

## Why Use It?

Let’s be honest — most of us have, at some point, slapped together a dozen buttons, sliders, and modals in a late-night sprint and ended up with a spaghetti pile of DOM references and event handlers duct-taped together with jQuery and hope.&#x20;

If you:

* Prefer to write plain JS without a framework
* Need lightweight structure for DOM-based components
* Want to keep things portable and framework-agnostic
* Are working on a legacy or small project where React/Vue feels like overkill

...then Componeer might save you from your own beautiful chaos.

---

Componeer isn’t trying to be clever. It’s just a small utility that keeps your JavaScript modular and sane — especially in environments where heavy frameworks aren’t an option or aren't worth the trouble.

Sometimes, simple is best.
