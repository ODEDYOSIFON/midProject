var express = require('express');
var router = express.Router();
const userBL = require('../Models/userBL')
/* GET home page. */
router.get('/', async function (req, res, next) {
  // when being redirected to here - we need to check if it because "logout" or because user regection
  if (req.session.userAllowedResp) {
    let userAllowedResp = req.session.userAllowedResp;
    if (userAllowedResp.allowed == false) {
      console.log("login userAllowedResp");
      console.log(userAllowedResp)
      //  res.render('login'  )
      req.session=null;
      res.render('login', { title: 'Login', errmsg: userAllowedResp.reason, hideErr:false });
     
    }

  }
  else {
  //  console.log("logout")
    let errorMsg = ''; //if from "logout" then ew need to save user data befor logoute
    if (req.session.allowedUser) {
      let user = req.session.allowedUser;
      await userBL.updateUser(user)
    }
    // req.session = null;//clearing the session (in case that we logged out)
    res.render('login', { title: 'Login', errmsg: errorMsg, hideErr: (errorMsg == '') });
  }
});


router.post('/', async function (req, res, next) {
  let loginUsr = {};
  loginUsr.username = req.body.username;
  loginUsr.password = req.body.password;

  console.log("calling to CheckIfUserAllowed from login router")
  let userAllowedResp = await userBL.CheckIfUserAllowed(loginUsr);
  console.log("userAllowedResp")
  console.log(userAllowedResp)
  if (userAllowedResp.allowed == true) {
    console.log("awaiting userBL.setUserLastLoginDateAndNumOFTransactionsUponLogin")
    await userBL.setUserLastLoginDateAndNumOFTransactionsUponLogin(userAllowedResp.user)



    req.session.allowedUser = userAllowedResp.user;
    console.log("req.session.allowedUser set to : ")
    console.log(req.session.allowedUser)
    req.session.enableAdminSiteOptions = userAllowedResp.user.role == "Admin" ? true : false;


    res.redirect('/menu');
  }
  else {
    let errorMsg = userAllowedResp.reason;
   // req.session = null;//clearing the session (in case that we logged out)
    res.render('login', { title: 'Login', errmsg: errorMsg, hideErr: (errorMsg == '') });
  }


});
module.exports = router;
