import Express from "express";
import homeController from "../controller/HomeController"
import userController from "../controller/UserController"
import doctorController from '../controller/DoctorController'
import patientController from '../controller/PatientController'
import SpecialtyController from "../controller/SpecialtyController";
import ClinicControler from "../controller/ClinicControler";
let router = Express.Router()

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putUpdateCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/creat-new-user', userController.handleCreatNewUser)
    router.put(`/api/edit-user`, userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/getAllDoctors', doctorController.getAllDoctors)
    router.post('/api/save-info-doctors', doctorController.postInfoDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)
    router.post('/api/send-remedy', doctorController.sendRemedy)
    
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)

    router.post('/api/creat-new-specialty', SpecialtyController.createSpecialty)
    router.get('/api/get-specialty', SpecialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', SpecialtyController.getDetailSpecialtyById)

    router.post('/api/creat-new-clinic', ClinicControler.createClinic)
    router.get('/api/get-clinic',ClinicControler.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', ClinicControler.getDetailClinicById)






    return app.use("", router)
}
module.exports = initWebRoutes
