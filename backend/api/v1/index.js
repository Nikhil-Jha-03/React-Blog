import { Router } from "express";
import AuthRouter from "./authroute.js";
import BlogRouter from "./blogroute.js";
import AdminRouter from "./adminRoute.js";
import PublicBlogRouter from "./publicBlogRoute.js";

import { isLoggedIn } from "../../middleware/isLoggedin.js";

const router = Router();

router.use("/user", AuthRouter);
router.use("/blog", PublicBlogRouter);
router.use("/blog", isLoggedIn, BlogRouter);
router.use("/admin", AdminRouter);

export default router;
