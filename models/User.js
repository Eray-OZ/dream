import mongoose from "mongoose"
import bcrypt from 'bcrypt'




const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true


    },
    password: {
        type: String,
        required: true
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