export default class NodeManager {
    constructor() {
        this.nodes = new Set();
    }

    appendChild(parent, childFragment) {
        const children = Array.from(childFragment.childNodes);
        parent.appendChild(childFragment); // This will empty the fragment and move its children to the parent.
        children.forEach(child => this.nodes.add(child)); // Store the actual children.
    }

    removeChild(parent, child) {
        if(this.nodes.has(child)) {
            try {
                parent.removeChild(child);
                this.nodes.delete(child);
            } catch(error) {
                console.error(error);
                // Handle the error as needed.
            }
        }
    }

    clearAll(parent) {
        this.nodes.forEach(child => {
            if(parent.contains(child)) { // Ensure that the child is indeed contained by the parent.
                try {
                    parent.removeChild(child);
                } catch(error) {
                    console.error(error);
                    // Handle the error as needed.
                }
            }
            this.nodes.delete(child);
        });
    }
}
