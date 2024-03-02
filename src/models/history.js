'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class histoty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  histoty.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    file: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'histoty',
  });
  return histoty;
};