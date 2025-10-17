import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getMessages,
  getLikedSongs,
  likeSong,
  unlikeSong,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);

// Liked songs routes
router.get("/liked-songs", protectRoute, getLikedSongs);
router.post("/like/:songId", protectRoute, likeSong);
router.delete("/like/:songId", protectRoute, unlikeSong);

export default router;
