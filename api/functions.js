export function areEmptyValues(array) {
  if (!array.every(value => value !== '' && value != null)) {
    return true
  }
  return false
}