import db from '../models/index'
require('dotenv').config()
import _, { reject, result } from 'lodash'
import EmailService from './EmailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password'] },
                limit: limit,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: db.allCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.allCode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }

                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}
let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment',
        'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']
    let isValid = true
    let element = ''
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break
        }
    }
    return { isValid, element }
}
let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                //upsert to markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML,
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown,
                            doctorMarkdown.description = inputData.description
                        await doctorMarkdown.save()
                    }
                }
                //upsert to Doctor Infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,

                    }, raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId
                    doctorInfor.priceId = inputData.selectedPrice
                    doctorInfor.paymentId = inputData.selectedPayment
                    doctorInfor.provinceId = inputData.selectedProvince
                    doctorInfor.addressClinic = inputData.addressClinic
                    doctorInfor.nameClinic = inputData.nameClinic
                    doctorInfor.note = inputData.note,
                        doctorInfor.specialtyId = inputData.specialtyId
                    doctorInfor.clinicId = inputData.clinicId

                    await doctorInfor.save()

                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentMarkdown', 'contentHTML', 'description']
                        },
                        { model: db.allCode, as: 'positionData' },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['doctorId', 'id'] },
                            include: [
                                {
                                    model: db.allCode, as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.allCode, as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.allCode, as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },


                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                else if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // console.log('check data send:', schedule);
                // get all existing data
                let existing = await db.schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })



                //compare different 
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })
                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate)
                }
                console.log('check tocreate', toCreate)

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let dataSchedule = await db.schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.allCode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }


                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = []
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        {
                            model: db.allCode, as: 'priceTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.allCode, as: 'paymentTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.allCode, as: 'provinceTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentMarkdown', 'contentHTML', 'description']
                        },
                        { model: db.allCode, as: 'positionData' },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['doctorId', 'id'] },
                            include: [
                                {
                                    model: db.allCode, as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.allCode, as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.allCode, as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },


                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                else if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                let data = await db.booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include:
                            {
                                model: db.allCode, as: 'genderData',
                                attributes: ['valueEn', 'valueVi']
                            },
                        },
                        {
                            model: db.allCode, as: 'timeTypeDataPatient',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                //update patient status
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                //send email remedy
                await EmailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
                //send email remedy
            }
        } catch (e) {
            reject(e)

        }
    })

}
module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}