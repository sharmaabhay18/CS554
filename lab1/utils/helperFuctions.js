const isValidString = (str, name) => {
  if (typeof str !== "string" || str?.trim().length === 0)
    throw {
      status: 400,
      message: `${name} should be of type string and contains valid input`,
    };
};

const isValidPositiveNumber = (num, name) => {
  const parseNumber = Number(num);
  if (isNaN(parseNumber))
    throw {
      status: 400,
      message: `${name} should be of type string and contains valid input`,
    };

  if (typeof parseNumber !== "number" || parseNumber < 1)
    throw {
      status: 400,
      message: `${name} should be of type string and contains valid input`,
    };
};

module.exports = {
  isValidString,
  isValidPositiveNumber,
};
