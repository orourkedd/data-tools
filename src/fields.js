const t = require('./transforms')
const v = require('./validators')
const uuid = require('uuid')
const { merge } = require('ramda')

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

function enumeration (name, options = {}) {
  const fieldValidators = (options.validators || []).concat(v.enumeration)

  return {
    name,
    values: options.values,
    validators: fieldValidators,
    defaultValue: options.defaultValue
  }
}

function boolean (name, options = {}) {
  return enumeration(name, merge(options, {
    values: [true, false]
  }))
}

function number (name, options = {}) {
  const validators = (options.validators || []).concat(v.number)

  return {
    name,
    defaultValue: 0,
    transforms: options.transforms,
    validators
  }
}

module.exports = {
  guid,
  text,
  url,
  phone,
  address,
  enumeration,
  boolean,
  number
}
