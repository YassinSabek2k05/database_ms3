const { name } = require('ejs');
const authService = require('../services/authService');
const hrService = require('../services/hrService');
const flash = require('connect-flash'); 
const { json } = require('express');
exports.authHr = async (req, res) => {
    try {
        const bool = await authService.authHr(parseInt(req.body.userid, 10),req.body.password);
        if(bool[0].success){
            const data= await hrService.getHrData(parseInt(req.body.userid, 10));
            req.session.user = {
            id: req.body.userid,  
            role: 'hr',
            name: data[0].first_name + ' ' + data[0].last_name,
            data: data[0]
            };
            req.session.isLoggedIn = true;
            req.flash('success', 'Logged in successfully as HR');
            return res.redirect('/hr/hrdashboard');
        }
        else{
            req.session.isLoggedIn = false;
            req.flash('error', 'Invalid credentials');  
            return res.redirect('/'); 
        }
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
        req.flash('success', 'Logged in successfully as Admin');
        return res.redirect('/admin/dashboard1');
   }
   else{
        req.session.isLoggedIn = false;
        req.flash('error', 'Invalid credentials');
        return res.redirect('/');
   }
};
exports.authAcademic = async (req, res) => {
    try {
        const bool = await authService.authAcademic(parseInt(req.body.userid, 10),req.body.password);
        if(bool[0].success){
            console.log('logged in');
            req.session.user = {
            id: req.body.userid,  
            role: 'academic'
            };
            req.session.isLoggedIn = true;
            req.flash('success', 'Logged in successfully as Academic');
            return res.redirect('/academic/academicdashboard');
        }
        else{
            req.session.isLoggedIn = false;
            req.flash('error', 'Invalid credentials');  
            return res.redirect('/');
        }
    } catch (err) {
        console.error("Error in authController authHr", err);
        req.flash('error', 'Login error');
        return res.redirect('/');
    }
};