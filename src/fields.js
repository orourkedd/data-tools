const validators = require('./validators')
const transforms = require('./transforms')
const uuid = require('uuid')
const { concat, merge } = require('ramda')

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

const phone = (name, options = {}) => {
  let defaultValidators = [validators.phone]
  let fieldValidators = concat(defaultValidators, options.validators || [])
  if (options.required === true) fieldValidators.push(validators.notFalsey)
  let defaultTransforms = [transforms.phone]
  let fieldTransforms = concat(defaultTransforms, options.transforms || [])

  return {
    name,
    validators: fieldValidators,
    default: null,
    transforms: fieldTransforms
  }
}

const url = (name) => {
  return {
    name,
    validators: [validators.url],
    default: null,
    transforms: [transforms.stringTrim]
  }
}

const numberGreaterThanZero = (name) => {
  return {
    name,
    validators: [validators.notFalsey, validators.numberGreaterThanZero],
    default: 0
  }
}

const address = (name, options = {}) => {
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

  let f1 = {
    name,
    fields,
    list: options.list,
    validators: [validators.address]
  }

  return f1
}

module.exports = {
  guid,
  text,
  numberGreaterThanZero,
  address,
  phone,
  url
}
