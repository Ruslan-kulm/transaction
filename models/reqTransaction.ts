import { Model } from 'sequelize'

interface ReqTransactionAttributes {
  client_id: string
  externalId: string
  transactionId: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ReqTransaction
    extends Model<ReqTransactionAttributes>
    implements ReqTransactionAttributes
  {
    client_id!: string
    externalId!: string
    transactionId!: string
  }
  ReqTransaction.init(
    {
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      externalId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ReqTransaction',
    }
  )
  return ReqTransaction
}
