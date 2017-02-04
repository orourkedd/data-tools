const {
  addIndex,
  clone,
  curry,
  filter,
  flatten,
  map,
  merge,
  reduce
} = require('ramda')

const applyTransforms = curry((transforms, value) => {
  return reduce((p, transform) => {
    return transform(p)
  }, value, transforms)
})

const applyValidators = curry((validators, value, path) => {
  return map((v) => v(value, path), validators)
})

function buildListOfScalarSubfields (fieldDefinition, userFields = {}) {
  const { name } = fieldDefinition
  const factory = buildFactory(fieldDefinition.fields)
  const values = userFields[name] || []
  return map(factory, values)
}

function buildListOfScalars (fieldDefinition, userFields = {}) {
  const { name } = fieldDefinition
  const values = userFields[name] || []
  const t = applyTransforms(fieldDefinition.transforms)
  const l = map(t, values)
  return l
}

function buildScalarSubfields (fieldDefinition, userFields = {}) {
  const { name } = fieldDefinition
  const factory = buildFactory(fieldDefinition.fields)
  return factory(userFields[name])
}

function buildScalar (fieldDefinition, userFields = {}) {
  const { name, defaultValue } = fieldDefinition
  const value = userFields[name] || defaultValue
  const t = applyTransforms(fieldDefinition.transforms, value)
  return t
}

function buildFactory (fieldDefinitions) {
  return function (userFields = {}) {
    const s1 = reduce((entity, fieldDefinition) => {
      const nfd = normalizeFieldDefinition(fieldDefinition)
      const { list, fields, name } = fieldDefinition
      if (list === true && fields) {
        entity[name] = buildListOfScalarSubfields(nfd, userFields)
      } else if (list === true) {
        entity[name] = buildListOfScalars(nfd, userFields)
      } else if (fields) {
        entity[name] = buildScalarSubfields(nfd, userFields)
      } else {
        entity[name] = buildScalar(nfd, userFields)
      }

      return entity
    }, {}, fieldDefinitions)
    return s1
  }
}

function validateListOfScalarSubfields (fieldDefinition, values, path) {
  const validate = buildValidator(fieldDefinition.fields)
  const mapIndexed = addIndex(map)
  return mapIndexed((value, i) => {
    const p = clone(path)
    p.push(i.toString())
    return validate(value, p)
  }, values)
}

function validateListOfScalars (fieldDefinition, values, path) {
  const mapIndexed = addIndex(map)
  return mapIndexed((value, i) => {
    const p = clone(path)
    p.push(i.toString())
    return applyValidators(fieldDefinition.validators, value, p)
  }, values)
}

function validateScalarSubfields (fieldDefinition, value, path) {
  const validate = buildValidator(fieldDefinition.fields)
  return validate(value, path)
}

function validateScalar (fieldDefinition, value, path) {
  return applyValidators(fieldDefinition.validators, value, path)
}

function buildValidator (fieldDefinitions) {
  return function (entity, path = []) {
    let errors = []
    const s1 = reduce((errors, fieldDefinition) => {
      const nfd = normalizeFieldDefinition(fieldDefinition)
      const { list, fields, name } = fieldDefinition
      const value = entity[name]
      const p = clone(path)
      p.push(name)
      let e
      if (list === true && fields) {
        e = validateListOfScalarSubfields(nfd, value, p)
      } else if (list === true) {
        e = validateListOfScalars(nfd, value, p)
      } else if (fields) {
        e = validateScalarSubfields(nfd, value, p)
      } else {
        e = validateScalar(nfd, value, p)
      }

      errors.push(e)
      return errors
    }, errors, fieldDefinitions)

    const s2 = flatten(s1)
    const s3 = filter(v => v, s2)
    return s3
  }
}

function normalizeFieldDefinition (fieldDefinition) {
  return merge({
    transforms: [],
    validators: []
  }, fieldDefinition)
}

function build (fieldDefinitions) {
  const factory = buildFactory(fieldDefinitions)
  const validate = buildValidator(fieldDefinitions)

  return {
    factory,
    validate
  }
}

module.exports = {
  build
}
