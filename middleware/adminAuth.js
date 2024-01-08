



module.exports.islogin = (req, res, next) => {

    try {
        if(req.session.admin) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        
    }
}

module.exports.logged = (req, res) => {
    try {

        if(!req.session.admin) {
           next();
        } else {
            res.redirect('/admin/home');
        }
        
    } catch (error) {
        console.log(error)
    }
}