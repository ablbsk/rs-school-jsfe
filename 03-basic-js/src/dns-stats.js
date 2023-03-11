const { NotImplementedError } = require('../extensions/index.js');

/**
 * Given an array of domains, return the object with the appearances of the DNS.
 *
 * @param {Array} domains
 * @return {Object}
 *
 * @example
 * domains = [
 *  'code.yandex.ru',
 *  'music.yandex.ru',
 *  'yandex.ru'
 * ]
 *
 * The result should be the following:
 * {
 *   '.ru': 3,
 *   '.ru.yandex': 3,
 *   '.ru.yandex.code': 1,
 *   '.ru.yandex.music': 1,
 * }
 *
 */
function getDNSStats(domains) {
  const result = {}

  domains.forEach((item, i) => {
    const element = item.split('.')
    let value = ''

    for (let j = element.length - 1; j >= 0; j--) {
      value += `.${element[j]}`
      !result[value] ? result[value] = 1 : result[value]++
    }
  })

  return result;
}

module.exports = {
  getDNSStats
};
