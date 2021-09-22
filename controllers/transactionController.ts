import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import sequelize from 'sequelize'
import { v4 as uuid } from 'uuid'
import db from '../models'
import catchAsync from './../utils/catchAsync'
import { AppError } from '../utils/Errors'

const getTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.Transaction.findByPk(req.params.id)

    if (!transaction) {
      return next(
        new AppError(`No transaction found by ID ${req.params.id}`, 404)
      )
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: transaction,
      },
    })
  }
)

const createTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    console.log(req.body)
    const url = await db.Url.findByPk(req.body.urlId)
    if (!url) {
      return next(new AppError(`No urls found by ID ${req.body.url}`, 404))
    }

    const transactionId: string = uuid()

    //TODO: handle db errors
    const reqTransaction = await db.ReqTransaction.create({
      client_id: req.body.customerId,
      externalId: req.body.id,
      transactionId: transactionId,
    })
    const transaction = await db.Transaction.create({
      transactionId: transactionId,
      amount: req.body.amount,
      date: req.body.date,
      url: req.body.urlId,
      status: 'inProgress',
    })

    res.status(200).json({
      status: 'success',
      data: {
        data: url,
      },
    })
  }
)

export { getTransaction, createTransaction }
