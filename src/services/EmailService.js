require('dotenv').config()
import nodemailer from 'nodemailer'
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <dungnguyenkma050402@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyByHTMLEmail(dataSend)

    });
}
let getBodyByHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =

            `
        <h3>Xin chào ${dataSend.patientName}! </h3>
        <p>Bạn nhận được thông tin này vì đã đặt lịch khám bệnh online trên ứng dụng BookingCare của chúng tôi.</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b> </div>
        <div><b>Bác sĩ: ${dataSend.doctorName} </b> </div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng Click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh </p>

        <div><a href=${dataSend.redirectLink} target="_blank">Click here </div>
        <div>Xin chân thành cảm ơn </div>
        `
    }
    if (dataSend.language === 'en') {
        result =

            `
        <h3>Dear ${dataSend.patientName}! </h3>
        <p>You received this information because you booked an online medical appointment on our BookingCare application.</p>
        <p>Information for scheduling medical examination: </p>
        <div><b>Time: ${dataSend.time}</b> </div>
        <div><b>Doctor: ${dataSend.doctorName} </b> </div>
        <p>If the above information is true, please Click on the link below to confirm and complete the medical appointment booking procedure. </p>

        <div><a href=${dataSend.redirectLink} target="_blank">Click here </div>
        <div>Sincerely thank </div>
        `
    }
    return result
}
let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <dungnguyenkma050402@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        attachments: [{   // encoded string as an attachment
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: 'base64'
        },],
        html: getBodyByHTMLEmailRemedy(dataSend)

    });
}
let getBodyByHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =

            `
        <h3>Xin chào ${dataSend.patientName} ! </h3>
        <p>Bạn nhận được thông tin này vì đã đặt lịch khám bệnh online trên ứng dụng BookingCare của chúng tôi.</p>
      
        <p>Thông tin đơn thuốc được gửi trong file đính kèm. </p>

        
        <div>Xin chân thành cảm ơn </div>
        `
    }
    if (dataSend.language === 'en') {
        result =

            `
        <h3>Dear ${dataSend.patientName}! </h3>
        <p>You received this information because you booked an online medical appointment on our BookingCare application.</p>
       
        <p>File </p>
        <div>Sincerely thank </div>
        `
    }
    return result
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}