const { NotImplementedError } = require('../extensions/index.js');

/**
 * Implement class VigenereCipheringMachine that allows us to create
 * direct and reverse ciphering machines according to task description
 *
 * @example
 *
 * const directMachine = new VigenereCipheringMachine();
 *
 * const reverseMachine = new VigenereCipheringMachine(false);
 *
 * directMachine.encrypt('attack at dawn!', 'alphonse') => 'AEIHQX SX DLLU!'
 *
 * directMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => 'ATTACK AT DAWN!'
 *
 * reverseMachine.encrypt('attack at dawn!', 'alphonse') => '!ULLD XS XQHIEA'
 *
 * reverseMachine.decrypt('AEIHQX SX DLLU!', 'alphonse') => '!NWAD TA KCATTA'
 *
 */
class VigenereCipheringMachine {
  constructor(mode = 'true') {
    this.mode = mode
  }

  encrypt(msg, key) {
    return this.calculate(msg, key, -130, 'plus')
  }

  decrypt(msg, key) {
    return this.calculate(msg, key, 26, 'minus')
  }

  calculate(msg, key, x, method) {
    let len = msg.length
    let result = ''
    let i = 0
    let j = 0

    const getResult = () => method === 'plus' ? getMsg(msg, i) + getKey(key, i, j) : getMsg(msg, i) - getKey(key, i, j)

    const getMsg = (msg, i) => msg[i].toUpperCase().charCodeAt()

    const getKey = (key, i, j) => key[(i - j) % key.length].toUpperCase().charCodeAt()

    while (len--) {
      let value = !/[a-zA-Z]/.test(msg[i])
      value
        ? (result += msg[i], ++j)
        : result += String.fromCharCode((getResult() + x) % 26 + 65)

      ++i
    }

    return this.mode ? result : result.split('').reverse().join('')
  }
}

module.exports = {
  VigenereCipheringMachine
}
