import express from 'express'
import { getForm, getRegister, getLogin, getStory, getIndexPage, getImagePage } from '../controller/controller.pages.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'
import { logoutUser } from '../controller/controller.user.js'

const router = express.Router()




router.get("/form", isAuthenticated, getForm)

router.get("/register", getRegister)

router.get("/login", getLogin)

router.get("/story/:id", isAuthenticated, getStory)

router.get("/image/:id", isAuthenticated, getImagePage)

router.get("/logout", logoutUser)

router.get("/", getIndexPage)







export default router