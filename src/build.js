const {
  addIndex,
  curry,
  filter,
  flatten,
  map,
  merge,
  mergeAll,
  pick,
  pickBy,
  prop,
  reduce,
} = require('ramda')

function clean (fieldDefinitions, data) {
  const nameProp = prop('name')
  const fieldNames = map(nameProp, fieldDefinitions)
  return pick(fieldNames, data)
}

function applyTransforms (fieldDefinitions, data) {
  return reduce((data, { name, transforms, list }) => {
    if (!transforms || transforms.length === 0) return data
    const originalValue = data[name]
    const transformValue = (value, transform) => transform(value)
    let transformedValue
    if (list) {
      transformedValue = map((v) => reduce(transformValue, v, transforms), originalValue)
    } else {
      transformedValue = reduce(transformValue, originalValue, transforms)
    }
    return merge(data, { [name]: transformedValue })
  }, data, fieldDefinitions)
}

function runValidators (fieldDefinitions, entity) {
  let s1 = map((fieldDefinition) => {
    const { name, validators: fieldValidators, list } = fieldDefinition
    const value = entity[name]

    const run = (name, value, entity, fieldDefinition) => {
      const v = (validator) => validator(name, value, entity, fieldDefinition)
      return map(v, fieldValidators)
    }

    if (list) {
      const mapIndexed = addIndex(map)
      return map((value) => {
        const l1 = run(name, value, entity, fieldDefinition)
        const l2 = filter(v => v, l1)
        if (l2.length === 0) return
        return mapIndexed((listElementError, i) => {
          if (Array.isArray(listElementError)) {
            return map((e) => {
              return {
                name,
                list: true,
                index: i,
                subfield: true,
                type: e.type,
                error: e.error
              }
            }, listElementError)
          } else {
            return {
              name,
              list: true,
              index: i,
              error: listElementError
            }
          }
        }, l2)
      }, value)
    } else {
      return run(name, value, entity, fieldDefinition)
    }
  }, fieldDefinitions)

  const s2 = flatten(s1)
  const s3 = filter(v => v, s2)
  return s3
}

function build (fieldDefinitions) {
  const normalizeFieldDefinitions = map(normalizeFieldDefinition, fieldDefinitions)
  const factory = (customFields = {}) => {
    const getDefault = (d) => typeof d === 'function' ? d() : d
    const setDefault = (p, fieldDefinition) => {
      if (fieldDefinition.list === true) {
        if (fieldDefinition.fields) {
          let { factory: subFactoryList } = build(fieldDefinition.fields)
          p[fieldDefinition.name] = map(subFactoryList, p[fieldDefinition.name] || [])
        } else {
          p[fieldDefinition.name] = p[fieldDefinition.name] || []
        }
        return p
      }

      if (fieldDefinition.fields) {
        const { factory: subFactory } = build(fieldDefinition.fields)
        const subfield = subFactory()
        p[fieldDefinition.name] = subfield
      } else {
        p[fieldDefinition.name] = p[fieldDefinition.name] || getDefault(fieldDefinition.default)
      }
      return p
    }
    const entityWithDefaults = reduce(setDefault, customFields, normalizeFieldDefinitions)
    const listDefinitions = filter((f) => f.list, normalizeFieldDefinitions)
    const listKeys = map((f) => f.name, listDefinitions)
    const lists = pick(listKeys, customFields)
    const merged = mergeAll([entityWithDefaults, customFields, lists])
    const entityWithTransformations = applyTransforms(normalizeFieldDefinitions, merged)
    const cleaned = clean(fieldDefinitions, entityWithTransformations)
    return cleaned
  }

  const validator = curry(runValidators)(normalizeFieldDefinitions)
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
