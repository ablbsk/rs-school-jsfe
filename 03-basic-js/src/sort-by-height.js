const { NotImplementedError } = require('../extensions/index.js');

/**
 * Given an array with heights, sort them except if the value is -1.
 *
 * @param {Array} arr
 * @return {Array}
 *
 * @example
 * arr = [-1, 150, 190, 170, -1, -1, 160, 180]
 *
 * The result should be [-1, 150, 160, 170, -1, -1, 180, 190]
 */
function sortByHeight( arr ) {
  const ids = []
  let result

  arr.forEach((item, i) => item === -1 ? ids.push(i) : item)

  if (ids.length > 0) {
    result = arr.sort((a, b) => a - b).slice(ids.length)
    ids.forEach((item, i) => result.splice(ids[i], 0, -1))
  } else {
    result = arr.sort((a, b) => a - b)
  }

  return result
}

module.exports = {
  sortByHeight
};
