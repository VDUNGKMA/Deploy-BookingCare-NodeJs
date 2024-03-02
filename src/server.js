import Express from "express";
import bodyParser from "body-parser"; // thu vien ho tro lay tham so tu phia client gui ve 
import viewEngine from './config/viewEngine'
import initWebRoute from './route/web'
import connectDB from './config/connectDB'
import 'dotenv/config'
import cors from 'cors';

//import  configDotenv  from "dotenv/config";
let app = Express()
//config app
app.use(cors({
  origin: process.env.URL_REACTJS, // Đặt origin của trang web của bạn
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Cho phép sử dụng withCredentials
  optionsSuccessStatus: 204, // Một số trình duyệt yêu cầu giá trị này để xem là CORS được chấp nhận
}));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


viewEngine(app)
initWebRoute(app)

connectDB()
let port = process.env.PORT || 6969


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})