import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import { connectDB } from './config/db.js'
import routerPages from './routes/router.pages.js'
import routerDreams from './routes/router.dream.js'
import routerUser from './routes/router.user.js'

dotenv.config()

const port = process.env.PORT


const app = express()


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
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