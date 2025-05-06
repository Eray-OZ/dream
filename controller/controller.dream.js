import Dream from '../models/Dream.js'
import axios from 'axios'




export const addDream = async (req, res) => {

    const userId = req.session.userId

    console.log(userId)

    const { title, content } = req.body

    const prompt = `Bu rüyanın sembolik ve psikolojik analizini yap, cevap olarak sadece rüya analizini dön herhangi bir soru sorma : ${content}`

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

        analysis = analysis.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s]/g, '')



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

        category = responseCat.data.candidates[0].content.parts[0].text.trim()



        const newDream = await Dream.create({
            title: title,
            content: content,
            analysis: analysis,
            category: category,
            user: userId
        })



        res.render('analysis.ejs', { dream: newDream })


    } catch (error) {
        console.error(error.message)
    }





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


        // const prompt = `Bir kişi, ${dream.title} adlı bir rüya gördü. Rüya, ${dream.content} şeklinde başladı. Ancak, bu rüya gizemli ve çözülmemiş bir şekilde yarıda kaldı. Yapay zeka, bu rüyanın devamını yaratmalı ve şu öğeleri içermelidir:
        // Rüyanın atmosferi: [rüyanın atmosferi hakkında bir açıklama ekleyin, örneğin: karanlık, heyecanlı, huzur verici, korkutucu]
        // Karakterlerin ilişkisi: [ana karakterin diğer karakterlerle olan ilişkisini anlatın]
        // Karakterlerin karşılaştığı zorluklar: [karakterin rüya boyunca karşılaştığı zorluklar, engeller veya düşmanlar hakkında bilgi verin]
        // Rüyanın teması: [rüyanın temel mesajı veya teması, örneğin: kaybolma, korku, keşif, aşk, hırs]
        // Rüyanın sonuna nasıl ulaşılabilir: [yapay zekanın bu rüyayı nasıl sonlandıracağı hakkında bir yönlendirme ekleyin]
        // Tüm bu öğeleri kullanarak rüyanın devamını yazmanı ve rüyanın nasıl tamamlanacağını yaratıcı bir şekilde açıklamanı istiyorum.
        // Dönüş olarak sadece rüyayı dön`


        const prompt = `${dream.content} rüyasının devamını getiren bir hikaye yaz, sadece hikayenin kendisini dön herhangi bir açıklama yapma ya da soru sorma`




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




        const story = response.data.candidates[0].content.parts[0].text.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s]/g, '')



        dream.story += story

        await dream.save()

        res.render('story.ejs', { dream })

    } catch (error) {
        console.error(error)
    }

}





export const getJournal = async (req, res) => {


    const id = req.session.userId

    try {


        const journals = await Dream.find({ user: id })

        console.log(journals)

        res.render('journal.ejs', { journals })

    } catch (error) {
        res.json(error)
    }


}






export const filterDream = async (req, res) => {


    try {


        const { filter } = req.query

        const journals = filter
            ? await Dream.find({ category: filter })
            : await Dream.find();


        res.render('journal.ejs', { journals })


    } catch (error) {
        res.json(error)
    }

}





export const searchDream = async (req, res) => {


    try {

        const { query } = req.query


        const searchRegex = new RegExp(query, 'i');

        const journals = query
            ? await Dream.find({ $or: [{ title: searchRegex }, { content: searchRegex }] })
            : await Dream.find();

        res.render("journal.ejs", { journals });

    } catch (error) {
        res.json(error)
    }
}