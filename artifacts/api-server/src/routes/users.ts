import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.patch("/users/me", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const body = UpdateMeBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.avatarColor !== undefined) updateData.avatarColor = body.avatarColor;

    const [user] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarColor: user.avatarColor,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Update user failed");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
