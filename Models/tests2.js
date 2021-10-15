const list = [1, 2, 3, 4, 5] //...an array filled with values

const functionThatReturnsAPromise = item => { //a function that returns a promise
  return Promise.resolve('ok')
}

const doSomethingAsync = async item => {
  return functionThatReturnsAPromise(item)
}

const getData = async () => {
  return Promise.all(list.map(item => doSomethingAsync(item)))
}

getData().then(data => {
  console.log(data)
})

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