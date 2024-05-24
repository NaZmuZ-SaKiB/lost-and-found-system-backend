import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { FoundItemRoutes } from "../modules/FoundItem/foundItem.route";
import { ClaimRoutes } from "../modules/Claim/claim.route";
import { ProfileRoutes } from "../modules/Profile/profile.route";
import { LostItemRoutes } from "../modules/LostItem/lostItem.route";

const router = Router();

type TPath = {
  path: string;
  route: Router;
};

const paths: TPath[] = [
  {
    path: "/",
    route: UserRoutes,
  },
  {
    path: "/",
    route: ProfileRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/found-items",
    route: FoundItemRoutes,
  },
  {
    path: "/lost-items",
    route: LostItemRoutes,
  },
  {
    path: "/claims",
    route: ClaimRoutes,
  },
];

paths.forEach((route) => router.use(route.path, route.route));

export default router;
