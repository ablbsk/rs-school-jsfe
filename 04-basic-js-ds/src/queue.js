const { NotImplementedError } = require('../extensions/index.js');
const { ListNode } = require('../extensions/list-node.js');

/**
 * Implement the Queue with a given interface via linked list (use ListNode extension above).
 *
 * @example
 * const queue = new Queue();
 *
 * queue.enqueue(1); // adds the element to the queue
 * queue.enqueue(3); // adds the element to the queue
 * queue.dequeue(); // returns the top element from queue and deletes it, returns 1
 * queue.getUnderlyingList() // returns { value: 3, next: null }
 */

class Queue {
  constructor() {
    this.item = null
    this.length = 0
  }

  enqueue(value) {
    if (this.length === 0) {
      this.item = new ListNode(value)
    } else {
      let x = this.item

      while(x.next) x = x.next

      x.next = new ListNode(value)
    }
    this.length++
  }

  dequeue() {
    let value = this.item.value
    this.item = this.item.next
    return value
  }

  getUnderlyingList() {
    return this.item
  }
}

module.exports = {
  Queue
};
