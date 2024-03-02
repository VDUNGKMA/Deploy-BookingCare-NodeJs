const db = require("../models")

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.imageBase64 || !data.descriptionHTML ||
                !data.descriptionMarkdown || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown

                })

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
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('v1');
            let data = await db.Clinic.findAll()
            console.log('check data', data);
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
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    }, raw: true,
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorClinic = []

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId,
                        }, raw: true,
                        attributes: ['doctorId', 'provinceId']
                    })


                    data.doctorClinic = doctorClinic


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
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}