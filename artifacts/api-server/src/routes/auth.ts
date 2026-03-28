import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SignupBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const SALT_ROUNDS = 10;

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

router.post("/auth/signup", async (req, res) => {
  try {
    const body = SignupBody.parse(req.body);
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, body.username.toLowerCase()))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
    const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
    const [user] = await db
      .insert(usersTable)
      .values({
        username: body.username.toLowerCase(),
        displayName: body.displayName,
        passwordHash,
        avatarColor: randomAvatarColor(),
      })
      .returning();

    (req.session as any).userId = user.id;
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Signup failed");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, body.username.toLowerCase()))
      .limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    (req.session as any).userId = user.id;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(400).json({ error: "Invalid request" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/auth/me", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
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
    req.log.error({ err }, "Get me failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
