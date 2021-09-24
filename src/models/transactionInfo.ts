import { Model, Optional, UUIDV4 } from 'sequelize'

export interface TransactionInfoAttributes {
  id: string
  amount: number
  date: Date
  url: number
  status: string
}

export interface TransactionInfoCreationAttributes
  extends Optional<TransactionInfoAttributes, 'id'> {}

module.exports = (sequelize: any, DataTypes: any) => {
  class TransactionInfo
    extends Model<TransactionInfoAttributes>
    implements TransactionInfoAttributes
  {
    id!: string
    amount!: number
    date!: Date
    url!: number
    status!: string
  }
  TransactionInfo.init(
    {
      id: {
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
      modelName: 'TransactionInfo',
    }
  )
  return TransactionInfo
}
