import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import axios, { AxiosError } from 'axios'
import { v4 as uuid } from 'uuid'
import db from '../models'
import catchAsync from '../utils/catchAsync'
import { AppError } from '../utils/Errors'
import { TransactionInfoAttributes } from '../models/transactionInfo'
import { ClientTransactionIdAttributes } from '../models/clientTransactionId'

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
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() })
    }

    const url = await db.Url.findByPk(req.body.urlId)
    if (!url) {
      return next(new AppError(`No urls found by ID ${req.body.url}`, 404))
    }

    let transactionInfo = await getTransactionInfoIfExist(req)
    if (transactionInfo) {
      if (isCompleted(transactionInfo)) {
        return writeResponse(res, transactionInfo)
      }
    } else {
      transactionInfo = await createTransactionOrError(req)
      if (isDBTransactionError(transactionInfo)) {
        return next(new AppError(`Can not create transaction`, 409))
      }
    }

    const response = await PostToBank(url.url, transactionInfo)
    transactionInfo.status = response.data.status
    await transactionInfo.save()

    writeResponse(res, transactionInfo)
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
  data: { status: string }
}

interface DBTransactionError {
  status: string
  message: string
}

const PostToBank = async (
  url: string,
  transactionInfo: TransactionInfoAttributes
): Promise<Bank_response> => {
  const bank_request: Bank_request = {
    id: transactionInfo.id,
    amount: transactionInfo.amount,
    date: transactionInfo.date,
  }

  const response = await axios(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: bank_request,
  }).catch((err: Error | AxiosError) => {
    //TODO handle the error so we can return meaningful answer
    return { status: 'error' }
  })
  if (isBank_response(response)) {
    console.log(response)
    return response
  }
  return { status: 'error', data: { status: 'error' } }
}

const isBank_response = (
  bank_response: any
): bank_response is Bank_response => {
  return 'status' in bank_response
}

const createTransactionOrError = async (req: Request) => {
  const transactionId: string = uuid()
  const clientTransactionIdAttributes: ClientTransactionIdAttributes = {
    client_id: req.body.customerId,
    externalId: req.body.id,
    transactionId: transactionId,
  }
  const transactionInfoAttributes: TransactionInfoAttributes = {
    id: transactionId,
    amount: req.body.amount,
    date: req.body.date,
    url: req.body.urlId,
    status: 'inProgress',
  }

  const t = await db.sequelize.transaction()
  try {
    await db.ClientTransactionId.create(
      clientTransactionIdAttributes,

      { transaction: t }
    )
    const transactionInfo = await db.TransactionInfo.create(
      transactionInfoAttributes,
      { transaction: t }
    )
    await t.commit()
    return transactionInfo
  } catch (error) {
    await t.rollback()
    return { status: 'error', message: 'Can not create transaction in the DB' }
  }
}

const isDBTransactionError = (
  dBTransactionError: any
): dBTransactionError is DBTransactionError => {
  return 'status' in dBTransactionError && dBTransactionError.status === 'error'
}

const getTransactionInfoIfExist = async (req: Request) => {
  const clientTransactionId = await db.ClientTransactionId.findOne({
    where: {
      client_id: req.body.customerId,
      externalId: req.body.id,
    },
  })
  if (clientTransactionId) {
    return await db.TransactionInfo.findByPk(clientTransactionId.transactionId)
  }
}

const isCompleted = (transactionInfo: TransactionInfoAttributes) => {
  return (
    transactionInfo.status === 'success' || transactionInfo.status === 'error'
  )
}

const writeResponse = (
  res: Response,
  transactionInfo: TransactionInfoAttributes
) => {
  res.status(200).json({
    status: 'success',
    data: {
      transactionId: transactionInfo.id,
      transactionStatus: transactionInfo.status,
    },
  })
}
