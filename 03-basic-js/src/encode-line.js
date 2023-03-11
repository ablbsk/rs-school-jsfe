const { NotImplementedError } = require('../extensions/index.js');

/**
 * Given a string, return its encoding version.
 *
 * @param {String} str
 * @return {String}
 *
 * @example
 * For aabbbc should return 2a3bc
 *
 */
function encodeLine( str ) {
  const arr = []
  let count = 1

  for (let i = 0; i < str.length; i++) str[i] !== str[i + 1] ? (arr.push(count + str[i], count = 1)) : count++
  return arr.join('').split('').filter(item => item !== '1').join('')
}

module.exports = {
  encodeLine
};
