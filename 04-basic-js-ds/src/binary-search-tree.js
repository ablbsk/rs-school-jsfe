const { NotImplementedError } = require('../extensions/index.js');

const { Node } = require('../extensions/list-tree.js');

/**
* Implement simple binary search tree according to task description
* using Node from extensions
*/
class BinarySearchTree {
  constructor() {
    this._root = null;
  }

  root() {
    return this._root
  }

  add(data) {
    const newNode = new Node(data)
    this._root ? this.addHelper(this._root, newNode) : this._root = newNode
  }

  addHelper(node, newNode) {
    if (newNode.data < node.data) {
      node.left ? this.addHelper(node.left, newNode) : node.left = newNode
    } else {
      node.right ? this.addHelper(node.right, newNode) : node.right = newNode
    }
  }

  searchHelper(node, data) {
    if (!node) return null
    if (data === node.data) return node

    node = data < node.data
      ? this.searchHelper(node.left, data)
      : this.searchHelper(node.right, data)

    return node
  }

  min(node = null) {
    let value = node || this._root
    let min = value.data

    while (value) {
      if (value.left) min = value.left.data
      value = value.left
    }

    return min
  }

  max(node = null) {
    let value = node || this._root
    let max = value.data

    while (value) {
      if (value.right) max = value.right.data
      value = value.right
    }

    return max
  }

  has(data) {
    return !!this.find(data)
  }

  find(data) {
    return this.searchHelper(this._root, data)
  }

  remove(data) {
    this._root = this.removeHelper(this._root, data)
  }

  removeHelper(node, data) {
    debugger

    if (!node) return null

    if (data === node.data) {
      if (node.left === null && node.right === null) return null
      if (!node.left) return node.right
      if (!node.right) return node.left

      const newNode = this.find(this.min(node.right))
      node.data = newNode.data
      node.right = this.removeHelper(node.right, newNode.data)
    }

    data < node.data
      ? node.left = this.removeHelper(node.left, data)
      : node.right = this.removeHelper(node.right, data)

    return node
  }
}

module.exports = {
  BinarySearchTree
};
