const jFile = require('jsonfile');
const fs = require('fs');
//#region helper functions
const fileExists = (file) => {
    return new Promise((resolve) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        });
    })
}
const createFileWhenNotExist = async function (fileFullPath, filedata) {
    return new Promise(async (resolve, reject) => {
        let createFileRes = { success: true, failReason: '' };
        if (! await fileExists(fileFullPath)) {
            jFile.writeFile(fileFullPath, filedata, function (err) {
                if (err) {
                    createFileRes.success = false;
                    createFileRes.failReason = err;

                    reject(createFileRes)

                }


            })

        }
        resolve(createFileRes);

    })

}
const saveFile = function (fileFullPath, jsonarr) {
    let fileSaveRes = {
        success: true,
        failReason: ""
    };

    return new Promise(async (resolve, reject) => {

        jFile.writeFile(fileFullPath, jsonarr, function (err) {
            if (err) {
                //  console.log(err);
                fileSaveRes.success = false;
                fileSaveRes.failReason = err;
                reject(fileSaveRes);
            }
            else {
                resolve(fileSaveRes);
            }
        })
    })

}
//#endregion

//#region users
const saveUsersFile = async function (usersColllection) {
    let fileFullPath = __dirname + "/datafiles/Users.json";
    let savefileres = await saveFile(fileFullPath, usersColllection);
    return savefileres;
}
const getUser = function (userid) {
    return new Promise(async (resolve, reject) => {
        let opResault = { success: true, message: '', data: null }

        let getUsersRes = await getUsers();
        console.log("getUsersRes");
        console.log(getUsersRes);
        if (!getUsersRes.success) {
            opResault.success = false;
            opResault.message = `User ${userid} could not be fetched due  to: ${getUsersRes.failReason}`;
            opResault.data = null;
            reject(opResault);
        }
        else {
            let Usersx = getUsersRes.data;

            let user = Usersx.users.find(usr => usr.id == userid);

            if (!user) {
                opResault.success = false;
                opResault.message = `User ${userid} could not be fetched`;
                opResault.data = user;
                resolve(opResault);
            }
            else {
                opResault.success = true;
                opResault.message = "";
                opResault.data = user;
                resolve(opResault);
            }
        }
    })
}
const updateUser = function (UserObj) {
    return new Promise(async (resolve, reject) => {
        let opResault = { success: true, message: `User ${UserObj.id} Updated` }

        let getUsersRes = await getUsers();
        if (!getUsersRes.success) {
            opResault.success = false;
            opResault.message = `User ${UserObj.id} Was not Updated due to: ${getUsersRes.failReason}`;
            reject(opResault);
        }
        let Usersx = getUsersRes.data;
        let itmIndex = Usersx.users.findIndex(usr => usr.id == UserObj.id)
        if (itmIndex < 0) {
            opResault.success = false;
            opResault.message = `User ${UserObj.id} Was not found`;
            reject(opResault);
        }
        Usersx.users.splice(itmIndex, 1, UserObj)//"replace" the current user with the updated one"
        let saveUsersResault = await saveUsersFile(Usersx);
        if (saveUsersResault.success) {
            opResault.data = Usersx.users[itmIndex];
            resolve(opResault);

        }
        else {
            opResault.success = false;
            opResault.message = `User ${UserObj.id} Was not Updated due to: ${saveUsersResault.failReason}`;
            reject(opResault);
        }



    })



}

const deleteUser = function (userid) {
    return new Promise(async (resolve, reject) => {
        let opResault = { success: true, message: `User ${userid} removed` }
        let getUsersRes = await getUsers();
        if (!getUsersRes.success) {
            opResault.success = false;
            opResault.message = `User ${userid} Was not deleted due to: ${getUsersRes.failReason}`;
            reject(opResault);
        }
        let Usersx = getUsersRes.data;
        let itmIndex = Usersx.users.findIndex(usr => usr.id == userid)
        if (itmIndex < 0) {
            opResault.success = false;
            opResault.message = `User ${userid} Was not found`;
            reject(opResault);
        }
        Usersx.users.splice(itmIndex, 1)//"remove" the current user from array"
        let saveUsersResault = await saveUsersFile(Usersx);
        if (saveUsersResault.success) {
            resolve(opResault);

        }
        else {
            opResault.success = false;
            opResault.message = `User ${UserObj.id} Was not removed due to: ${saveUsersResault.failReason}`;
            reject(opResault);
        }



    })



}


const addUser = function (UserObj) {
    return new Promise(async (resolve, reject) => {
        let opResault = {}
        //get Users (with the "Users" key)
        let getUsersRes = await getUsers();
        if (!getUsersRes.success) {
            opResault.success = false;
            opResault.message = getUsersRes.failReason;
            reject(opResault);
        }
        let Usersx = getUsersRes.data;
        let itmIndex = Usersx.users.findIndex(usr => usr.id == UserObj.id)
        if (itmIndex >= 0) {
            opResault.success = false;
            opResault.message = `User ${UserObj.id} already exists`;
            reject(opResault);
        }
        if (Usersx.users.length > 1) {
            let last_user = Usersx.users[Usersx.users.length - 1];
            UserObj.id = last_user.id + 1;
        }
        else {
            UserObj.id = 1;
        }


        //add user to  Usersx.Users
        Usersx.users.push(UserObj);

        let saveUsersResault = await saveUsersFile(Usersx);
        if (saveUsersResault.success) {
            opResault.success = true;
            opResault.message = `User ${UserObj.id}  created`;
            resolve(opResault);

        }
        else {
            opResault.success = false;
            opResault.message = `could not create a user due to: ${saveUsersResault.failReason}`;
            reject(opResault);
        }

    })

}


const getUsers = async function () {
    return new Promise(async (resolve, reject) => {
        let fileFullPath = __dirname + "/datafiles/Users.json";
        let res = await createFileWhenNotExist(fileFullPath, { users: [] });
        if (!res.success) { //fail upon creating new file
            reject(res)

        }
        jFile.readFile(fileFullPath, (err, data) => {
            if (err) {
                res.success = false;
                res.failReason = err;
                res.data = null;
                reject(res);
            }
            else {
                res.data = data;
                resolve(res);
            }
        })
    })

}



//#endregion

//#region movies
const saveMoviesFile = async function (moviesColllection) {
    let fileFullPath = __dirname + "/datafiles/NewMovies.json";
    let savefileres = await saveFile(fileFullPath, moviesColllection);
    return savefileres;
}

const updateMovie = function (movieObj) {
    return new Promise(async (resolve, reject) => {
        let opResault = { success: true, message: `Movie ${movieObj.name} Updated` }

        let getMoviesRes = await getMovies();
        if (!getMoviesRes.success) {
            opResault.success = false;
            opResault.message = `Movie ${movieObj.id} Was not Updated due to: ${getMoviesRes.failReason}`;
            reject(opResault);
        }
        let moviesColllection = getMoviesRes.data;
        let itmIndex = moviesColllection.movies.findIndex(mov => mov.id == movieObj.id)
        if (itmIndex < 0) {
            opResault.success = false;
            opResault.message = `Movie ${movieObj.id} Was not found`;
            reject(opResault);
        }
        let movIndex = moviesColllection.movies.findIndex(mov => mov.name == movieObj.name)
        if (movIndex != itmIndex) {
            opResault.success = false;
            opResault.message = `cannot update movie ,another movie has the same name: ${movieObj.name}`;
            reject(opResault);
        }
        moviesColllection.movies.splice(itmIndex, 1, movieObj)//"replace" the current Movie with the updated one"
        let saveMoviesResault = await saveMoviesFile(moviesColllection);
        if (saveMoviesResault.success) {
            resolve(opResault);

        }
        else {
            opResault.success = false;
            opResault.message = `Movie ${movieObj.id} Was not Updated due to: ${saveMoviesResault.failReason}`;
            reject(opResault);
        }



    })



}

const deleteMovie = function (movieId) {
    return new Promise(async (resolve, reject) => {
        let opResault = { success: true, message: `Movie ${movieId} removed` }
        let getMoviesRes = await getMovies();
        if (!getMoviesRes.success) {
            opResault.success = false;
            opResault.message = `Movie ${movieId} Was not deleted due to: ${getMoviesRes.failReason}`;
            reject(opResault);
        }
        let moviesColllection = getMoviesRes.data;
        let itmIndex = moviesColllection.movies.findIndex(usr => usr.id == movieId)
        if (itmIndex < 0) {
            opResault.success = false;
            opResault.message = `Movie ${movieId} Was not found`;
            reject(opResault);
        }
        moviesColllection.movies.splice(itmIndex, 1)//"remove" the current Movie from array"
        let saveMoviesResault = await saveMoviesFile(moviesColllection);
        if (saveMoviesResault.success) {
            resolve(opResault);

        }
        else {
            opResault.success = false;
            opResault.message = `Movie ${movieId} Was not removed due to: ${saveMoviesResault.failReason}`;
            reject(opResault);
        }



    })



}


const addMovie = function (movieObj) {
    return new Promise(async (resolve, reject) => {
        let opResault = {}
        //get Movies (with the "Movies" key)
        let getMoviesRes = await getMovies();
        if (!getMoviesRes.success) {
            opResault.success = false;
            opResault.message = getMoviesRes.failReason;
            reject(pResault);
        }
        else {// got movies...
            let moviesColllection = getMoviesRes.data;
            let itmIndex = moviesColllection.movies.findIndex(mov => mov.id == movieObj.id)
            if (itmIndex >= 0) {
                opResault.success = false;
                opResault.message = `Movie ${movieObj.id} already exists`;
                reject(opResault);
            }
            else {//movie is a new movie
                let movIndex = moviesColllection.movies.findIndex(mov => mov.name == movieObj.name)
                if (movIndex != itmIndex) {
                    opResault.success = false;
                    opResault.message = `cannot add movie ,another movie has the same name: ${movieObj.name}`;
                    reject(opResault);
                }
                else {//new movie has new name


                    if (moviesColllection.movies.length > 1) {//not the first movie
                        let last_Movie = moviesColllection.movies[moviesColllection.movies.length - 1];
                        movieObj.id = last_Movie.id + 1;
                    }
                    else {//first movie
                        movieObj.id = 1;
                    }
                    //add Movie to  moviesColllection.movies
                    moviesColllection.movies.push(movieObj);

                    let saveMoviesResault = await saveMoviesFile(moviesColllection);
                    if (saveMoviesResault.success) {
                        opResault.success = true;
                        opResault.message = `Movie [ ${movieObj.name}] Was  created`;
                        resolve(opResault);

                    }
                    else {
                        opResault.success = false;
                        opResault.message = `could not create a Movie due to: ${saveMoviesResault.failReason}`;
                        reject(opResault);
                    }
                }
            }

        }
    });



}




const getMovies = async function () {
    return new Promise(async (resolve, reject) => {
        let fileFullPath = __dirname + "/datafiles/NewMovies.json";
        let res = await createFileWhenNotExist(fileFullPath, { movies: [] });
        if (!res.success) { //fail upon creating new file
            reject(res)

        }
        jFile.readFile(fileFullPath, (err, data) => {
            if (err) {
                res.success = false;
                res.failReason = err;
                res.data = null;
                reject(res);
            }
            else {
                res.data = data;
                resolve(res);
            }
        })
    })

}


// const addMovie = async function (movieObj) {

//     let fileFullPath = __dirname + "/datafiles/NewMovies.json";

//     //get movies (with the "movie" key)
//     let moviesColllection = await getMovies();

//     //add Movie 
//     moviesColllection.movies.push(movieObj);


//     let savefileres = saveFile(fileFullPath, moviesColllection)
//     return savefileres;


// }

// const getMovies = async function () {
//     let fileFullPath = __dirname + "/datafiles/NewMovies.json";
//     return new Promise(async (resolve, reject) => {
//         if (! await fileExists(fileFullPath)) {
//             jFile.writeFile(fileFullPath, { movies: [] }, function (err) {
//                 if (err) {
//                     console.log(err);
//                     reject(err)

//                 }

//             })

//         }
//         jFile.readFile(fileFullPath, (err, data) => {
//             if (err) {
//                 reject(err);
//             }
//             else {

//                 resolve(data)
//             }
//         })
//     })
// }
//#endregion



module.exports = { getUsers, getUser, addUser, updateUser, deleteUser, saveUsersFile, getMovies, addMovie, updateMovie, deleteMovie, saveMoviesFile }
//  let mov={};
//  mov.name="ddd"
//  addMovie(mov)

// let cc = async function () {
//     let ans = await updateUser(usr);
//     console.log("ans");
//     console.log(ans);
// }
// let usr = {

//     id: 2,
//     username: "CxC", password: "123abc",
//     createDate: "01/01/2020",
//     numOfTransactions: 5,
//     lastLoginDate: "",
//     role: "C"
// }

// cc();
