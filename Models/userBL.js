const jsonDAL = require('../DALS/jsonDAL');
const Utils = require('./Utils');
exports.getUser = async function (userid) {
    let resault = await jsonDAL.getUser(userid);
    return resault;
}
exports.getUsers = async function () {
    let resault = await jsonDAL.getUsers();
    return resault;
}
exports.addUser = async function (userObj) {
    let resault = await jsonDAL.addUser(userObj);
    return resault;
}


exports.decreaseNumOFTransactions = function (user) {
    return new Promise(async (resolve) => {
        user.numOfTransactions = user.numOfTransactions - 1;
        await this.updateUser(user);// when user login in a new day
        resolve(user);//user 
    });



}
exports.setUserLastLoginDateAndNumOFTransactionsUponLogin = async function (user) {
    let datestring = Utils.getCurrentDateString();

    if ((user.lastLoginDate == "") || (user.lastLoginDate != datestring)) {
        user.lastLoginDate = datestring;
        user.numOfTransactions = user.numOfTransactions < 5 ? 5 : user.numOfTransactions;
        await this.updateUser(user);// when user login in a new day

    }
    await jsonDAL.updateUser(user);
}
exports.updateUser = async function (userObj) {
    let resault = await jsonDAL.updateUser(userObj);
    return resault;
}
exports.deleteUser = async function (userObj) {
    let resault = await jsonDAL.deleteUser(userObj);
    return resault;
}
exports.CheckIfUserAllowed = async function (userObj) {
    console.log('CheckIfUserAllowed');
    console.log('userObj');
    console.log(userObj)

    let userAllowedResp = {};
    let resault = await jsonDAL.getUsers();
    let data = resault.data;
    let currentAlloweduser = data.users.find(o => ((o.username == userObj.username) && (o.password == userObj.password)))
    console.log("currentAlloweduser");
    console.log(currentAlloweduser)
    if (currentAlloweduser === undefined) {
        userAllowedResp.allowed = false;
        userAllowedResp.reason = "incorrect username or password"
        userAllowedResp.user = currentAlloweduser;
        console.log("userAllowedResp")
        console.log(userAllowedResp)
        return (userAllowedResp);
    }
    else {

        if (currentAlloweduser.numOfTransactions == 0) {
            let datestring = Utils.getCurrentDateString();

            if ((currentAlloweduser.lastLoginDate == datestring)) {
                console.log("CheckIfUserAllowed 55")
                userAllowedResp.allowed = false;
                userAllowedResp.reason = "numOfTransactions ended"
                userAllowedResp.user = currentAlloweduser;
                console.log("userAllowedResp")
                console.log(userAllowedResp)
                return (userAllowedResp);
            }
           

        }
        userAllowedResp.allowed = true;
        userAllowedResp.reason = ''
        userAllowedResp.user = currentAlloweduser
        console.log("userAllowedResp")
        console.log(userAllowedResp)

        return (userAllowedResp);
    }




    //

    //
}