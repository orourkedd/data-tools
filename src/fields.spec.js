const { deepEqual } = require('assert')
const fields = require('./fields')
const uuid = require('uuid')
const transforms = require('./transforms')
const validators = require('./validators')
const { build }  = require('./build')

describe('fields.js', () => {
  describe('guid()', () => {
    it('should create a guid field definition', () => {
      const actual = fields.guid('guid')
      const expected = {
        name: 'guid',
        defaultValue: uuid.v4,
        transforms: [transforms.stringTrim],
        validators: [validators.notFalsey]
      }
      deepEqual(actual, expected)
    })

    it('should build the guid field', () => {
      const fieldDefinitions = [fields.guid('guid')]
      const { factory } = build(fieldDefinitions)
      const actual = factory().guid.length
      const expected = 36
      deepEqual(actual, expected)
    })

    it('should validate the guid field', () => {
      const fieldDefinitions = [fields.guid('guid')]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['guid']
      }]
      deepEqual(actual, expected)
    })
  })

  describe('text()', () => {
    it('should create a text field definition', () => {
      const actual = fields.text('firstName')
      const expected = {
        name: 'firstName',
        defaultValue: '',
        transforms: [transforms.stringTrim],
        validators: []
      }
      deepEqual(actual, expected)
    })

    it('should build the text field', () => {
      const fieldDefinitions = [fields.text('firstName')]
      const { factory } = build(fieldDefinitions)
      const actual = factory()
      const expected = {
        firstName: ''
      }
      deepEqual(actual, expected)
    })

    it('should use required option', () => {
      const fieldDefinitions = [fields.text('firstName', { required: true })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['firstName']
      }]
      deepEqual(actual, expected)
    })

    it('should use custom validators', () => {
      const fieldDefinitions = [fields.text('firstName', { validators: [validators.notFalsey] })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['firstName']
      }]
      deepEqual(actual, expected)
    })

    it('should use custom transforms', () => {
      const fieldDefinitions = [fields.text('firstName', { transforms: [transforms.stringToUpperCase] })]
      const { factory } = build(fieldDefinitions)
      const actual = factory({
        firstName: 'frankie'
      })
      const expected = {
        firstName: 'FRANKIE'
      }
      deepEqual(actual, expected)
    })
  })

  describe('url()', () => {
    it('should create a url field definition', () => {
      const actual = fields.url('profilePicture')
      const expected = {
        name: 'profilePicture',
        defaultValue: '',
        transforms: [transforms.stringTrim],
        validators: [validators.url]
      }
      deepEqual(actual, expected)
    })

    it('should build the url field', () => {
      const fieldDefinitions = [fields.url('profilePicture')]
      const { factory } = build(fieldDefinitions)
      const actual = factory()
      const expected = {
        profilePicture: ''
      }
      deepEqual(actual, expected)
    })

    it('should use required option', () => {
      const fieldDefinitions = [fields.url('profilePicture', { required: true })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['profilePicture']
      }]
      deepEqual(actual, expected)
    })

    it('should use custom validators', () => {
      const fieldDefinitions = [fields.url('profilePicture', { validators: [validators.notFalsey] })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['profilePicture']
      }]
      deepEqual(actual, expected)
    })

    it('should validate urls (failure)', () => {
      const fieldDefinitions = [fields.url('profilePicture')]
      const { validate } = build(fieldDefinitions)
      const actual = validate({
        profilePicture: 'not-a-url'
      })
      const expected = [{
        validator: 'url',
        path: ['profilePicture']
      }]
      deepEqual(actual, expected)
    })

    it('should validate urls (success)', () => {
      const fieldDefinitions = [fields.url('profilePicture')]
      const { validate } = build(fieldDefinitions)
      const actual = validate({
        profilePicture: 'http://www.orourkedd.com'
      })
      const expected = []
      deepEqual(actual, expected)
    })

    it('should use custom transforms', () => {
      const fieldDefinitions = [fields.url('profilePicture', { transforms: [transforms.stringToUpperCase] })]
      const { factory } = build(fieldDefinitions)
      const actual = factory({
        profilePicture: 'frankie'
      })
      const expected = {
        profilePicture: 'FRANKIE'
      }
      deepEqual(actual, expected)
    })
  })

  describe('phone()', () => {
    it('should create a phone field definition', () => {
      const actual = fields.phone('phone')
      const expected = {
        name: 'phone',
        defaultValue: '',
        transforms: [transforms.stringTrim, transforms.stringNumbersOnly],
        validators: [validators.phone]
      }
      deepEqual(actual, expected)
    })

    it('should build the phone field', () => {
      const fieldDefinitions = [fields.phone('phone')]
      const { factory } = build(fieldDefinitions)
      const actual = factory()
      const expected = {
        phone: ''
      }
      deepEqual(actual, expected)
    })

    it('should use required option', () => {
      const fieldDefinitions = [fields.phone('phone', { required: true })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['phone']
      }]
      deepEqual(actual, expected)
    })

    it('should use custom validators', () => {
      const fieldDefinitions = [fields.phone('phone', { validators: [validators.notFalsey] })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['phone']
      }]
      deepEqual(actual, expected)
    })

    it('should validate urls (failure)', () => {
      const fieldDefinitions = [fields.phone('phone')]
      const { validate } = build(fieldDefinitions)
      const actual = validate({
        phone: 'not-a-phone-number'
      })
      const expected = [{
        validator: 'phone',
        path: ['phone']
      }]
      deepEqual(actual, expected)
    })

    it('should validate urls (success)', () => {
      const fieldDefinitions = [fields.phone('phone')]
      const { validate } = build(fieldDefinitions)
      const actual = validate({
        phone: '3109872342'
      })
      const expected = []
      deepEqual(actual, expected)
    })

    it('should remove all non numbers', () => {
      const fieldDefinitions = [fields.phone('phone')]
      const { factory } = build(fieldDefinitions)
      const actual = factory({
        phone: '3109872342 and a string'
      })
      const expected = {
        phone: '3109872342'
      }
      deepEqual(actual, expected)
    })
  })
})
