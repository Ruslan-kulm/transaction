import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { AppError } from './utils/Errors'
import { errorHandler } from './controllers/errorController'
import urlRouter from './routes/urlRouter'
import transactionRouter from './routes/transactionRouter'
import bankMockRouter from './routes/bankMockRouter'

const app = express()

app.use(express.json())

app.use('/api/v1/urls', urlRouter)
app.use('/api/v1/transactions', transactionRouter)
app.use('/bankMock', bankMockRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorHandler)

export default app
