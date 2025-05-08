import express from 'express'
import { addDream, getAnalysisPage, getJournal, getStoryPage, filterDream, searchDream, deleteDream, generateImage } from '../controller/controller.dream.js'
import { isAuthenticated } from '../middleware/middleware.authenticate.js'


const router = express.Router()



router.post("/", isAuthenticated, addDream)

router.get("/analysis/:id", isAuthenticated, getAnalysisPage)

router.get("/story/:id", isAuthenticated, getStoryPage)

router.get("/", isAuthenticated, getJournal)

router.get("/filter", isAuthenticated, filterDream)

router.get("/search", isAuthenticated, searchDream)

router.delete("/delete/:id", deleteDream)

router.get("/image/:id", isAuthenticated, generateImage)










export default router