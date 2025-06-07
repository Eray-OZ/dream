🌙 Rüya Günlüğü

Rüya Günlüğü, kullanıcıların gördükleri rüyaları kaydedebilecekleri, yapay zeka destekli analiz ve görselleştirme hizmeti sunan bir web uygulamasıdır. 
Bu proje, Yazılım Mühendisliği dersi final projesi olarak geliştirilmiştir.
✨ Özellikler

    Kullanıcılar rüyalarını sisteme metin olarak girebilir.

    Gemini API kullanılarak:

        Rüya yorumları otomatik olarak oluşturulur.

        Rüyaya özel kısa bir hikaye yazılır.

    Stability AI ile rüyaya uygun bir görsel otomatik olarak üretilir.

    Oluşturulan görseller Cloudinary'ye yüklenir ve orada barındırılır.

    Tüm veriler (rüyalar, yorumlar, hikayeler, görsel URL’leri) MongoDB veritabanında saklanır.

    Arayüzler EJS (Embedded JavaScript Templates) kullanılarak sunulmaktadır.

🛠️ Kullanılan Teknolojiler

    Backend: Node.js, Express.js

    Frontend (Arayüz): EJS (Şablon motoru)

    Veritabanı: MongoDB + Mongoose

    Oturum Yönetimi: express-session

    Dosya Yükleme: express-fileupload (Cloudinary’e görsel yüklemek için)

    Yapay Zeka API'leri:

        Gemini API (Google AI)

        Stability AI

    Görsel Depolama: Cloudinary
