const { NotImplementedError } = require('../extensions/index.js');

/**
 * Create transformed array based on the control sequences that original
 * array contains
 *
 * @param {Array} arr initial array
 * @returns {Array} transformed array
 *
 * @example
 *
 * transform([1, 2, 3, '--double-next', 4, 5]) => [1, 2, 3, 4, 4, 5]
 * transform([1, 2, 3, '--discard-prev', 4, 5]) => [1, 2, 4, 5]
 *
 */
function transform(arr) {
  try {
    const result = []

    arr.map((item, i) => {
      switch (item) {
        case '--double-next':
          if (arr[i + 2] === '--discard-prev') {
            break;
          }
          if (i < arr.length - 1) result.push(arr[i + 1])
          break;
        case '--double-prev':
          if (i > 0) result.push(arr[i - 1])
          break;
        case '--discard-next':
          if (i < arr.length - 1) delete arr[i + 1]
          break;
        case '--discard-prev':
          if (i > 0) result.push(undefined)
          break;
        default:
          result.push(item)
      }
    })
    return result.filter(item => item !== undefined)
  } catch(error) {
    throw new Error("\'arr\' parameter must be an instance of the Array!")
  }
}

module.exports = {
  transform
};
