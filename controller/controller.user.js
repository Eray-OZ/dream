import User from '../models/User.js'
import bcrypt from 'bcrypt'




export const registerUser = async (req, res) => {

    try {

        const user = await User.create(req.body);
        res.redirect('/login')

    } catch (error) {
        res.json(error)
    }
}





export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        let same = false


        if (user) {
            same = await bcrypt.compare(password, user.password)
        }
        else {
            return res.status(401).json({
                succeded: false,
                error: 'There is no such user',
            })
        }


        if (same) {

            const { username } = req.body;
            req.session.user = { username };

            res.redirect("/form")

        }

        else {
            res.status(401).json({
                succeded: false,
                error: 'Paswords are not matched',
            });
        }

    } catch (error) {
        res.json(error)
    }
}






export const logoutUser = async (req, res) => {
    try {
        res.redirect('/')


    } catch (error) {
        res.json({ error })
    }
}