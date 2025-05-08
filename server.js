import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import methodOverride from 'method-override'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary'

import { connectDB } from './config/db.js'
import routerPages from './routes/router.pages.js'
import routerDreams from './routes/router.dream.js'
import routerUser from './routes/router.user.js'





dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})


const port = process.env.PORT


const app = express()


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))
app.use(express.static('public'))
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
)
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
}))
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})




app.use("/", routerPages)
app.use("/dream", routerDreams)
app.use("/user", routerUser)




app.listen(port, () => {
    connectDB()
    console.log(`Server running on http://localhost:${port}`)
})