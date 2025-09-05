import { Router } from "express";
import AuthRouter from "./authroute.js";  // cleaner import
import BlogRouter from "./blogroute.js";
import { isLoggedIn } from "../../middleware/isLoggedin.js";
// import 

const router = Router();

router.use("/user", AuthRouter);
router.use("/blog", isLoggedIn, BlogRouter);

export default router;
