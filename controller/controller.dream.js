import Dream from '../models/Dream.js'
import axios from 'axios'




export const addDream = async (req, res) => {


    const { title, content } = req.body

    const prompt = `Bu rüyanın sembolik ve psikolojik analizini yap: ${content}`

    let analysis = `Analiz yapılmadı`

    let category = `Diğer`


    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )


        analysis = response.data.candidates[0].content.parts[0].text


        const promptCat = `Bu analizin aşağıdaki kategorilerden hangisine ait olduğunu belirt ve cevap olarak sadece bu seçeneklerden birini dön, açıklama yazma: Korku, Mutluluk, İlişki, İş, Aile, Geçmiş, Gelecek, Diğer. : ${content}`


        const responseCat = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: promptCat }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )

        category = responseCat.data.candidates[0].content.parts[0].text



    } catch (error) {
        console.error(error.message)
    }


    const newDream = await Dream.create({
        title, content, analysis, category
    })



    res.render('analysis.ejs', { dream: newDream })
}




export const getAnalysisPage = async (req, res) => {

    try {

        const { id } = req.params

        const dream = await Dream.findById(id)


        res.render('analysis.ejs', { dream })

    } catch (error) {
        console.error(error.message)
    }

}


export const getStoryPage = async (req, res) => {

    try {

        const { id } = req.params

        const dream = await Dream.findById(id)


        const prompt = `Bir kişi, ${dream.title} adlı bir rüya gördü. Rüya, ${dream.content} şeklinde başladı. Ancak, bu rüya gizemli ve çözülmemiş bir şekilde yarıda kaldı. Yapay zeka, bu rüyanın devamını yaratmalı ve şu öğeleri içermelidir:
        Rüyanın atmosferi: [rüyanın atmosferi hakkında bir açıklama ekleyin, örneğin: karanlık, heyecanlı, huzur verici, korkutucu]
        Karakterlerin ilişkisi: [ana karakterin diğer karakterlerle olan ilişkisini anlatın]
        Karakterlerin karşılaştığı zorluklar: [karakterin rüya boyunca karşılaştığı zorluklar, engeller veya düşmanlar hakkında bilgi verin]
        Rüyanın teması: [rüyanın temel mesajı veya teması, örneğin: kaybolma, korku, keşif, aşk, hırs]
        Rüyanın sonuna nasıl ulaşılabilir: [yapay zekanın bu rüyayı nasıl sonlandıracağı hakkında bir yönlendirme ekleyin]
        Tüm bu öğeleri kullanarak rüyanın devamını yazmanı ve rüyanın nasıl tamamlanacağını yaratıcı bir şekilde açıklamanı istiyorum.`




        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )




        const story = response.data.candidates[0].content.parts[0].text


        dream.story += story

        await dream.save()

        res.render('story.ejs', { dream })

    } catch (error) {
        console.error(error)
    }

}





export const getJournal = async (req, res) => {


    const journals = await Dream.find({})

    res.render('journal.ejs', { journals })
}



