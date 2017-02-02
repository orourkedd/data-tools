const { isEmptyString } = require('./util')
const { build } = require('./build')
const { isURL } = require('validator')
const { map } = require('ramda')

const notFalsey = (fieldName, value, entity) => {
  const isValid = value !== null && value !== undefined && !isEmptyString(value)
  if (isValid) return null
  return {
    type: 'required',
    name: fieldName
  }
}

const numberGreaterThanZero = (fieldName, value, entity) => {
  if (value > 0) return null
  return {
    type: 'greaterThanZero',
    name: fieldName
  }
}

const address = (fieldName, value, entity, fieldDefinition) => {
  const { validator } = build(fieldDefinition.fields)
  if (!value) {
    return [{
      type: 'address',
      name: fieldName
    }]
  }

  const errors = validator(value)
  if (errors.length > 0) {
    return map((error) => {
      return {
        type: 'address',
        name: fieldName,
        error,
        subfield: true
      }
    }, errors)
  } else {
    return null
  }
}

const phone = (fieldName, value, entity) => {
  if ((phone || '').replace(/\D/g,'').length === 10) return null

  return {
    type: 'phone',
    name: fieldName
  }
}

const url = (fieldName, value, entity) => {
  if (!value) return null
  if (isURL(value)) return null

  return {
    type: 'url',
    name: fieldName
  }
}

module.exports = {
  notFalsey,
  numberGreaterThanZero,
  address,
  url
}
