function serveProfilePage(req, res) {
    return res.render('profile',{
        data : req.user,
        visible : false,
    });
}

module.exports = {
    serveProfilePage,
}