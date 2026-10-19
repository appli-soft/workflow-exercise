/**
 * Task 1: Ashish
 * Clean raw string/number monetary values into a 2-decimal float for MariaDB DECIMAL(12,2).
 * @param {string|number} rawValue
 * @returns {number|null}
 */
function sanitizeAmount(rawValue) {
  // TODO: Implement amount parsing and rounding
  if(rawValue === null || rawValue === undefined){
    return null;
  }

  let value = String(rawValue).trim()

  if(value === ""){
    return null
  }

  value = value.replace(/[₹$€£,\s]/g, "")

  if (!/^-?\d+(\.\d+)?$/.test(value)) {
  return null;
}

  const amount = Number(value)

  if(!Number.isFinite(amount)|| Math.abs(amount)>=10000000000){
    return null
  }

  const roundAmount = Math.round((amount+Number.EPSILON)*100)/100

  return Object.is(roundAmount, -0)?0 : roundAmount
}

module.exports = { sanitizeAmount };