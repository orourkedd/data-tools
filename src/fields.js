const transforms = require('./transforms')
const validators = require('./validators')
const uuid = require('uuid')

function guid (name) {
  return {
    name,
    defaultValue: uuid.v4,
    transforms: [transforms.stringTrim],
    validators: [validators.notFalsey]
  }
}

module.exports = {
  guid
}
