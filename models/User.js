import mongoose from "mongoose"
import bcrypt from 'bcrypt'




const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,

    },
    password: {
        type: String,
    }
},
    { timestamps: true })



userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash
        next()
    })
})


const User = mongoose.model('User', userSchema);


export default User;