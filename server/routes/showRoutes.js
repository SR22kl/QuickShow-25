import express from "express";
import {
  addShow,
  getAllShows,
  getNowPlayingMovies,
  getShowDetails,
} from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

//ROUTES
//Now Playing movies:- /api/show/now-playing
showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies);

//Add movie shows: -/api/show/add
showRouter.post("/add", protectAdmin, addShow);

//Get all shows:- /api/show/all
showRouter.get("/all", getAllShows);

//Get showsDetails:- /api/show/:movieId
showRouter.get("/:movieId", getShowDetails);

export default showRouter;
