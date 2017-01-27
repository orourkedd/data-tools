const { isEmptyString } = require('./util')
const { build } = require('./build')

const notFalsey = (fieldName, value, entity) => {
  const isValid = value !== null && value !== undefined && !isEmptyString(value)
  if (isValid) return null
  return {
    type: 'required',
    message: `${fieldName} is required.`,
    name: fieldName
  }
}

const numberGreaterThanZero = (fieldName, value, entity) => {
  if (value > 0) return null
  return {
    type: 'greaterThanZero',
    message: `${fieldName} must be greater than zero.`,
    name: fieldName
  }
}

const address = (fieldName, value, entity, fieldDefinition) => {
  const { validator } = build(fieldDefinition.fields)
  if (!value) {
    return [{
      type: 'address',
      name: fieldName,
      message: `${fieldName} is not an object.`
    }]
  }

  const errors = validator(value)
  if (errors.length > 0) {
    return {
      type: 'address',
      message: `${fieldName} has errors.`,
      name: fieldName,
      errors
    }
  } else {
    return null
  }
}

module.exports = {
  notFalsey,
  numberGreaterThanZero,
  address
}
