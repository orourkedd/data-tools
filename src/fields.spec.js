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
})
