const { NotImplementedError } = require('../extensions/index.js');

/**
 * Implement chainMaker object according to task description
 *
 */

const chainMaker = {
  result: [],
  getLength() {
    return this.result.length
  },
  addLink (value) {
    this.result.push(value + '')
    return chainMaker
  },
  removeLink(position) {
    if (!this.result[position - 1]) {
      this.result = [];
      throw new Error(`You can't remove incorrect link!`);
    } else {
      const beforeArr = this.result.slice(0, position - 1)
      const afterArr = this.result.slice(position, this.result.length)

      this.result = beforeArr.concat(afterArr)
      return chainMaker
    }
  },
  reverseChain() {
    this.result.reverse()
    return chainMaker
  },
  finishChain() {
    const str = this.result.map(item => `( ${item} )~~`).join('')
    this.result = [];
    return str.slice(0, str.length - 2)
  }
};

module.exports = {
  chainMaker
};
