import { Router, type IRouter } from "express";
import { db, bookmarksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBookmarkBody,
  UpdateBookmarkBody,
  UpdateBookmarkParams,
  DeleteBookmarkParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookmarks", async (req, res) => {
  try {
    const bookmarks = await db
      .select()
      .from(bookmarksTable)
      .orderBy(bookmarksTable.createdAt);
    res.json(bookmarks);
  } catch (err) {
    req.log.error({ err }, "Failed to list bookmarks");
    res.status(500).json({ error: "Failed to list bookmarks" });
  }
});

router.post("/bookmarks", async (req, res) => {
  try {
    const body = CreateBookmarkBody.parse(req.body);
    const [bookmark] = await db
      .insert(bookmarksTable)
      .values(body)
      .returning();
    res.status(201).json(bookmark);
  } catch (err) {
    req.log.error({ err }, "Failed to create bookmark");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.patch("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = UpdateBookmarkParams.parse(req.params);
    const body = UpdateBookmarkBody.parse(req.body);
    const [bookmark] = await db
      .update(bookmarksTable)
      .set(body)
      .where(eq(bookmarksTable.id, id))
      .returning();
    if (!bookmark) {
      res.status(404).json({ error: "Bookmark not found" });
      return;
    }
    res.json(bookmark);
  } catch (err) {
    req.log.error({ err }, "Failed to update bookmark");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = DeleteBookmarkParams.parse(req.params);
    await db.delete(bookmarksTable).where(eq(bookmarksTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete bookmark");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
