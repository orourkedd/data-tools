const t = require('./transforms')
const v = require('./validators')
const uuid = require('uuid')

function guid (name, options = {}) {
  return {
    name,
    defaultValue: options.defaultValue === undefined ? uuid.v4 : options.defaultValue,
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

function url (name, options = {}) {
  options.validators = (options.validators || []).concat(v.url)
  return text(name, options)
}

function phone (name, options = {}) {
  options.validators = (options.validators || []).concat(v.phone)
  options.transforms = (options.transforms || []).concat(t.stringNumbersOnly)
  return text(name, options)
}

function address (name, options = {}) {
  return {
    name,
    fields: [
      text('address1', { required: options.required }),
      text('address2', { required: options.required }),
      text('city', { required: options.required }),
      text('state', { required: options.required, transforms: [t.stringToUpperCase] }),
      text('zip', { required: options.required })
    ]
  }
}

module.exports = {
  guid,
  text,
  url,
  phone,
  address
}
