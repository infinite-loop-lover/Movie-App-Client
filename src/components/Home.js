import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchBox from './SearchBox';
import AddFavourites from './AddFavourites';
import RemoveFavourites from './RemoveFavourites';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState({
    s: '',
    type: '',
    y: ''
  });

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue.s}&apikey=263d22d8&type=${searchValue.type}&y=${searchValue.y}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
    console.log(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem('react-movie-app-favourites')
    );

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    setSearchValue({
      ...searchValue,
      [e.target.name]: value
    })

  }

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  return (
    <div className='container movie-app'>
      <div className='row d-flex align-items-center mt-4 mb-4 pl-4 pr-4'>
        <MovieListHeading heading='Movies' />
        <div className='row'>
          <div className='col-sm-4'>
            <input
              className='form-control'
              name="s"
              value={searchValue.s}
              onChange={handleChange}
              placeholder='Input Title'
            ></input>
          </div>
          <div className='col-sm-4'>
            <select
              name='type'
              value={searchValue.type}
              onChange={handleChange}
              className='form-control'>
              <option defaultValue={'movie'} value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="episode">Episode</option>
            </select>
          </div>
          <div className='col-sm-4'>
            <input
              className='form-control'
              name="y"
              type="number"
              value={searchValue.y}
              onChange={handleChange}
              placeholder='Input Year'
            ></input>
          </div>
        </div>
      </div>
      <div className='row'>
        <MovieList
          movies={movies}
          handleFavouritesClick={addFavouriteMovie}
          favouriteComponent={AddFavourites}
        />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Favourites' />
      </div>
      <div className='row'>
        <MovieList
          movies={favourites}
          handleFavouritesClick={removeFavouriteMovie}
          favouriteComponent={RemoveFavourites}
        />
      </div>
    </div>
  );
};

export default Home;
