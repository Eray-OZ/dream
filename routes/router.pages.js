import express from 'express'
import { getForm, getRegister, getLogin, getStory, getIndexPage } from '../controller/controller.pages.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'
import { logoutUser } from '../controller/controller.user.js'

const router = express.Router()




router.get("/form", isAuthenticated, getForm)

router.get("/register", getRegister)

router.get("/login", getLogin)

router.get("/story/:id", getStory)

router.get("/logout", logoutUser)

router.get("/", getIndexPage)







export default router