
import { json } from 'body-parser'
import db from '../models/index'
import CRUDService from '../services/CRUDservice'
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll({ raw: true })
        console.log('>>>data', data)
        return res.render('homePage.ejs', { data: data })

    } catch (e) {
        console.log(e)
    }
}
let getCRUD = (req, res) => {
    return res.render('crudPage.ejs')
}
let postCRUD = async (req, res) => {
    const data = CRUDService.createNewUser(req.body)
    return res.send('data')
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser()
    // console.log('>>>display= ',display)
    return res.render('display-CRUD.ejs', { getAllUser: data })

}
let getEditCRUD = async (req, res) => {
    const userId = req.query.id
    // console.log(userId)
    const getUserById = await CRUDService.getUserById(userId)
    console.log('>>>>>get user by id:', getUserById)
    return res.render('editCRUD.ejs', { getUserById: getUserById })
}
let putUpdateCRUD = async (req, res) => {
    const userdata = req.body
    if (!userdata) {
        return res.send('user not found')
    }
    else {
        let data = await CRUDService.updateUserbyId(userdata)
        return res.send('update page crud')
    }


}
let deleteCRUD = async (req, res) => {
    const userId = req.query.id
    if (userId) {
        let data = await CRUDService.deleteUserById(userId)
        console.log('delete user succeed')
        return res.redirect('/get-crud')
    } else {
        return res.send('User not found')
    }

}
let handleLogin = (req, res) =>{
    return res.send('Hello world')

}
module.exports = {
    getHomePage: getHomePage, getCRUD: getCRUD,
    postCRUD: postCRUD, displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD, putUpdateCRUD: putUpdateCRUD,
    deleteCRUD: deleteCRUD, handleLogin:handleLogin
}