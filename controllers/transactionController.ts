import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import axios, {AxiosError} from 'axios';
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
    // check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // check if url exist
    const url = await db.Url.findByPk(req.body.urlId)
    if (!url) {
      return next(new AppError(`No urls found by ID ${req.body.url}`, 404))
    }

    // check is the request is duplicate
    let clientTransactionId = await db.ClientTransactionId.findOne({
      where: {
        client_id: req.body.customerId,
        externalId: req.body.id,
      }
    })
    if (clientTransactionId) {
      return next(new AppError(`Duplicate`, 404))
    }

    // Create clientTransactionId and Transaction
    const transactionId: string = uuid()
    clientTransactionId = await db.ClientTransactionId.create({
      client_id: req.body.customerId,
      externalId: req.body.id,
      transactionId: transactionId,
    })
    const transaction = await db.Transaction.create({
      id: transactionId,
      amount: req.body.amount,
      date: req.body.date,
      url: req.body.urlId,
      status: 'inProgress',
    })


    const bank_request: Bank_request = {
      id: transaction.id,
      amount: transaction.amount,
      date: transaction.date
    }
    const response = await PostToBank(url.url, bank_request)
    console.log(response)
    transaction.status = response.status
    await transaction.save

    res.status(200).json({
      status: 'success',
      data: {
          id: transaction.id,
          status: transaction.status
        },
      })



    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     data: url,
    //   },
    // })
  }
)

export { getTransaction, createTransaction }

interface Bank_request {
  id: string
  amount: number
  date: Date
}

interface Bank_response {
  status: string
}

const PostToBank = async (url: string, body: Bank_request): Promise<Bank_response> => {
  const response = await axios(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: body
  }).catch((err: Error | AxiosError) => {
    return {status: 'error'}
  })
  if (isBank_response(response)) {
    return {status: response.status}
  }
  return {status: 'error'}
}

const isBank_response = (bank_response: any): bank_response is Bank_response => {
  return "status" in bank_response;
}