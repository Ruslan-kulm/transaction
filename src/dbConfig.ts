import { Dialect, Sequelize } from 'sequelize'

const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbPassword = process.env.DB_PASSWORD
const dbDriver = process.env.DB_DRIVER as Dialect

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
})

export default sequelizeConnection
