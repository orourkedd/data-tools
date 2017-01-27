const { merge, flatten, filter, reduce, map, prop, pick } = require('ramda')

function clean (fieldDefinitions, data) {
  const nameProp = prop('name')
  const fieldNames = map(nameProp, fieldDefinitions)
  return pick(fieldNames, data)
}

function applyTransforms (fieldDefinitions, data) {
  return reduce((data, {name, transforms}) => {
    if (!transforms || transforms.length === 0) return data
    const originalValue = data[name]
    const transformValue = (value, transform) => transform(value)
    const transformedValue = reduce(transformValue, originalValue, transforms)
    return merge(data, { [name]: transformedValue })
  }, data, fieldDefinitions)
}

function runValidators (fieldDefinitions, data) {
  let errors = map((fieldDefinition) => {
    const runValidator = (validator) => validator(fieldDefinition.name, data[fieldDefinition.name], data, fieldDefinition)
    return map(runValidator, fieldDefinition.validators)
  }, fieldDefinitions)

  const flattenedErrors = flatten(errors)
  return filter(v => v, flattenedErrors)
}

function build (fieldDefinitions) {
  const normalizeFieldDefinitions = map(normalizeFieldDefinition, fieldDefinitions)
  const factory = (customFields = {}) => {
    const getDefault = (d) => typeof d === 'function' ? d() : d
    const setDefault = (p, fieldDefinition) => {
      if (fieldDefinition.fields) {
        const { factory: subFactory } = build(fieldDefinition.fields)
        const subField = subFactory()
        p[fieldDefinition.name] = subField
      } else {
        p[fieldDefinition.name] = getDefault(fieldDefinition.default)
      }
      return p
    }
    const entityWithDefaults = reduce(setDefault, {}, normalizeFieldDefinitions)
    const merged = merge(entityWithDefaults, customFields)
    const entityWithTransformations = applyTransforms(normalizeFieldDefinitions, merged)
    const cleaned = clean(fieldDefinitions, entityWithTransformations)
    return cleaned
  }

  const validator = (data) => runValidators(normalizeFieldDefinitions, data)
  return { factory, validator }
}

function normalizeFieldDefinition (definition) {
  return merge({
    transforms: [],
    validators: []
  }, definition)
}

module.exports = {
  applyTransforms,
  runValidators,
  build
}
