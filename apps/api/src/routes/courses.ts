import express from 'express';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { courses } from '../db/schema.js';

const router = express.Router();

// Get all courses
router.get('/', async (req: Request, res: Response) => {
  try {
    const subjectId = req.query.subjectId as string;
    let allCourses;
    if (subjectId) {
      allCourses = await db.select().from(courses).where(eq(courses.subjectId, subjectId));
    } else {
      allCourses = await db.select().from(courses);
    }
    res.json({ courses: allCourses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create course
router.post('/', async (req: Request, res: Response) => {
  try {
    const { subjectId, name, teacher, schedule, room } = req.body;
    const newCourse = await db.insert(courses).values({
      subjectId,
      name,
      teacher,
      schedule,
      room,
    }).returning();
    res.status(201).json({
      message: 'Course created',
      course: newCourse[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get course by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await db.select().from(courses).where(eq(courses.id, id));
    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course: course[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Update course
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, teacher, schedule, room } = req.body;
    await db.update(courses).set({
      name,
      teacher,
      schedule,
      room,
      updatedAt: new Date(),
    }).where(eq(courses.id, id));
    res.json({ message: 'Course updated', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(courses).where(eq(courses.id, id));
    res.json({ message: 'Course deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
