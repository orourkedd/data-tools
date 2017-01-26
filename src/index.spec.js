const transforms = require('./transforms')
const validators = require('./validators')
const { build } = require('./index')
const { deepEqual } = require('assert')

describe('index.js', () => {
  describe('factory()', () => {
    it('should apply transforms', () => {
      const fieldDefinitions = [{
        name: 'guid',
        transforms: [transforms.stringTrim, transforms.stringToUpperCase]
      }]
      const data = { guid: ' 123abc  ' }
      const { factory } = build(fieldDefinitions)
      const actual = factory(data)
      const expected = { guid: '123ABC' }
      deepEqual(actual, expected)
    })

    it('should apply defaults', () => {
      const fieldDefinitions = [{
        name: 'guid',
        transforms: [transforms.stringTrim],
        default: 'abcd'
      }]
      const data = { guid: 'abcd' }
      const { factory } = build(fieldDefinitions)
      const actual = factory(data)
      const expected = { guid: 'abcd' }
      deepEqual(actual, expected)
    })

    it('should apply defaults from functions', () => {
      const fieldDefinitions = [{
        name: 'guid',
        transforms: [transforms.stringTrim],
        default: () => 'abcd'
      }]
      const data = { guid: 'abcd' }
      const { factory } = build(fieldDefinitions)
      const actual = factory(data)
      const expected = { guid: 'abcd' }
      deepEqual(actual, expected)
    })

    it('should apply transforms to defaults', () => {
      const fieldDefinitions = [{
        name: 'guid',
        transforms: [transforms.stringTrim],
        default: () => 'abcd   \n   '
      }]
      const data = { guid: 'abcd' }
      const { factory } = build(fieldDefinitions)
      const actual = factory(data)
      const expected = { guid: 'abcd' }
      deepEqual(actual, expected)
    })

    it('should clean the object from extraneous fields', () => {
      const fieldDefinitions = [{
        name: 'guid',
        transforms: [transforms.stringTrim]
      }]
      const data = { guid: 'abcd', foo: 'bar' }
      const { factory } = build(fieldDefinitions)
      const actual = factory(data)
      const expected = { guid: 'abcd' }
      deepEqual(actual, expected)
    })
  })

  describe('validator()', () => {
    it('should return validation errors', () => {
      const fieldDefinitions = [{
        name: 'guid',
        validators: [validators.notFalsey]
      }]
      const data = { guid: '  ' }
      const { validator } = build(fieldDefinitions)
      const actual = validator(data)
      const expected = [{
        type: 'required',
        message: 'guid is required.',
        name: 'guid'
      }]
      deepEqual(actual, expected)
    })

    it('should not return validation errors for valid fields', () => {
      const fieldDefinitions = [{
        name: 'guid',
        validators: [validators.notFalsey]
      }]
      const data = { guid: '1234' }
      const { validator } = build(fieldDefinitions)
      const actual = validator(data)
      const expected = []
      deepEqual(actual, expected)
    })
  })
})
