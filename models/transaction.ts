import { Model, Optional, UUIDV4 } from 'sequelize'
import { UrlAttributes } from './url'

interface TransactionAttributes {
  transactionId: string
  amount: number
  date: Date
  url: number
  status: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Transaction
    extends Model<TransactionAttributes>
    implements TransactionAttributes
  {
    transactionId!: string
    amount!: number
    date!: Date
    url!: number
    status!: string
  }
  Transaction.init(
    {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  )
  return Transaction
}
