// modules/favourite/route.ts
import { Router } from "express";
import auth from "../../middleware/auth";
import { FavouriteController } from "./controller";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post("/", auth(USER_ROLE.user), FavouriteController.toggleFavourite);
router.get("/", auth(USER_ROLE.user), FavouriteController.getFavourites);

export const FavouriteRoutes = router;
