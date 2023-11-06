export default class Router {
    constructor(app) {
        this.routes = {};
        this.app = app;
    }

    route(path, componentInitCallback) {
        this.routes[path] = componentInitCallback;
    }

    init() {
        window.addEventListener('popstate', () => this.handleNavigation());
        window.addEventListener('load', () => this.handleNavigation());

        // Intercept click events on router links
        document.addEventListener('click', (e) => {
            if(e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
    }

    handleNavigation() {
        const path = window.location.pathname;
        const route = this.routes[path];

        if(route) {
            this.app.destroyAll(); // Clear previous component
            route(); // Initialize new component
        } else {
            // Handle 404 not found or redirect to a default route
            this.app.destroyAll();
            this.routes['/404'](); // Assume there is a 404 component registered
        }
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleNavigation();
    }
}


// The app would then call router.navigateTo('/home') to navigate to the home component
