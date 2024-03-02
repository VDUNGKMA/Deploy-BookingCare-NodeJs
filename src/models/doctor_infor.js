'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Infor extends Model {
       
        static associate(models) {
            Doctor_Infor.belongsTo(models.User, {foreignKey: 'doctorId' })

            Doctor_Infor.belongsTo(models.allCode, {foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            Doctor_Infor.belongsTo(models.allCode, {foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })
            Doctor_Infor.belongsTo(models.allCode, {foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' })



        }
    }



    Doctor_Infor.init({
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Doctor_Infor',
        freezeTableName: true
    });
    return Doctor_Infor;
};