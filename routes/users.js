var express = require('express');
var router = express.Router();
const userBL = require('../Models/userBL');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/usersmanagement', async function (req, res, next) {

  if (req.session.enableAdminSiteOptions ) {
    let opResault = await userBL.getUsers();
    let opfailedres='';
    if (opResault.success) {
      if (req.session.OpeartionFailedReson) {
       
         opfailedres=req.session.OpeartionFailedReson;
        
         req.session.removeItem('OpeartionFailedReson');
  
      }
      res.render('usersmanagement', { users: opResault.data.users, message: '',opfailed:opfailedres });
    }
    else {
      res.render('usersmanagement', { users: {}, message: opResault.failReason });
    }
  }
  else {
    console.log("session is being cleared")
    req.session=null;
    res.redirect('/login');
  }

});
router.post('/usercreated', async function (req, res, next) {
  console.log("usercreated")
  let userObj={};
  userObj.username=req.body.username;
  userObj.password=req.body.userpassword;
  userObj.numOfTransactions=req.body.usertransactions;
  userObj.role=req.body.userrole;

  var currDate = new Date();
   
  var currDateString = ('0' + currDate.getDate()).slice(-2) + '/'
               + ('0' + (currDate.getMonth()+1)).slice(-2) + '/'
               + currDate.getFullYear();
   
 
  userObj.createDate=currDateString;
  userObj.lastLoginDate="";
  let userCreateRes=await userBL.addUser(userObj);
  console.log("userCreateRes")
  console.log( userCreateRes)
  if (userCreateRes.success) {
    res.render('createuser',{user:userObj,msg:userCreateRes.message});//in case the user will want to add another user
  }
  else {
 
   res.render('createuser',{user:userObj,msg:userCreateRes.message});//in case that adding  user failed
    
    
 }
 
 });
router.post('/userupdated', async function (req, res, next) {
  
 let userObj={id:req.body.userid};
 let opResault = await userBL.getUser(parseInt( userObj.id));
 console.log("opResault");
 console.log(opResault)
 if (!opResault.success) {
  res.render('updateuser',{user:userObj,msg:opResault.message});
 }
 userObj=opResault.data;
 userObj.username=req.body.username;
 userObj.password=req.body.userpassword;
 userObj.numOfTransactions=req.body.usertransactions;
 userObj.role=req.body.userrole;

 let userUpdateRes=await userBL.updateUser(userObj);

 if (userUpdateRes.success) {
   res.render('updateuser',{user:userObj,msg:userUpdateRes.message});
 }
 else {

  res.render('updateuser',{user:userObj,msg:userUpdateRes.message});
   
   res.redirect('/users/usersmanagement');
}

});
router.get('/usersdata/',  function (req, res, next) {
  res.render('createuser',{msg:""});
})
router.get('/usersdata/:id', async function (req, res, next) {
  
  let opResault = await userBL.getUser(req.params.id)
  console.log(opResault)
  console.log("opResault")
  if (!opResault.success) {

    res.redirect('/users/usersmanagement');
  }
  else {
    let updatedUser=opResault.data;
    res.render('updateuser',{user:updatedUser,msg:opResault.message});//the user will review the data he enterd
}
});

router.get('/deleteuser/:id', async function (req, res, next) {
  let opResault = await userBL.deleteUser(req.params.id)
  if (opResault.success) {
    res.redirect('/users/usersmanagement');
  }
  else {
    req.session.OpeartionFailedReson=opResault.failReason
    res.redirect('/users/usersmanagement');
  }



});
module.exports = router;
