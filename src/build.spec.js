const transforms = require('./transforms')
const validators = require('./validators')
const fields = require('./fields')
const { build } = require('./index')
const { deepEqual } = require('assert')

describe('index.js', () => {
  describe('factory()', () => {
    describe('single', () => {
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

      it('should build nested fields', () => {
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
    })

    describe('list', () => {
      it('should apply transforms', () => {
        const fieldDefinitions = [{
          name: 'guids',
          transforms: [transforms.stringTrim, transforms.stringToUpperCase],
          list: true
        }]
        const data = { guids: [' 123abc  '] }
        const { factory } = build(fieldDefinitions)
        const actual = factory(data)
        const expected = { guids: ['123ABC'] }
        deepEqual(actual, expected)
      })

      it('should apply defaults', () => {
        const fieldDefinitions = [{
          name: 'guid',
          transforms: [transforms.stringTrim],
          default: 'abcd',
          list: true
        }]
        const data = { guid: ['abcd'] }
        const { factory } = build(fieldDefinitions)
        const actual = factory(data)
        const expected = { guid: ['abcd'] }
        deepEqual(actual, expected)
      })

      it('should apply defaults from functions', () => {
        const fieldDefinitions = [{
          name: 'guid',
          transforms: [transforms.stringTrim],
          default: () => 'abcd',
          list: true
        }]
        const data = { guid: ['abcd'] }
        const { factory } = build(fieldDefinitions)
        const actual = factory(data)
        const expected = { guid: ['abcd'] }
        deepEqual(actual, expected)
      })

      it('should apply transforms to defaults', () => {
        const fieldDefinitions = [{
          name: 'guid',
          transforms: [transforms.stringTrim],
          default: () => 'abcd   \n   ',
          list: true
        }]
        const data = { guid: ['abcd'] }
        const { factory } = build(fieldDefinitions)
        const actual = factory(data)
        const expected = { guid: ['abcd'] }
        deepEqual(actual, expected)
      })

      it('should clean the object from extraneous fields', () => {
        const fieldDefinitions = [{
          name: 'guid',
          transforms: [transforms.stringTrim],
          list: true
        }]
        const data = { guid: ['abcd'], foo: 'bar' }
        const { factory } = build(fieldDefinitions)
        const actual = factory(data)
        const expected = { guid: ['abcd'] }
        deepEqual(actual, expected)
      })

      it('should build nested fields', () => {
        const fieldDefinitions = [fields.address('addresses', { list: true })]
        const { factory } = build(fieldDefinitions)
        const actual = factory({ addresses: [{ city: 'San Diego'}] })
        const expected = {
          addresses: [{
            address1: '',
            address2: '',
            city: 'San Diego',
            state: '',
            zip: ''
          }]
        }
        deepEqual(actual, expected)
      })

      it('should build empt nested fields', () => {
        const fieldDefinitions = [fields.address('addresses', { list: true })]
        const { factory } = build(fieldDefinitions)
        const actual = factory()
        const expected = { addresses: [] }
        deepEqual(actual, expected)
      })
    })
  })

  describe('validator()', () => {
    describe('single', () => {
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

      it('should validate sub fields', () => {
        const fieldDefinitions = [
          fields.guid('guid'),
          fields.address('workAddress')
        ]
        const data = {
          guid: '12345',
          workAddress: {
            address1: '1234 Main St',
            address2: '',
            city: '',
            state: '',
            zip: '92119'
          }
        }
        const { validator } = build(fieldDefinitions)
        const actual = validator(data)
        const expected = [{
          subfield: true,
          name: 'workAddress',
          type: 'address',
          error: {
            name: 'city',
            type: 'required'
          }
        }, {
          subfield: true,
          type: 'address',
          name: 'workAddress',
          error: {
            name: 'state',
            type: 'required'
          }
        }]
        deepEqual(actual, expected)
      })
    })
  })

  describe('list', () => {
    it('should return validation errors', () => {
      const fieldDefinitions = [{
        name: 'guids',
        validators: [validators.notFalsey],
        list: true
      }]
      const data = { guids: ['abc', '  '] }
      const { validator } = build(fieldDefinitions)
      const actual = validator(data)
      const expected = [{
        list: true,
        name: 'guids',
        index: 0,
        error: {
          type: 'required',
          name: 'guids'
        }
      }]
      deepEqual(actual, expected)
    })

    it('should not return validation errors for valid fields', () => {
      const fieldDefinitions = [{
        name: 'guids',
        validators: [validators.notFalsey],
        list: true
      }]
      const data = { guids: ['1234'] }
      const { validator } = build(fieldDefinitions)
      const actual = validator(data)
      const expected = []
      deepEqual(actual, expected)
    })

    it('should validate sub fields', () => {
      const fieldDefinitions = [
        fields.guid('guid'),
        fields.address('addresses', { list: true })
      ]
      const data = {
        guid: '12345',
        addresses: [{
          address1: '1234 Main St',
          address2: '',
          city: '',
          state: 'CA',
          zip: '92119'
        }]
      }
      const { validator } = build(fieldDefinitions)
      const actual = validator(data)
      const expected = [{
        subfield: true,
        list: true,
        name: 'addresses',
        type: 'address',
        index: 0,
        error: {
          name: 'city',
          type: 'required'
        }
      }]
      deepEqual(actual, expected)
    })
  })
})
