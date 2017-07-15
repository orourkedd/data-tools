const t = require('./transforms')
const v = require('./validators')
const uuid = require('uuid')
const { merge, flatten, filter, has } = require('ramda')
const { isUndefined } = require('./utils')

function field(name, options) {
  const s1 = { name }
  const s2 = merge(s1, options)
  const s3 = merge(s2, {
    transforms: cleanList(options.transforms),
    validators: cleanList(options.validators)
  })
  return s3
}

function toArray(a) {
  return Array.isArray(a) ? a : [a]
}

function cleanList(a) {
  const s1 = flatten([a])
  const s2 = filter(v => v, s1)
  return s2
}

function guid(name, options = {}) {
  const defaultValue = has('defaultValue', options)
    ? options.defaultValue
    : uuid.v4()
  return field(name, {
    defaultValue,
    transforms: [t.stringTrim],
    validators: [v.notFalsey]
  })
}

function text(name, options = {}) {
  const validators = toArray(options.validators)
  if (options.required === true) validators.push(v.notFalsey)

  return field(
    name,
    merge(options, {
      defaultValue: '',
      transforms: [t.stringTrim, options.transforms],
      validators
    })
  )
}

function url(name, options = {}) {
  options.validators = [options.validators, v.url]
  return text(name, options)
}

function phone(name, options = {}) {
  options.validators = [options.validators, v.phone]
  options.transforms = [t.stringNumbersOnly, options.transforms]
  return text(name, options)
}

function address(name, options = {}) {
  const textOptions = {}
  if (options.required) textOptions.required = true
  return {
    name,
    fields: [
      text('address1', textOptions),
      text('address2', textOptions),
      text('city', textOptions),
      text('state', merge(textOptions, { transforms: [t.stringToUpperCase] })),
      text('zip', textOptions)
    ]
  }
}

function enumeration(name, options = {}) {
  return field(
    name,
    merge(options, {
      validators: [options.validators, v.enumeration]
    })
  )
}

function boolean(name, options = {}) {
  return enumeration(
    name,
    merge(options, {
      values: [true, false]
    })
  )
}

function number(name, options = {}) {
  return field(
    name,
    merge(options, {
      validators: [options.validators, v.number]
    })
  )
}

function date(name, options = {}) {
  return field(name, options)
}

module.exports = {
  guid,
  text,
  url,
  phone,
  address,
  enumeration,
  boolean,
  number,
  date
}
