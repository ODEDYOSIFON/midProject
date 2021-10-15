const restDAL = require('../DALS/restDAL');
const jsonDAL = require('../DALS/jsonDAL');
const { resolveInclude } = require('ejs');
//#region  Helper functions
let getMoviesJson = async function () {

    try {
        let getMoviesRes = await jsonDAL.getMovies();
        let data = getMoviesRes.data;
        if (data.movies) {
            return data.movies;
        }
        else {
            data.movies = [];

            return data.movies;

        }


    }
    catch (error) {
        return null;
    }
}

let getMoviesREST = async function (numOfMovies) {
    let numMovies = 100;
    if (numOfMovies) {
        numMovies = numOfMovies;
    }
    let allmovies = await restDAL.getMovies()
    let movies = allmovies.data.filter(x => x.id <= numMovies);
    let moviesWithLessProperties = movies.map(movie => ({ id: movie.id, name: movie.name, language: movie.language, genres: movie.genres, image: movie.image }));//image "childes" ->medium,original
    // console.log(moviesWithLessProperties);
    return moviesWithLessProperties;
}

let getNextMovieID = async function () {
    let moviesFromJson = await getMoviesJson();

    let currentmovieid = 0;
    if (moviesFromJson && moviesFromJson.length > 0) {
        currentmovieid = parseInt((moviesFromJson[moviesFromJson.length - 1]).id);
    }
    else {
        let moviesFromRest = await getMoviesREST();
        if (moviesFromRest) {
            currentmovieid = parseInt((moviesFromRest[moviesFromRest.length - 1]).id);
        }
    }

    return (parseInt(currentmovieid) + 1);
}

let selectRandomMovies = function (movies, numOfMovies) {

    if (numOfMovies >= movies.length) {
        //  // console.log("movies.length <=numOfMovies " + movies.length);
        return movies;
    }
    let startindex = Math.floor(Math.random() * (movies.length - numOfMovies))
    if ((startindex + numOfMovies) > (movies.length)) {
        startindex = movies.length - numOfMovies;
    }
    let slicedMovies = movies.slice(startindex, startindex + numOfMovies);

    // console.log(slicedMovies);
    // console.log(slicedMovies.length);
    return slicedMovies;
}



/*this function gets 2 objects,"searchCriteriaObj" and "objToSearchIn" and checks the following:
if the two objects are arrays - it will return true if the objects has at least 1 element in common
if only objToSearchIn is an array, it will check if searchCriteriaObj is contained in it;
if both of the objects aren't arrays , it will check if they are equal (case sensitive)
this function assumes that only 1 if the above 3 can be.
*/
function filterHelper(objToSearchIn, searchCriteriaObj) {
    if (objToSearchIn === undefined) {
        return false;
    }
    // console.log("-----------------------------------------------------------------------------")
    // console.log("el[filterEl.type]")
    // console.log(objToSearchIn)
    // console.log("filterEl.name")
    // console.log(searchCriteriaObj)
    // console.log("-----------------------------------------------------------------------------")
    //el[filterEl.type], filterEl.name)
    if (Object.prototype.toString.call(objToSearchIn) === '[object Array]') {
        if (Object.prototype.toString.call(searchCriteriaObj) === '[object Array]') {
            for (let i = 0; i < searchCriteriaObj.length; i++) {
                if (objToSearchIn.indexOf(searchCriteriaObj[i]) > -1) {

                    return true;
                }
            }
            return false;
        }
        else {
            return objToSearchIn.indexOf(searchCriteriaObj) > -1;
        }
    }
    else {
        return objToSearchIn === searchCriteriaObj;
    }

}

//#endregion

//#region movies getters
exports.getAllmovies = async function () {
    let movies = [];

    let moviesFromJson = await getMoviesJson();
    //console.log("moviesFromJson : " + moviesFromJson)
    if (moviesFromJson) {

        movies.splice(0, 0, ...moviesFromJson);
    }

    let moviesFromRest = await getMoviesREST(10);
    //// console.log("moviesFromRest" + moviesFromRest)
    if (moviesFromRest) {
        movies.splice(0, 0, ...moviesFromRest);
    }
    // console.log("movies" + movies)
    return (movies);
}



exports.getFilterdMovies = async function (moviesFilterObj) {
    // console.log("-------------------------------------")
    // console.log("filter obj received in getFilterdMovies :")
    // console.log(moviesFilterObj)
    // console.log("-------------------------------------")
    let filters = [];
    //build the filter array dynamically (no matter how many filter criterias were set)
    for (const property in moviesFilterObj) {
        let filter = {}
        filter.type = property;
        filter.name = moviesFilterObj[property];
        filters.push(filter);
    }
    // console.log(" the following filters built")
    // console.log(filters)
    // console.log("-------------------------------------")
    let movies = await this.getAllmovies();
    //// console.log("movies.length : " + movies.length);
    //const filteredMovies = movies.filter(el => filters.some(filterEl => el[filterEl.type] === filterEl.name));
    const filteredMovies = movies.filter(el => filters.every(filterEl => filterHelper(el[filterEl.type], filterEl.name)));

    // console.log(" filteredMovies to bu returnd")
    // console.log(filteredMovies)
    // console.log("-------------------------------------")

    return filteredMovies;
}

exports.getMovie = async function (id) {
    let moviefilter = {};
    moviefilter.id = id;
    let movie = await this.getFilterdMovies(moviefilter.id);
    return movie;

}

exports.getRandomMoviesByGenre = async function (genreName, movieIDToExclude, numOfMovies) {
    // console.log("getRandomMoviesByGenre");
    // console.log("genreName : " + genreName);
    let moviesFilterObj = {};
    moviesFilterObj.genres = [];
    moviesFilterObj.genres.push(genreName);
    let moviesfilterd = await this.getFilterdMovies(moviesFilterObj);
    // console.log("moviesfilterd.length : " + moviesfilterd.length);
    let movies = moviesfilterd.filter(x => x.id != movieIDToExclude);
    // console.log("moviesNOID.length : " + movies.length);
    let randmovies = selectRandomMovies(movies, numOfMovies);
    // console.log("randmovies.length : " + randmovies.length);
    // console.log(randmovies)
    return randmovies;

}
exports.getRandomMoviesByLanguage = async function (languageName, movieIDToExclude, numOfMovies) {
    // console.log("getRandomMoviesByLanguage");
    let moviesFilterObj = {};
    moviesFilterObj.language = languageName;
    let moviesfilterd = await this.getFilterdMovies(moviesFilterObj);

    let movies = moviesfilterd.filter(x => x.id != movieIDToExclude);
    return selectRandomMovies(movies, numOfMovies);

}
exports.getRandomMovies = async function (movieIDToExclude, numOfMovies) {

    let moviestotal = await this.getAllmovies();
    let movies = moviestotal.filter(x => x.id != movieIDToExclude);
    return selectRandomMovies(movies, numOfMovies);


}

//#endregion
//#region movies CRUD
exports.addMovie = async function (movieObj) {
    let addMovieRes = {};

    if (typeof (movieObj.name) == 'undefined') {

        addMovieRes.success = false;
        addMovieRes.message = "movie\\'s name cannot be empty";
        return (addMovieRes);
    }

    let movs = await this.getFilterdMovies(movieObj);
    if (movs.length > 0) {
        addMovieRes.success = false;
        addMovieRes.message = "movie already exists";
        return (addMovieRes)
    }
    else {
        movieObj.id = await getNextMovieID();
        // console.log("trying to add movie");
        // console.log("calling to jsonDAL.addMovie");
        addMovieRes = await jsonDAL.addMovie(movieObj);
        if (addMovieRes.success) {
            return (addMovieRes);
        }
        else {
            return (addMovieRes)
        }

    }
}

//#endregion

