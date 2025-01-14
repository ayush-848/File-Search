class Node {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    // Insert a key-value pair into the BST
    insert(key, val) {
        const newNode = new Node(key, val);

        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNodeHelper(this.root, newNode);
        }
    }

    // Helper method for inserting a node
    insertNodeHelper(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNodeHelper(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNodeHelper(node.right, newNode);
            }
        }
    }

    // Search for a value by key
    search(key) {
        return this.searchHelper(this.root, key);
    }

    // Helper method for searching
    searchHelper(node, key) {
        if (node === null) {
            return null; // Key not found
        }

        if (node.key === key) {
            return node.val; // Key found, return its value
        }

        if (key < node.key) {
            return this.searchHelper(node.left, key); // Search in the left subtree
        } else {
            return this.searchHelper(node.right, key); // Search in the right subtree
        }
    }

    // Convert the BST to a JSON-compatible structure
    toJSON() {
        return this.root;
    }
}

module.exports = BST;
