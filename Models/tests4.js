const moviesBL = require('./moviesBL');

const list = [1, 2, 3, 4, 5] //...an array filled with values

let getAllmoviesFromBL = async function () {
    let mainMovies = await moviesBL.getAllmovies();
    return Promise.all(mainMovies.map(movie => getrelatedmovies(movie)))
}


let getrelatedmovies = async function (movie) {
    let relatedMovies = await moviesBL.getRandomMoviesByGenre("Drama", movie.id, 2);
    let mainmovie = {};
    mainmovie.movie = movie;
   
    mainmovie.relatedMovies = relatedMovies;
   
    return Promise.resolve(mainmovie)
}


 function buildArrayOfmoviesAndRelatedMovies() {
    
   let x= getAllmoviesFromBL().then(data => {
    
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
            }

            return movie;
        })
        // console.log(mvs[0]);
        // console.log(mvs[0].relatedMovies[0].id);
        return mvs;
    })
   
    return Promise.resolve(x);
}

buildArrayOfmoviesAndRelatedMovies().then(x=>console.log(x[0].relatedMovies[1].name))


