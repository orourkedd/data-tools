const fields = require('./fields')
const { build } = require('./index')

const userDefinition = [
  fields.guid('guid'),
  fields.requiredString('firstName'),
  fields.requiredString('lastName'),
  fields.numberGreaterThanZero('age'),
  fields.address('address')
]

const { factory, validator } = build(userDefinition)

const data = {
  firstName: null,
  lastName: "O'Rourke",
  age: 10,
  address: {
    street: '1234 Main St',
    city: 'San Diego',
    zip: '92119'
  }
}
const built = factory(data)
console.log(built)
const built2 = factory(built)
console.log(built2)
console.log(validator(built2))
