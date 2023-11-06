export default class ComponentProxy {
    constructor(component) {
        return new Proxy(component, {
            get(target, prop) {
                return function(...args) {
                    let results = [];
                    // Loop over each instance and apply the method if it exists
                    target.instances.forEach(instance => {
                        if(typeof instance[prop] === 'function') {
                            // Call the method on the instance and collect the result
                            results.push(instance[prop].apply(instance, args));
                        } else {
                            // If it's not a function, just collect the property value
                            results.push(instance[prop]);
                        }
                    });
                    // If you expect a return value, you need to decide how to handle multiple return values
                    return results;
                };
            }
        });
    }
}
