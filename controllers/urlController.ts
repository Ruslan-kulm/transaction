import { Request, Response, NextFunction } from 'express'
import { UrlAttributes } from '../models/url'
import db from '../models'
import catchAsync from './../utils/catchAsync'
import { AppError } from '../utils/Errors'

const createUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = await db.Url.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        data: url,
      },
    })
  }
)

const getUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = await db.Url.findByPk(req.params.id)

    if (!url) {
      return next(new AppError(`No urls found by ID ${req.params.id}`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: url,
      },
    })
  }
)

const deleteUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = await db.Url.destroy({ where: { id: req.params.id } })
    if (!url) {
      return next(new AppError(`No urls found by ID ${req.params.id}`, 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  }
)

const updateUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.id
    const url = await db.Url.update(req.body, {
      where: { id: Number(req.params.id) },
    })

    if (url[0] === 0) {
      return next(new AppError(`No urls found by ID ${req.params.id}`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: url,
      },
    })
  }
)

const getAllUrl = catchAsync(async (req: Request, res: Response) => {
  const doc: [UrlAttributes] = await db.Url.findAll()
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  })
})

export { createUrl, getAllUrl, getUrl, deleteUrl, updateUrl }
