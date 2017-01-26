const { isEmptyString } = require('./util')

const notFalsey = (fieldName, v) => {
  const isValid = v !== null && v !== undefined && !isEmptyString(v)
  if (isValid) return null
  return {
    type: 'required',
    message: `${fieldName} is required.`,
    name: fieldName
  }
}

const numberGreaterThanZero = (fieldName, v) => {
  if (v > 0) return null
  return {
    type: 'greaterThanZero',
    message: `${fieldName} must be greater than zero.`,
    name: fieldName
  }
}

const address = (fieldName, v) => {
  return null
  // return {
  //   type: 'address',
  //   message: `${fieldName} must be greater than zero.`,
  //   name: fieldName
  // }
}

module.exports = {
  notFalsey,
  numberGreaterThanZero,
  address
}
