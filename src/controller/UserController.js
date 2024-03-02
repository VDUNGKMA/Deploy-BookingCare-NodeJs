import user from '../models/user'
import userService from '../services/userService'

let handleLogin = async (req, res) =>{
    let email= req.body.email
    let password= req.body.password
    if(!email || !password){
        return res.status(401).json({
            errCode: 1,
            errMessage: 'Missing input parameter'
        })
    }
    else {
        let userData = await userService.handleUserLogin(email, password)
    return res.json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user : userData.user ? userData.user :'faild:faild'
    })
    }
}
let handleGetAllUsers = async (req, res)=>{
    const id = req.query.id //ALL, id
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage:'Missing input parameter',
            users:[]
        })
    }
    let users= await userService.handleGetAllUsers(id)
    return res.status(200).json({
        errCode:0,
        errMessage: 'OK',
        users:users
    })
}
let handleCreatNewUser =async(req, res)=>{
    const data= await userService.handleCreatNewUser(req.body)
    return res.status(200).json({
        errCode: data.errCode,
        errMessage: data.errMessage
    })
}
let handleEditUser = async (req, res)=>{
    const data = await userService.handleEditUser(req.body)
    res.status(200).json({
        errCode: data.errCode,
        errMessage: data.errMessage
    })

}
let handleDeleteUser =async (req, res)=>{
    const data = await userService.handleDeleteUser(req.query.id)
    res.status(200).json({
        errCode: data.errCode,
        errMessage: data.errMessage
    })
}

let getAllCode = async(req, res)=>{
    try {
        
        // console.log('check type ',req.query.type);
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch (error) {
        console.log('get all code failed',error);
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from server'
        })
    }
  

}

module.exports ={ handleLogin:handleLogin,
                  handleGetAllUsers: handleGetAllUsers,
                  handleCreatNewUser: handleCreatNewUser,
                  handleEditUser: handleEditUser,
                  handleDeleteUser: handleDeleteUser,
                  getAllCode: getAllCode }