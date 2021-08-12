export default class WrongPasswordException extends Error {
  constructor(message = '') {
    super(message)

    this.name = 'WrongPasswordException'
  }
}
