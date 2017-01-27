const { isEmptyString } = require('./util')
const { build } = require('./index')

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
  return validator(value)
}

module.exports = {
  notFalsey,
  numberGreaterThanZero,
  address
}
