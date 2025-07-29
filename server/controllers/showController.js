import axios from "axios";
import axiosRetry from "axios-retry";
import Movie from "../models/movieModel.js";
import Show from "../models/showModel.js";
import { inngest } from "../inngest/index.js";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors (ECONNRESET, ETIMEDOUT, etc.)
    // or on specific HTTP status codes if you want (e.g., 5xx server errors)
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(
      `Retry attempt ${retryCount} for ${requestConfig.url}. Error: ${error.message}`
    );
  },
});

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 5000,
      }
    );

    const movies = data.results;

    res.status(200).json({
      success: true,
      message: "Now Playing Movies Fetched Successfully!",
      movies: movies,
    });
  } catch (error) {
    console.error("Error fetching now playing movies:", error.message);
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      res.status(503).json({
        success: false,
        message:
          "Failed to connect to the movie API after multiple retries. Please try again later.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred: " + error.message,
      });
    }
  }
};

// Api to add new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showPrice, showsInput } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
          timeout: 5000,
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
          timeout: 5000,
        }),
      ]);
      const movieApiData = movieDetailsResponse.data;
      const movieCreditData = movieCreditsResponse.data;

      const movieDeatils = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "NA",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      movie = await Movie.create(movieDeatils);
    }

    const showsToCreate = [];
    // Iterate over showsInput (which now correctly has date and array of times)
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    //Trigger Inggest Event
    await inngest.send({
      name: "app/show.added",
      data: { movieTitle: movie.title },
    });

    res.status(200).json({
      success: true,
      message: "Show added successfully!",
    });
  } catch (error) {
    console.error("Error adding show:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add show: " + error.message,
    });
  }
};

// API to get all shows from the database
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    //Filer unique shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully!",
      shows: Array.from(uniqueShows),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Api to get a shows for a movie form the database
export const getShowDetails = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.status(200).json({
      success: true,
      message: "Show fetched successfully!",
      movie,
      dateTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
