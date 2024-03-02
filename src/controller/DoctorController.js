import user from '../models/user'
import doctorService from '../services/DoctorService'


let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10
    try {
        let users = await doctorService.getTopDoctorHomeService(+limit)
        return res.status(200).json(users)

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
            users: []
        })
    }

}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors()
        res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        res.status(200).json(response)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getProfileDoctorById = async(req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getListPatientForDoctor = async(req, res)=>{
    try {
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let sendRemedy = async(req, res)=>{
    try {
        let infor = await doctorService.sendRemedy(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}