const { checkSchema } = require('express-validator')

export default checkSchema({
  id: {
    in: ['body'],
    errorMessage: 'ID is wrong',
    isString: true,
    isLength: {
      errorMessage: 'ID should be between 5 and 30 chars long',
      options: [{ min: 5 }, { max: 30 }],
    },
    toString: true,
  },
  customerId: {
    in: ['body'],
    errorMessage: 'Customer ID is wrong',
    isLength: {
      errorMessage: 'ID should be between 5 and 30 chars long',
      options: [{ min: 5 }, { max: 30 }],
      isString: true,
      toString: true,
    },
  },
  amount: {
    errorMessage: 'Amount must be an integer',
    in: ['body'],
    isInt: true,
    toInt: true,
  },
  date: {
    errorMessage: 'date must be a Date',
    in: ['body'],
    isISO8601: true,
  },
  urlId: {
    errorMessage: 'urlId must be an integer',
    in: ['body'],
    isInt: true,
    toInt: true,
  },
})
