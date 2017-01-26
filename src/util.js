function isEmptyString (s) {
  if (typeof s !== 'string') return false
  return !s.trim()
}

module.exports = {
  isEmptyString
}
