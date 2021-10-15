var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
   console.log("in menu router req.session.allowedUser is")
   console.log(req.session.allowedUser)
    res.render('menu', { showAdminOptions: req.session.enableAdminSiteOptions })
  });

  router.post('/', function(req, res, next) {
    console.log("in menu router req.session.allowedUser is")
   console.log(req.session.allowedUser)
   req.session.save(function(err) {
    // session saved
  })
    res.render('menu', { showAdminOptions: req.session.enableAdminSiteOptions })
  });
module.exports = router;