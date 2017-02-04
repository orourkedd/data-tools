function stringTrim (s = '') {
  if (typeof s !== 'string') return s
  return s.trim()
}

function stringToUpperCase (s = '') {
  if (typeof s !== 'string') return s
  return s.toUpperCase()
}

function stringToLowerCase (s = '') {
  if (typeof s !== 'string') return s
  return s.toLowerCase()
}

module.exports = {
  stringTrim,
  stringToUpperCase,
  stringToLowerCase
}
