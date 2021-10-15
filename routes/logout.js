var express = require('express');
var router = express.Router();
const userBL = require('../Models/userBL')
/* GET home page. */
router.get('/', async function (req, res, next) {
  // when being redirected to here - we need to check if it because "logout" or because user regection
      req.session.userAllowedResp=null;
    res.redirect('/login'  )

});



module.exports = router;
