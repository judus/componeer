module.exports = {
	// Specifies the test environment. Common options are "node" or "jsdom" (for browser-like environments)
	testEnvironment: 'jsdom',

	// Specifies where Jest should look for test files
	testMatch: [
		'**/?(*.)+(spec|test).[tj]s?(x)'
	],

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		'/node_modules/'
	],

	// Specifies a path to a module which exports an async function that is triggered once before all test suites
	globalSetup: './setupTests.js',

	// Specifies a path to a module which exports an async function that is triggered once after all test suites
	globalTeardown: './teardownTests.js',

	// Indicates whether each individual test should be reported during the run
	verbose: true,
};