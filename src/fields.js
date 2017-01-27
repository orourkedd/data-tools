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
  let fields = [{
    name: 'address1',
    validators: [validators.notFalsey],
    default: '',
    transforms: [transforms.stringTrim]
  }, {
    name: 'address2',
    default: '',
    transforms: [transforms.stringTrim]
  }, {
    name: 'city',
    validators: [validators.notFalsey],
    default: '',
    transforms: [transforms.stringTrim]
  }, {
    name: 'state',
    validators: [validators.notFalsey],
    default: '',
    transforms: [transforms.stringTrim]
  }, {
    name: 'zip',
    validators: [validators.notFalsey],
    default: '',
    transforms: [transforms.stringTrim]
  }]

  return {
    name,
    fields,
    validators: [validators.address]
  }
}

module.exports = {
  guid,
  requiredString,
  numberGreaterThanZero,
  address
}
