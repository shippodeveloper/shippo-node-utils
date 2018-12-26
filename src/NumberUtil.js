isNumeric = (input) => {
  if (typeof input === 'number'
    && input !== Infinity
    && !isNaN(input)) {
    return true;
  }
  if (typeof input === 'string' && input.trim() !== '') {
    return !isNaN(parseFloat(input)) && (Number.isFinite ? Number.isFinite(+input) : isFinite(+input));
  }
  return false;
};

module.exports = {isNumeric};