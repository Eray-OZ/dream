


export const isAuthenticated = async (req, res, next) => {
    if (req.session.user) {
        next(); // Giriş yapmış, devam etsin
    } else {
        res.redirect('/login'); // Giriş yapmamış, login sayfasına yolla
    }
}