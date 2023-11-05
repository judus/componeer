/**
 * Extend utility to perform a deep or shallow merge of objects.
 *
 * @param {...Object} args - Objects to merge; if the first argument is a boolean, it determines the type of merge:
 *                           true for a deep merge, and false for a shallow merge.
 * @returns {Object} The merged object.
 *
 * @example
 * // Shallow Merge
 * const result = extend({a: 1}, {b: 2}); // {a: 1, b: 2}
 *
 * // Deep Merge
 * const deepResult = extend(true, {a: {x: 10}}, {a: {y: 20}}); // {a: {x: 10, y: 20}}
 */
/*
export default function extend(...args) {

	// Initialize resulting merged object
	const extended = {};
	let deep = false;
	let startIndex = 0;

	// Check if a deep merge
	if(typeof args[0] === 'boolean') {
		deep = args[0];
		startIndex = 1;
	}

	// Helper function to merge object into the extended object
	const merge = (obj) => {
		for(const prop in obj) {
			// Ensure the property is directly on the object and not on the prototype
			if(Object.prototype.hasOwnProperty.call(obj, prop)) {
				// If deep merge and the current property is an object, recursively merge
				if(deep && typeof obj[prop] === 'object' && obj[prop] !== null) {
					extended[prop] = extend(true, extended[prop] || {}, obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Iterate through each object and merge
	for(let i = startIndex; i < args.length; i++) {
		merge(args[i]);
	}

	return extended;
}
*/


// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
export default function extend() {

	// Variables
	const extended = {};
	const length = arguments.length;
	let deep = false;
	let i = 0;

	// Check if a deep merge
	if(Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	let merge = function(obj) {
		for(let prop in obj) {
			if(Object.prototype.hasOwnProperty.call(obj, prop)) {
				// If deep merge and property is an object, merge properties
				if(deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(true, extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for(; i < length; i++) {
		let obj = arguments[i];
		merge(obj);
	}

	return extended;
}

