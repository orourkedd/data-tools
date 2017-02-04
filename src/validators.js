function notFalsey (value, path) {
  if (value) return

  return {
    validator: 'notFalsey',
    path
  }
}

module.exports = {
  notFalsey
}
