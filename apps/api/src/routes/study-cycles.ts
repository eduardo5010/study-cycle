import express from 'express';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { studyCycles } from '../db/schema.js';

const router = express.Router();

// Get all study cycles
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    let allStudyCycles;
    if (userId) {
      allStudyCycles = await db.select().from(studyCycles).where(eq(studyCycles.userId, userId));
    } else {
      allStudyCycles = await db.select().from(studyCycles);
    }
    res.json({ studyCycles: allStudyCycles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study cycles' });
  }
});

// Create study cycle
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, description, startDate, endDate } = req.body;
    const newStudyCycle = await db.insert(studyCycles).values({
      userId,
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    }).returning();
    res.status(201).json({
      message: 'Study cycle created',
      studyCycle: newStudyCycle[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create study cycle' });
  }
});

// Get study cycle by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studyCycle = await db.select().from(studyCycles).where(eq(studyCycles.id, id));
    if (studyCycle.length === 0) {
      return res.status(404).json({ error: 'Study cycle not found' });
    }
    res.json({ studyCycle: studyCycle[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study cycle' });
  }
});

// Update study cycle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, isActive } = req.body;
    await db.update(studyCycles).set({
      name,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isActive,
      updatedAt: new Date(),
    }).where(eq(studyCycles.id, id));
    res.json({ message: 'Study cycle updated', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update study cycle' });
  }
});

// Delete study cycle
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(studyCycles).where(eq(studyCycles.id, id));
    res.json({ message: 'Study cycle deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete study cycle' });
  }
});

export default router;
