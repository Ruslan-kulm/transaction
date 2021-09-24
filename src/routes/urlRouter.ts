const express = require('express')
import {
  createUrl,
  getAllUrl,
  getUrl,
  deleteUrl,
  updateUrl,
} from '../controllers/urlController'

const router = express.Router()

router.route('/').get(getAllUrl).post(createUrl)
router.route('/:id').get(getUrl).patch(updateUrl).delete(deleteUrl)

export default router
