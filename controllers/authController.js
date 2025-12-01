const authService = require('../services/authService');

exports.authHr = async (req, res) => {
    try {
        const bool = await authService.authHr(parseInt(req.body.userid, 10),req.body.password);
        console.log('result'+bool[0]);
        if(bool[0].success){
            console.log('logged in');
            req.session.user = {
            id: req.body.userid,  
            role: 'admin'
            };
            req.session.isLoggedIn = true;
        }
        else{
            req.session.isLoggedIn = false;
            console.log('invalid');
        }
        res.status(200).json(bool);
    } catch (err) {
        console.error("Error in authController authHr", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.authAdmin = async (req, res) => {
   const result = authService.authAdmin(req.body.userid,req.body.password);
   if(result){
    req.session.user = {
        id: req.body.userid,
        role: 'admin'
    };
    req.session.isLoggedIn = true;
   }
   else{
    req.session.isLoggedIn = false;
   }
   res.status(200).json(result);
};
exports.authAcademic = async (req, res) => {
    try {
        const bool = await authService.authAcademic(parseInt(req.body.userid, 10),req.body.password);
        console.log('result'+bool[0]);
        if(bool[0].success){
            console.log('logged in');
            req.session.user = {
            id: req.body.userid,  
            role: 'academic'
            };
            req.session.isLoggedIn = true;
        }
        else{
            req.session.isLoggedIn = false;
        }
        console.log('invalid');
        res.status(200).json(bool);
    } catch (err) {
        console.error("Error in authController authHr", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};