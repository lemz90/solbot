import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        discordId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        publicKey: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
      },
    );
  }
}

export default User; 