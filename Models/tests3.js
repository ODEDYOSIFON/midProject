const moviesBL = require('./moviesBL');

const list = [1, 2, 3, 4, 5] //...an array filled with values
let movies = [{ "id": 1, "name": "a" }, { "id": 2, "name": "b" }, { "id": 3, "name": "c" }, { "id": 4, "name": "d" }, { "id": 5, "name": "e" }, { "id": 6, "name": "f" }]
let relatedMovies = [{ "id": 11, "name": "a" }, { "id": 22, "name": "b" }, { "id": 33, "name": "c" }, { "id": 34, "name": "d" }, { "id": 55, "name": "e" }, { "id": 66, "name": "f" }]
let getData = async function () {
  return Promise.all(movies.map(movie => doSomethingAsync(movie)))
}

let functionThatReturnsAPromise = async function (movie) {
  return Promise.resolve(movie);
}
let doSomethingAsync = async function (movie) {
  let mainMovies = await moviesBL.getAllmovies();
  let mainmovie = {};
  mainmovie.movie = movie;
  let i = parseInt(movie.id);
  mainmovie.relatedMovies = relatedMovies.slice(0, i);
  //return functionThatReturnsAPromise(mainmovie)
  return Promise.resolve(mainmovie)
}
  getData().then(data => {
   console.log(data[2].relatedMovies)
 })




