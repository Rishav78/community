exports.serveCommunitylistPage = (req, res, next) => {
    return res.render('CommunityList',{
        data: req.user
    });
}