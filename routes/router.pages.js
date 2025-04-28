import express from 'express'
import { getForm, getRegister, getLogin, getStory, test } from '../controller/controller.pages.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'

const router = express.Router()




router.get("/form", isAuthenticated, getForm)

router.get("/register", getRegister)

router.get("/login", getLogin)

router.get("/story/:id", getStory)

router.get("/", test)







export default router