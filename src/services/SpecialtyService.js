const db = require("../models")

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown

                })
                console.log('check', data.descriptionHTML);

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.specialty.findAll()

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                let data = await db.specialty.findOne({
                    where: {
                        id: inputId
                    }, raw: true,
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorSpecialty = []
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                            }, raw: true,
                            attributes: ['doctorId', 'provinceId']
                        })
                        console.log('check doctorSpecialty', doctorSpecialty);
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            }, raw: true,
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty


                } else {
                    data: { }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data,
                })





            }

        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}