const t  = require('./transforms')
const v = require('./validators')
const uuid = require('uuid')

function guid (name) {
  return {
    name,
    defaultValue: uuid.v4,
    transforms: [t.stringTrim],
    validators: [v.notFalsey]
  }
}

function text (name, options = {}) {
  const transforms = [t.stringTrim].concat(options.transforms || [])
  const validators = options.validators || []
  if (options.required === true) validators.push(v.notFalsey)

  return {
    name,
    defaultValue: '',
    transforms,
    validators
  }
}

module.exports = {
  guid,
  text
}
