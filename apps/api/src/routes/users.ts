import express from 'express';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';

const router = express.Router();

// Get all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, id));
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, avatar } = req.body;
    await db
      .update(users)
      .set({
        email,
        firstName,
        lastName,
        avatar,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
    res.json({ message: 'User updated', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, id));
    res.json({ message: 'User deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
