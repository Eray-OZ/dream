import Dream from "../models/Dream.js"


export const getForm = async (req, res) => {
    res.render('form.ejs')
}



export const getRegister = async (req, res) => {
    res.render('register.ejs')
}


export const getLogin = async (req, res) => {
    res.render('login.ejs')
}

export const getStory = async (req, res) => {

    const { id } = req.params
    const dream = await Dream.findById(id)


    res.render('story.ejs', { dream })
}




export const getIndexPage = async (req, res) => {
    res.render('index.ejs')
}









