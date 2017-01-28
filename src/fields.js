const validators = require('./validators')
const transforms = require('./transforms')
const uuid = require('uuid')
const { concat } = require('ramda')

const guid = (name) => {
  return {
    name,
    validators: [validators.notFalsey],
    default: () => uuid.v4(),
    transforms: [transforms.stringTrim]
  }
}

const text = (name, options = {}) => {
  let fieldValidators = options.validators || []
  if (options.required === true) fieldValidators.push(validators.notFalsey)
  let defaultTransforms = [transforms.stringTrim]
  let fieldTransforms = concat(defaultTransforms, options.transforms || [])

  return {
    name,
    validators: fieldValidators,
    default: options.default || '',
    transforms: fieldTransforms
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
  text,
  numberGreaterThanZero,
  address
}
