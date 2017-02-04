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

function stringNumbersOnly (s) {
  if (!s) return s
  if (typeof s !== 'string') return s
  return s.replace(/\D/g, '')
}

module.exports = {
  stringTrim,
  stringToUpperCase,
  stringToLowerCase,
  stringNumbersOnly
}
