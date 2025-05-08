import mongoose from "mongoose"


const DreamSchema = new mongoose.Schema({
    title: String,
    content: String,
    analysis: String,
    category: String,
    story: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        default: ''
    },
    createdAd: {
        type: Date,
        default: Date.now
    }
})


DreamSchema.index({ title: 'text', content: 'text' });

const Dream = mongoose.model('Dream', DreamSchema)

export default Dream