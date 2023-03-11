const { NotImplementedError } = require('../extensions/index.js');

/**
 * Create a repeating string based on the given parameters
 *
 * @param {String} str string to repeat
 * @param {Object} options options object
 * @return {String} repeating string
 *
 *
 * @example
 *
 * repeater('STRING', { repeatTimes: 3, separator: '**',
 * addition: 'PLUS', additionRepeatTimes: 3, additionSeparator: '00' })
 * => 'STRINGPLUS00PLUS00PLUS**STRINGPLUS00PLUS00PLUS**STRINGPLUS00PLUS00PLUS'
 *
 */
function repeater( str, options ) {
  let result = str
  const repeatTimes = options.repeatTimes || 1
  const separator = options.separator || '+'
  const addition = options.addition === null ? 'null': options.addition
  const additionRepeatTimes = options.additionRepeatTimes || 1
  const additionSeparator = options.additionSeparator || '|'

  if (addition !== undefined && additionRepeatTimes === 1) result += addition

  if (additionRepeatTimes > 1) result += doRepeat(addition, additionRepeatTimes, additionSeparator)

  function doRepeat(str, repeatTimes, separator) {
    let result = []
    for (let i = 0; i < repeatTimes; i++) result.push(str)
    return result.reverse().join(separator)
  }

  return doRepeat(result, repeatTimes, separator)
}

module.exports = {
  repeater
};
