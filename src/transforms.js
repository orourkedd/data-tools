const stringToUpperCase = (s) => (s || '').toUpperCase()

const stringTrim = (s) => (s || '').trim()

const phone = (p) => (p || '').replace(/\D/g,'')

module.exports = {
  stringToUpperCase,
  stringTrim,
  phone
}
