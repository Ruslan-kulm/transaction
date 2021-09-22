interface APIError {
  statusCode: number
  status: string
  message: string
}

export class AppError extends Error implements APIError {
  statusCode: number
  status: string

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

    Error.captureStackTrace(this, this.constructor)
  }
}
