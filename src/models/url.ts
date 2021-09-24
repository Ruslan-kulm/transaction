import { Model, Optional } from 'sequelize'

export interface UrlAttributes {
  id: number
  name: string
  url: string
}
export interface UrlCreationAttributes extends Optional<UrlAttributes, 'id'> {}

module.exports = (sequelize: any, DataTypes: any) => {
  class Url
    extends Model<UrlAttributes, UrlCreationAttributes>
    implements UrlAttributes
  {
    id!: number
    name!: string
    url!: string
  }
  Url.init(
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 30],
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
          len: [5, 70],
        },
      },
    },
    {
      sequelize,
      modelName: 'Url',
    }
  )
  return Url
}
