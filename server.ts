import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })
const morgan = require('morgan')
import db from './models'
import app from './app'
import importDevData from './seeders/importDevData'

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log(`DB connection successful`)
  })
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      importDevData().then(() => {
        console.log('Dev data successfully created')
      })
    }
  })

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`)
})
