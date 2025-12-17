import express from 'express';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { subjects } from '../db/schema.js';

const router = express.Router();

// Get all subjects
router.get('/', async (req: Request, res: Response) => {
  try {
    const studyCycleId = req.query.studyCycleId as string;
    let allSubjects;
    if (studyCycleId) {
      allSubjects = await db.select().from(subjects).where(eq(subjects.studyCycleId, studyCycleId));
    } else {
      allSubjects = await db.select().from(subjects);
    }
    res.json({ subjects: allSubjects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Create subject
router.post('/', async (req: Request, res: Response) => {
  try {
    const { studyCycleId, name, code, description, credits, color } = req.body;
    const newSubject = await db.insert(subjects).values({
      studyCycleId,
      name,
      code,
      description,
      credits,
      color,
    }).returning();
    res.status(201).json({
      message: 'Subject created',
      subject: newSubject[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// Get subject by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subject = await db.select().from(subjects).where(eq(subjects.id, id));
    if (subject.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ subject: subject[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

// Update subject
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, description, credits, color } = req.body;
    await db.update(subjects).set({
      name,
      code,
      description,
      credits,
      color,
      updatedAt: new Date(),
    }).where(eq(subjects.id, id));
    res.json({ message: 'Subject updated', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

// Delete subject
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(subjects).where(eq(subjects.id, id));
    res.json({ message: 'Subject deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

export default router;
