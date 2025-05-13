import Dream from '../models/Dream.js'
import axios from 'axios'
import fs from 'node:fs'
import FormData from 'form-data'
import { v2 as cloudinary } from 'cloudinary'






export const addDream = async (req, res) => {

    const userId = req.session.userId


    const { title, content } = req.body

    const prompt = `Bu rüyanın sembolik ve psikolojik analizini yap, cevap olarak sadece rüya analizini dön herhangi bir soru sorma, girdi olarak verilen rüya anlamsızsa, random harflerden ya da sayılardan oluşuyorsa cevap olarak 'Analiz Yapılamadı' cevabını dön, cevapta alt başlıklar olmasın sadece paragraf yaz : ${content}`

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



        if (analysis.trim() === 'Analiz Yapılamadı') {
            res.render("error.ejs")
        }

        else {



            const promptCat = `Bu analizin aşağıdaki kategorilerden hangisine ait olduğunu belirt ve cevap olarak sadece bu seçeneklerden birini dön, açıklama yazma: Korku, İlişki, İş, Aile, Geçmiş, Gelecek, Diğer. : ${content}`


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
        }

    } catch (error) {
        console.error(error.message)
    }


}



export const generateImage = async (req, res) => {


    try {

        const { id } = req.params

        const dream = await Dream.findById(id)



        const translatePrompt = `Bu metini ingilizceye çevir, cevap olarak sadece çeviriyi dön açıklama yapma: ${dream.content}`


        const translate = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: translatePrompt }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )


        const content = translate.data.candidates[0].content.parts[0].text



        const key = process.env.STABILITY_API_KEY


        const prompt = `"Imagine a surreal and dreamlike scene based on the following description: {dream}. The landscape should be vivid, atmospheric, and filled with whimsical details, blending the boundaries between reality and imagination. The scene should have a soft, ethereal glow and convey a sense of wonder and mystery.": ${content}`

        const formData = new FormData()

        formData.append('prompt', prompt)
        formData.append('output_format', 'webp')


        const endpointcore = `https://api.stability.ai/v2beta/stable-image/generate/core`

        const endpointsd3 = `https://api.stability.ai/v2beta/stable-image/generate/sd3`


        const response = await axios.postForm(
            endpointcore
            ,
            formData,
            {
                validateStatus: undefined,
                responseType: 'arraybuffer',
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${key}`,
                    Accept: "image/*"
                },
            },
        )



        if (response.status === 200) {
            // fs.writeFileSync(`./${dream.title}.webp`, Buffer.from(response.data))


            const imageBuffer = Buffer.from(response.data);


            cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return;
                }


                dream.url += result.secure_url
                await dream.save()


                res.render('image.ejs', { dream })



            }).end(imageBuffer);



        }

        else {
            throw new Error(`${response.status}: ${response.data.toString()}`)
        }


    } catch (error) {
        res.json(error)
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


export const deleteDream = async (req, res) => {

    const { id } = req.params

    await Dream.findByIdAndDelete(id)

    res.redirect("/dream")

}



export const getStoryPage = async (req, res) => {

    try {

        const { id } = req.params

        const dream = await Dream.findById(id)




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


        const journals = await Dream.find({ user: id }).sort({ createdAd: -1 })


        res.render('journal.ejs', { journals })

    } catch (error) {
        res.json(error)
    }


}






export const filterDream = async (req, res) => {
    try {
        const { filter, query } = req.query;
        const userId = req.session.userId;

        let queryObj = { user: userId };

        // Kategori filtresi ekleme
        if (filter && filter !== '') {
            queryObj.category = filter;
        }

        // Arama filtresi ekleme
        if (query && query !== '') {
            const searchRegex = new RegExp(query, 'i');
            queryObj = {
                ...queryObj,
                $or: [{ title: searchRegex }, { content: searchRegex }]
            };
        }

        // Filtreleme ve aramaya göre sonuçları getir
        const journals = await Dream.find(queryObj).sort({ createdAt: -1 });

        res.render('journal.ejs', { journals });
    } catch (error) {
        console.error(error);
        res.json(error);
    }
}