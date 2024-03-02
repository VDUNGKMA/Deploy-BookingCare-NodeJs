import db from '../models/index'
const moment = require('moment-timezone');
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);
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
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExitst = await checkUserEmail(email)
            if (isExitst) {
                let user = await db.User.findOne({
                    attributes: ['id','email', 'password','firstName','lastName', 'roleId'],
                    where: { email: email },
                    raw: true
                })

                if (user) {
                    let checkpassword = bcrypt.compareSync(password, user.password)
                    if (checkpassword) {
                        userData.errCode = 0
                        userData.errMessage = `OK`
                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = `Wrong Password`

                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `No User Found with this Email`
                }

            } else {
                userData.errCode = 1
                userData.errMessage = `Your email isn't exist in your system.Plz try email`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: { email: email }
            }
            )
            if (data) {
                resolve(true)
            }
            resolve(false)
        } catch (error) {
            reject(error)
        }
    })
}
let handleGetAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: { exclude: ['password'] },
                    raw: true
                })

            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({ where: { id: userId }, raw: true })
                delete users.password
            }
            console.log('users=', users);
            resolve(users)
        } catch (error) {
            reject(error)
        }

    })

}
let handleCreatNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing input parameter`
                })
            }
            else {
                let isExitst = await checkUserEmail(data.email)
                if (!isExitst) {
                    let hashpasswordbyBcrypt = await hashUserPassword(data.password)
                    let user = await db.User.create({
                        email: data.email,
                        password: hashpasswordbyBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        gender: data.gender ,
                        phoneNumber: data.phoneNumber,
                        image: data.avartar,
                        roleId: data.roleId,
                        positionId: data.positionId,

                    })
                    resolve({
                        errCode: 0,
                        errMessage: `Insert new user succeed`
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: `Your Email already in use. Plz try againt`
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })


}
let handleEditUser = async (userdata) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(!userdata.id|| !userdata.gender || !userdata.roleId ||!userdata.positionId){
                resolve({
                    errCode:2,
                    errMessage:'Missing required parameters'
                })
            }
            let user = await db.User.update({
                
                firstName: userdata.firstName,
                lastName: userdata.lastName,
                address: userdata.address,
                gender: userdata.gender ,
                phoneNumber: userdata.phoneNumber,
                roleId: userdata.roleId,
                positionId: userdata.positionId,
                image: userdata.avartar

            }, {
                where: { id: userdata.id }
            })
            resolve({
                errCode: 0,
                errMessage: 'Update user succeed'
            })

        } catch (error) {
            reject(error)
        }
    })


}
let handleDeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input Id '
                })
            } else {
                const user = await db.User.findOne({
                    where: { id: userId }
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'No find user in the system'
                    })
                } else {
                    await user.destroy({
                        where: { id: userId }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'OK. delete user succeed'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
 let getAllCodeService =(typeInput)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!typeInput ){
                resolve({
                    errCode:1,
                    errMessage: 'Missing input parameter'
                })
            }
            let res={}
            let allCode =await db.allCode.findAll({
                where :{type: typeInput}
            })
            resolve({
                errCode:0,
                data:allCode
            })
        } catch (error) {
            reject(error)
        }
    })
 }
 
 
module.exports = {
    handleUserLogin: handleUserLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreatNewUser: handleCreatNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCodeService: getAllCodeService,

}