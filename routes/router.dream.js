import express from 'express'
import { addDream, getAnalysisPage, getJournal, getStoryPage } from '../controller/controller.dream.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'


const router = express.Router()



router.post("/", addDream)

router.get("/analysis/:id", getAnalysisPage)

router.get("/story/:id", getStoryPage)

router.get("/", getJournal)







export default router