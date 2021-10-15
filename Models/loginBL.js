const jsonDAL = require('../DALS/jsonDAL');

// loginUsr.username=req.body.username;
// loginUsr.password=req.body.password;
exports.CheckIfUserAllowed = async function (userObj) {
    let userAllowedResp = { allowed: false, reason: '', user: null };
    // console.log("userAllowedResp");
    // console.log(userAllowedResp)
    let resault = await jsonDAL.getUsers();
    let data = resault.data;

    let currentAlloweduser = data.users.find(o => ((o.username == userObj.username) && (o.password == userObj.password)))
    // console.log("currentAlloweduser");
    // console.log(currentAlloweduser)
    if (!currentAlloweduser) {
        userAllowedResp.allowed = false;
        userAllowedResp.reason = "incorrect username or password"
         userAllowedResp.user = userObj


    }
    else {
        userAllowedResp.allowed = true;
        userAllowedResp.reason = ''
        userAllowedResp.user = currentAlloweduser

        var currDate = new Date();
   
        var currDateString = ('0' + currDate.getDate()).slice(-2) + '/'
                     + ('0' + (currDate.getMonth()+1)).slice(-2) + '/'
                     + currDate.getFullYear();
        datestring = currDateString;
        if ((userAllowedResp.user.lastLoginDate = "") || (userAllowedResp.user.lastLoginDate != datestring)) {
            userAllowedResp.user.lastLoginDate = datestring;
            userAllowedResp.user.numOfTransactions = 5;

        }
        else {
            if (userAllowedResp.user.numOfTransactions == 0) {
                userAllowedResp.allowed = false;
                userAllowedResp.reason = "numOfTransactions ended"
              //  userAllowedResp.user = currentAlloweduser
            }
            else {
                userAllowedResp.user.numOfTransactions -= 1;
               await userBL.updateUser(userAllowedResp.user);
            }
        }

        return userAllowedResp;
    }

}