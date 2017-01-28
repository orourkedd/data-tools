const validators = require('./validators')
const transforms = require('./transforms')
const fields = require('./fields')
const { deepEqual } = require('assert')

describe('fields.js', () => {
  describe('text()', () => {
    it('should create text field', () => {
      const actual = fields.text('name')
      const expected = {
        name: 'name',
        validators: [],
        transforms: [transforms.stringTrim],
        default: ''
      }
      deepEqual(actual, expected)
    })

    it('should add transforms and validators', () => {
      const actual = fields.text('name', { required: true, default: 'd' })
      const expected = {
        name: 'name',
        validators: [validators.notFalsey],
        transforms: [transforms.stringTrim],
        default: 'd'
      }
      deepEqual(actual, expected)
    })
  })
})
