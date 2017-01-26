const validators = require('./validators')
const transforms = require('./transforms')
const uuid = require('uuid')

const guid = (name) => {
  return {
    name,
    validators: [validators.notFalsey],
    default: () => uuid.v4(),
    transforms: [transforms.stringTrim]
  }
}

const requiredString = (name) => {
  return {
    name,
    validators: [validators.notFalsey],
    default: '',
    transforms: [transforms.stringToUpperCase, transforms.stringTrim]
  }
}

const numberGreaterThanZero = (name) => {
  return {
    name,
    validators: [validators.notFalsey, validators.numberGreaterThanZero],
    default: 0
  }
}

const address = (name) => {
  return {
    name,
    validators: [validators.address],
    default: {
      street: '',
      city: '',
      zip: '',
      state: ''
    },
    fake: 'address'
  }
}

module.exports = {
  guid,
  requiredString,
  numberGreaterThanZero,
  address
}
