import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookmarksRouter from "./bookmarks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookmarksRouter);

export default router;
