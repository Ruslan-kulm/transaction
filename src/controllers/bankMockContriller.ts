import catchAsync from '../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'

export const bankMockSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      status: 'success',
    })
  }
)

export const bankMockError = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      status: 'Error',
    })
  }
)
