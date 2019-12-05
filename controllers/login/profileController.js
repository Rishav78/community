exports.serveProfilePage = (req, res) => {
    return res.render('profile',{
        data : req.user,
        visible : true
    });
}