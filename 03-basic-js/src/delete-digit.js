const { NotImplementedError } = require('../extensions/index.js');

/**
 * Given some integer, find the maximal number you can obtain
 * by deleting exactly one digit of the given number.
 *
 * @param {Number} n
 * @return {Number}
 *
 * @example
 * For n = 152, the output should be 52
 *
 */
function deleteDigit(n) {
  const arr = n
    .toString()
    .split('')
    .map(item => n.toString().replace(item, ''))
    .map(item => Number(item))
    .sort((a, b) => a - b)
  return arr[arr.length - 1]
}

module.exports = {
  deleteDigit
};
