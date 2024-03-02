import User from '../models/user'
import db from '../models/index'
const { resolvePreset } = require('@babel/core');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
let createNewUser = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordByBcryptjs = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordByBcryptjs,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender == '1' ? true : false,
                phoneNumber: data.phoneNumber,
                roleId: data.roleId,

            })
            resolve('Insert a new record succeed')
        } catch (e) {
            reject(e)
        }

    })

}
let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hash = bcrypt.hashSync(password, salt);
            resolve(hash)
        } catch (e) {
            reject(e)
        }
    })
}
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                raw: true

            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })

}
let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = await db.User.findOne({ where: { id: userId }, raw: true })
            if (!userData) {
                resolve({})
            } else {
                resolve(userData)
            }

        } catch (e) {
            reject(e)
        }
    })
}
let updateUserbyId = (userdata) => {
    return new Promise( async(resolve, reject) => {
        try {
            // Change everyone without a last name to "Doe"
         let data=   await db.User.update({ 
                firstName: userdata.firstname,
                lastName: userdata.lastname,
                address: userdata.address
                 }, {
                where: {
                   id: userdata.id

                },
            });
            console.log(data)
           resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
let deleteUserById = userId =>{
    return new Promise( async (resolve, reject) =>{
            try {
                let data= await db.User.destroy({
                    where: {
                      id: userId
                    },
                  });
                  resolve(data)
            } catch (error) {
                reject(error)
            }
    })
}
module.exports = {
    createNewUser: createNewUser, getAllUser: getAllUser,
    getUserById: getUserById, updateUserbyId: updateUserbyId,
    deleteUserById:deleteUserById
}