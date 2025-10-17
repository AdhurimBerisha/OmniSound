import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = Router();

router.route("/image").post(protectRoute, uploadImage);

export default router;
