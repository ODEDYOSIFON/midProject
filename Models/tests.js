
const moviesBL = require('./moviesBL');
var a0 = [1,2,3,4,5,6,7,8];
var a1 = [1,2,3,4,5,6,7,8,9];
var a2 = [];
a1.splice(0, 0,...a2);
//console.log(a1) 



exports.selectRandomMovies =   function (movies, numOfMovies) {

    if (numOfMovies >= movies.length) {
        return movies;
    }
   
    let startindex =  Math.floor(Math.random() * (movies.length - numOfMovies))
    console.log("startindex : "+startindex);
    if ((startindex + numOfMovies) > (movies.length)) {
        startindex = movies.length - numOfMovies;
    }
    let slicedMovies=movies.slice(startindex , startindex+numOfMovies);
    return slicedMovies;
}

let movies=[{"id":1,"name":"a"},{"id":2,"name":"b"},{"id":3,"name":"c"},{"id":4,"name":"d"},{"id":5,"name":"e"},{"id":6,"name":"f"}]
let testFunc= function(){
//let mainMovies= await moviesBL.getAllmovies();

let moviesx= movies.map(movie=>  buildNewMovie(movie).then(x=>x))

console.log(moviesx)
}
let buildNewMovie=  async function(movie){
 //  let d= await moviesBL.getAllmovies();
let relatedMovies=[{"id":11,"name":"a"},{"id":22,"name":"b"},{"id":33,"name":"c"},{"id":34,"name":"d"},{"id":55,"name":"e"},{"id":66,"name":"f"}]
let mainmovie={};
mainmovie.movie=movie;
let i=  parseInt(movie.id) ;
mainmovie.relatedMovies=relatedMovies.slice(0,i);
return  Promise.resolve(mainmovie);
}
let functionThatReturnsAPromise=function(){
    return Promise.resolve('ok');
}
testFunc();
//console.log(a1[Math.floor(Math.random() * a1.length)]) 

//console.log(Object.prototype.toString.call(movies))

//console.log(this.selectRandomMovies(movies,3));