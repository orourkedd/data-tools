const { deepEqual } = require('assert')
const fields = require('./fields')
const uuid = require('uuid')
const transforms = require('./transforms')
const validators = require('./validators')
const { build } = require('./build')
const { forEach } = require('ramda')

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

  describe('address()', () => {
    it('should create an address field definition', () => {
      const actual = fields.address('workAddress')
      const expected = {
        name: 'workAddress',
        fields: [
          fields.text('address1'),
          fields.text('address2'),
          fields.text('city'),
          fields.text('state', { transforms: [transforms.stringToUpperCase] }),
          fields.text('zip')
        ]
      }
      deepEqual(actual, expected)
    })

    it('should build the address field', () => {
      const fieldDefinitions = [fields.address('workAddress')]
      const { factory } = build(fieldDefinitions)
      const actual = factory()
      const expected = {
        workAddress: {
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: ''
        }
      }
      deepEqual(actual, expected)
    })

    it('should use required option', () => {
      const fieldDefinitions = [fields.address('workAddress', { required: true })]
      const { validate } = build(fieldDefinitions)
      const actual = validate()
      const expected = [{
        validator: 'notFalsey',
        path: ['workAddress', 'address1']
      }, {
        validator: 'notFalsey',
        path: ['workAddress', 'address2']
      }, {
        validator: 'notFalsey',
        path: ['workAddress', 'city']
      }, {
        validator: 'notFalsey',
        path: ['workAddress', 'state']
      }, {
        validator: 'notFalsey',
        path: ['workAddress', 'zip']
      }]
      deepEqual(actual, expected)
    })
  })

  describe('enumeration()', () => {
    it('should create an enumeration field', () => {
      const fieldDefinitions = [fields.enumeration('status', { values: [1, 2, 3] })]
      const { validate } = build(fieldDefinitions)

      forEach((i) => {
        const actual = validate({
          status: i
        })
        const expected = []
        deepEqual(actual, expected)
      }, [1, 2, 3])

      const actual = validate({
        status: 5
      })
      const expected = [{ validator: 'enumeration', path: ['status'] }]
      deepEqual(actual, expected)
    })

    it('should validate an enumeration as a subfield', () => {
      const fieldDefinitions = [{
        name: 'test',
        fields: [fields.enumeration('status', { values: [1, 2, 3] })]
      }]
      const { validate } = build(fieldDefinitions)

      forEach((i) => {
        const actual = validate({
          test: {
            status: i
          }
        })
        const expected = []
        deepEqual(actual, expected)
      }, [1, 2, 3])

      const actual = validate({
        test: {
          status: 5
        }
      })
      const expected = [{ validator: 'enumeration', path: ['test', 'status'] }]
      deepEqual(actual, expected)
    })
  })

  describe('boolean()', () => {
    it('should return a boolean field', () => {
      const fieldDefinitions = [fields.boolean('flag')]
      const { validate } = build(fieldDefinitions)
      deepEqual(validate({ flag: 1 }), [{ validator: 'enumeration', path: ['flag'] }])
      deepEqual(validate({ flag: true }), [])
      deepEqual(validate({ flag: false }), [])
    })
  })

  describe('number()', () => {
    it('should return a number field', () => {
      const fieldDefinitions = [fields.number('count')]
      const { validate } = build(fieldDefinitions)
      deepEqual(validate({ count: 'f' }), [{ validator: 'number', path: ['count'] }])
      deepEqual(validate({ count: 0 }), [])
      deepEqual(validate({ count: 37 }), [])
      deepEqual(validate({ count: 37.5 }), [])
    })
  })
})
