exports.getCurrentDateString= function(){
    var currDate = new Date();

    var currDateString = ('0' + currDate.getDate()).slice(-2) + '/'
        + ('0' + (currDate.getMonth() + 1)).slice(-2) + '/'
        + currDate.getFullYear();
        return  currDateString;
}