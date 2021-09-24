import { Model } from 'sequelize'

export interface ClientTransactionIdAttributes {
  client_id: string
  externalId: string
  transactionId: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ClientTransactionId
    extends Model<ClientTransactionIdAttributes>
    implements ClientTransactionIdAttributes
  {
    client_id!: string
    externalId!: string
    transactionId!: string
  }
  ClientTransactionId.init(
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
      modelName: 'ClientTransactionId',
    }
  )
  return ClientTransactionId
}
