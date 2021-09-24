import checkSchema from '../validators/transactionValidator'

const express = require('express')
import {
  getTransaction,
  createTransaction,
} from '../controllers/transactionController'

const router = express.Router()

router.route('/').post(checkSchema, createTransaction)
router.route('/:id').get(getTransaction)

export default router
