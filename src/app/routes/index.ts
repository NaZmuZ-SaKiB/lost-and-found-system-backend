import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { FoundItemRoutes } from "../modules/FoundItem/foundItem.route";
import { ClaimRoutes } from "../modules/Claim/claim.route";
import { ProfileRoutes } from "../modules/Profile/profile.route";

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
    path: "/",
    route: CategoryRoutes,
  },
  {
    path: "/",
    route: FoundItemRoutes,
  },
  {
    path: "/",
    route: ClaimRoutes,
  },
];

paths.forEach((route) => router.use(route.path, route.route));

export default router;
