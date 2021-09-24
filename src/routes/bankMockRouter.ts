import express from 'express'
const router = express.Router()
import {
  bankMockError,
  bankMockSuccess,
} from '../controllers/bankMockContriller'

router.route('/success').post(bankMockSuccess)
router.route('/error').post(bankMockError)

export default router
