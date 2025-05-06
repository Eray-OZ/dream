import express from 'express'
import { addDream, getAnalysisPage, getJournal, getStoryPage, filterDream, searchDream } from '../controller/controller.dream.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'


const router = express.Router()



router.post("/", isAuthenticated, addDream)

router.get("/analysis/:id", isAuthenticated, getAnalysisPage)

router.get("/story/:id", isAuthenticated, getStoryPage)

router.get("/", isAuthenticated, getJournal)

router.get("/filter", isAuthenticated, filterDream)

router.get("/search", isAuthenticated, searchDream)








export default router