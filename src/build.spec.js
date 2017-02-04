const { build } = require('./build')
const { deepEqual } = require('assert')
const transforms = require('./transforms')
const validators = require('./validators')

const fieldDefinitions = [{
  name: 'guid',
  validators: [validators.notFalsey],
  transforms: [transforms.stringTrim],
  defaultValue: '12345'
}, {
  name: 'options',
  fields: [{
    name: 'frequency',
    validators: [validators.notFalsey],
    transforms: [transforms.stringTrim],
    defaultValue: 'weekly'
  }]
}, {
  name: 'roles',
  list: true,
  // listValidators: [atLeastOneElement],
  // listTransforms: [sortList],
  transforms: [transforms.stringTrim],
  validators: [validators.notFalsey]
}, {
  name: 'addresses',
  list: true,
  // listValidators: [atLeastOneElement],
  // listTransforms: [sortListByProperty('city')],
  fields: [{
    name: 'city',
    validators: [validators.notFalsey],
    transforms: [transforms.stringTrim],
    defaultValue: ''
  }, {
    name: 'state',
    // validators: [required],
    transforms: [transforms.stringTrim, transforms.stringToUpperCase],
    defaultValue: ''
  }]
}]

describe('build.js', () => {
  describe('build()', () => {
    describe('factory()', () => {
      it('should create factory from field definitions', () => {
        const { factory } = build(fieldDefinitions)
        const actual = factory()
        const expected = {
          guid: '12345',
          options: {
            frequency: 'weekly'
          },
          roles: [],
          addresses: []
        }
        deepEqual(actual, expected)
      })

      it('should use fields passed into factory', () => {
        const { factory } = build(fieldDefinitions)
        const data = {
          addresses: [{
            city: 'San Diego'
          }],
          roles: ['client']
        }
        const actual = factory(data)
        const expected = {
          guid: '12345',
          options: {
            frequency: 'weekly'
          },
          roles: ['client'],
          addresses: [{
            city: 'San Diego',
            state: ''
          }]
        }
        deepEqual(actual, expected)
      })

      it('should apply transforms', () => {
        const { factory } = build(fieldDefinitions)
        const data = {
          addresses: [{
            city: 'San Diego  ',
            state: ' ca '
          }],
          roles: ['  client   '],
          options: {
            frequency: ' daily  '
          }
        }
        const actual = factory(data)
        const expected = {
          guid: '12345',
          options: {
            frequency: 'daily'
          },
          roles: ['client'],
          addresses: [{
            city: 'San Diego',
            state: 'CA'
          }]
        }
        deepEqual(actual, expected)
      })
    })

    describe('validate()', () => {
      it('should validator fields', () => {
        const { validate } = build(fieldDefinitions)
        const data = {
          guid: null,
          options: {
            frequency: null
          },
          roles: [null, false],
          addresses: [{
            city: null
          }, {
            city: 'San Diego'
          }, {
            city: false
          }]
        }
        const actual = validate(data)
        const expected = [{
          validator: 'notFalsey',
          path: ['guid']
        }, {
          validator: 'notFalsey',
          path: ['options', 'frequency']
        }, {
          validator: 'notFalsey',
          path: ['roles', '0']
        }, {
          validator: 'notFalsey',
          path: ['roles', '1']
        }, {
          validator: 'notFalsey',
          path: ['addresses', '0', 'city']
        }, {
          validator: 'notFalsey',
          path: ['addresses', '2', 'city']
        }]
        deepEqual(actual, expected)
      })
    })
  })
})
