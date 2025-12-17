import express from 'express';
import type { Request, Response } from 'express';
import { eq, gt, and } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { syncLogs } from '../db/schema.js';

const router = express.Router();

// Sync data from mobile to server
router.post('/push', async (req: Request, res: Response) => {
  try {
    const { userId, entityType, entityId, operation, changes } = req.body;
    await db.insert(syncLogs).values({
      userId,
      entityType,
      entityId,
      operation,
      changes,
    });
    res.json({
      message: 'Data synced successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Pull data from server to mobile
router.get('/pull', async (req: Request, res: Response) => {
  try {
    const { userId, lastSync } = req.query as { userId: string; lastSync?: string };
    const logs = lastSync
      ? await db
          .select()
          .from(syncLogs)
          .where(and(eq(syncLogs.userId, userId), gt(syncLogs.createdAt, new Date(lastSync))))
      : await db.select().from(syncLogs).where(eq(syncLogs.userId, userId));
    res.json({
      message: 'Data pulled successfully',
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pull data' });
  }
});

// Get sync status
router.get('/status', async (_req: Request, res: Response) => {
  try {
    res.json({
      status: 'OK',
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sync status' });
  }
});

export default router;
