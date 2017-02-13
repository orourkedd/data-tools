const isUrl = require('is-url')

function notFalsey (value, path) {
  if (value) return

  return {
    validator: 'notFalsey',
    path
  }
}

function url (value, path) {
  if (!value) return
  if (!isUrl(value)) {
    return {
      validator: 'url',
      path
    }
  }
}

function phone (value, path) {
  if (!value) return
  if (value.length !== 10) {
    return {
      validator: 'phone',
      path
    }
  }
}

function enumeration (value, path, fieldDefinition) {
  const { values } = fieldDefinition
  if (values.indexOf(value) > -1) return

  return {
    validator: 'enumeration',
    path
  }
}

function boolean (value, path) {
  if (value === undefined) return
  if (value !== true && value !== false) {
    return {
      validator: 'boolean',
      path
    }
  }
}

function number (value, path) {
  if (value === undefined) return
  if (!isNaN(value)) return

  return {
    validator: 'number',
    path
  }
}

module.exports = {
  notFalsey,
  url,
  phone,
  enumeration,
  boolean,
  number
}
