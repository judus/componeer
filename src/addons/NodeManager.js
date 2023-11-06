export default class NodeManager {
    constructor() {
        this.nodes = new Set();
    }

    appendChild(parent, childFragment) {
        const children = Array.from(childFragment.childNodes);
        parent.appendChild(childFragment);
        children.forEach(child => this.nodes.add(child));
    }

    removeChild(parent, child) {
        if(this.nodes.has(child)) {
            try {
                parent.removeChild(child);
                this.nodes.delete(child);
            } catch(error) {
                console.error(error);
            }
        }
    }

    clearAll(parent) {
        this.nodes.forEach(child => {
            if(parent.contains(child)) {
                try {
                    parent.removeChild(child);
                } catch(error) {
                    console.error(error);
                }
            }
            this.nodes.delete(child);
        });
    }
}
