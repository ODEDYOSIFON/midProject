const e = require('express');
var express = require('express');
const { render, response } = require('../app');
var router = express.Router();
const moviesBL = require('../Models/moviesBL');
const userBL = require('../Models/userBL');
//#region data orchestration functions
let getAllMoviesFromBL = async function () {

  let mainMovies = await moviesBL.getAllmovies();
  return Promise.all(mainMovies.map(movie => getrelatedmovies(movie)))

}
let getFilterdMoviesFromBL = async function (movieFilter) {
  console.log("getFilterdMoviesFromBL ")

  let mainMovies = await moviesBL.getFilterdMovies(movieFilter);
  console.log("mainMovies " + (mainMovies))
  return Promise.all(mainMovies.map(movie => getrelatedmovies(movie)))

}


let getMovieWithRelatedMovies = async function (movieID) {
  console.log("getMovieWithRelatedMovies")

  let movies = await moviesBL.getAllmovies();
  let movie = movies.find(x => x.id == movieID)
  console.log(movies.length)
  console.log("movieid " + movieID)
  let movieWithRelatedMovies = await getrelatedmovies(movie);
  return movieWithRelatedMovies;
}

let getrelatedmovies = async function (movie) {
  console.log("getrelatedmovies ")
  console.log("movie is")
  console.log(movie)
  //console.log(typeof(movie.genres)!="undefined")

  let relatedMovies = [];
  if (movie.genres) {
    relatedMovies = await moviesBL.getRandomMoviesByGenre(movie.genres[0], movie.id, 5);

  }
  else {
    relatedMovies = await moviesBL.getRandomMovies(movie.id, 5);
  }
  let mainmovie = {};
  mainmovie.movie = movie;

  mainmovie.relatedMovies = relatedMovies;
  // console.log("mainmovie is")
  // console.log(mainmovie)
  return Promise.resolve(mainmovie)
}


function buildArrayOfmoviesAndRelatedMovies() {

  let x = getAllMoviesFromBL().then(data => {

    let mvs = data.map(function (dataitem) {
      let movie = {};
      movie.id = dataitem.movie.id;
      movie.name = dataitem.movie.name;

      movie.relatedMovies = dataitem.relatedMovies.map(function (x) {
        let relmovie = {};
        relmovie.id = x.id;
        relmovie.name = x.name;
        return relmovie;
      });
      if (dataitem.movie.image) {
        movie.originalImage = dataitem.movie.image.original;
        movie.mediumImage = dataitem.movie.image.medium;
        if (((dataitem.movie.image.medium === undefined) || (dataitem.movie.image.medium === null)) && ((dataitem.movie.image.original === undefined) || (dataitem.movie.image.original === null))) {
          movie.hideImage = true;
        }
        else {
          if ((dataitem.movie.image.medium === undefined) || (dataitem.movie.image.medium === null)) {
            dataitem.movie.image.medium = movie.originalImage;
          }
          if ((dataitem.movie.image.originalImage === undefined) || (dataitem.movie.image.originalImage === null)) {
            dataitem.movie.image.originalImage = movie.medium;
          }



          movie.hideImage = false;
        }
      }
      else {
        movie.hideImage = true;
      }

      return movie;
    })
    // console.log(mvs[0]);
    // console.log(mvs[0].relatedMovies[0].id);
    return mvs;
  })

  return Promise.resolve(x);
}

//#endregion

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.render('searchmovies');
  res.redirect('/movies/search');

});
router.get('/search', async function (req, res, next) {

  let userAllowedResp = await userBL.CheckIfUserAllowed(req.session.allowedUser);
  if (userAllowedResp.allowed == false) {
    req.session.userAllowedResp = userAllowedResp;
    res.redirect('/login');
  }
  else {
    res.render('searchmovies');
  }
});


router.get('/view', async function (req, res, next) {
  let userIsAllowd = await checkIfUserAllowed(req);
  if (userIsAllowd) {
    buildArrayOfmoviesAndRelatedMovies().then(movies => { res.render('movies', { movies: movies }) })
  }
  else {
    res.redirect('/login');
  }


  // console.log('movies '+ movies);
  // res.render('movies', { movies: movies });

});
router.get('/view/:id', async function (req, res, next) {
  let userIsAllowd = await checkIfUserAllowed(req);
  if (userIsAllowd) {
    let id = req.params.id;
    console.log("viewByID ,id= " + id)
    if (id < 0) {
      res.render('movienotfound')
    }
    getMovieWithRelatedMovies(id).then(data => { res.render('movie', { movie: data.movie, relatedMovies: data.relatedMovies }) })
  }
  else {
    res.redirect('/login');
  }
});
router.get('/view/filterd', async function (req, res, next) {
  let userIsAllowd = await checkIfUserAllowed(req);
  if (userIsAllowd) {
    let id = req.params.id;

    if (id < 0) {
      res.render('movienotfound')
    }
    getMovieWithRelatedMovies(id).then(data => { res.render('movie', { movie: data.movie, relatedMovies: data.relatedMovies }) })
  }
  else {
    res.redirect('/login');
  }
});
async function decreaseUserNumOFTransactions(req) {
  let user = req.session.allowedUser
  if (user.role != 'Admin') {
    let tmpSession = req.session;
    console.log("tmpSession")
    console.log(tmpSession)
    let user = await userBL.decreaseNumOFTransactions(req.session.allowedUser)//update the user in the session
    req.session = tmpSession;
    req.session.allowedUser = user;
  }

}
router.post('/searchresult', async function (req, res, next) {

  let userIsAllowd = await checkIfUserAllowed(req);

  if (!userIsAllowd) {
    req.session.userAllowedResp = userAllowedResp;
    res.redirect('/login');
  }
  else {

    await decreaseUserNumOFTransactions(req);

  }

  let noFilterRequierd = true;
  let movSearchObj = {};
  if ((req.body.id != '') && (typeof (req.body.id) != "undefined")) {
    movSearchObj.id = req.body.id;
    noFilterRequierd = false;
  }
  if ((req.body.moviename != '') && (typeof (req.body.moviename) != "undefined")) {
    movSearchObj.name = req.body.moviename;
    noFilterRequierd = false;
  }
  if ((req.body.Genre != '') && (typeof (req.body.Genre) != "undefined")) {
    movSearchObj.genres = req.body.Genre;
    noFilterRequierd = false;
  }
  if ((req.body.Language != '') && (typeof (req.body.Language) != "undefined")) {
    movSearchObj.language = req.body.Language;
    noFilterRequierd = false;
  }

  if (noFilterRequierd) {

    buildArrayOfmoviesAndRelatedMovies().then(movies => { res.render('movies', { movies: movies }) })
  }
  else {
    //  console.log(("FilterRequierd"))
    getFilterdMoviesFromBL(movSearchObj).then(fmovies => {

      if (fmovies.length == 0) {
        res.redirect('/movies/view/-1')
      }

      else {
        let m = fmovies.map(fm => {

          let x = {};
          x.id = fm.movie.id;
          x.name = fm.movie.name;
          x.language = fm.movie.language;
          x.genres = fm.movie.genres;

          x.relatedMovies = fm.relatedMovies;
          x.mediumImage = fm.movie.image.medium;
          x.originalImage = fm.movie.image.original;

          return x;
        });

        res.render('movies', { movies: m })
      }
    })

  }
});
async function checkIfUserAllowed(req) {
  let userAllowedResp = await userBL.CheckIfUserAllowed(req.session.allowedUser);
  req.session.userAllowedResp = userAllowedResp;
  if (userAllowedResp.allowed == false) {
    return false;
  }
  else {
    return true;
  }

}
router.get('/create', async function (req, res, next) {
  
  let userIsAllowd = await checkIfUserAllowed(req);
  if (userIsAllowd) {
    res.render('createmovies', { msg: "" });
  }
  else {
    res.redirect('/login');
  }
});


router.post('/create/save', async function (req, res, next) {

 
  let movObj = {};
  if (req.body.moviename != '') {
    movObj.name = req.body.moviename;
  }
  if (typeof (movObj.name) == 'undefined') {
    res.render('createmovies', { msg: "movie\\'s name cannot be empty" })
  }
  if (req.body.Genre != '') {
    movObj.genres = req.body.Genre;
  }
  if (req.body.Language != '') {
    movObj.language = req.body.Language;
  }
  let message = '';
  let opResault = await moviesBL.addMovie(movObj)
  message = opResault.message;
  if (opResault.success) {
    await decreaseUserNumOFTransactions(req);
  }
  
    res.render('createmovies', { msg: message });
   
});


module.exports = router;

//getMovieWithRelatedMovies(1).then(x=>// console.log(x));
//
