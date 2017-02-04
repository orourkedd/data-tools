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

module.exports = {
  notFalsey,
  url,
  phone
}
