import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Tipos e schemas para sincronização
export const SyncOperationSchema = z.enum(['create', 'update', 'delete']);
export type SyncOperation = z.infer<typeof SyncOperationSchema>;

export const SyncEntityTypeSchema = z.enum(['study_cycle', 'subject', 'course']);
export type SyncEntityType = z.infer<typeof SyncEntityTypeSchema>;

export const SyncItemSchema = z.object({
  id: z.string().uuid().optional(),
  entityType: SyncEntityTypeSchema,
  entityId: z.string().uuid(),
  operation: SyncOperationSchema,
  data: z.record(z.any()),
  timestamp: z.number(),
});

export type SyncItem = z.infer<typeof SyncItemSchema>;

export const SyncBatchSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(SyncItemSchema),
  clientId: z.string(),
  batchId: z.string().uuid().optional(),
});

export type SyncBatch = z.infer<typeof SyncBatchSchema>;

export const SyncResponseSchema = z.object({
  success: z.boolean(),
  batchId: z.string().uuid(),
  syncedItems: z.array(
    z.object({
      entityId: z.string().uuid(),
      operation: SyncOperationSchema,
      status: z.enum(['success', 'error']),
      error: z.string().optional(),
      serverId: z.string().uuid().optional(),
    })
  ),
  serverData: z.array(
    z.object({
      entityType: SyncEntityTypeSchema,
      entityId: z.string().uuid(),
      data: z.record(z.any()),
      version: z.number().optional(),
    })
  ),
  timestamp: z.number(),
});

export type SyncResponse = z.infer<typeof SyncResponseSchema>;

/**
 * Resolver de conflitos para sincronização
 * Usa timestamp para resolver conflitos: última mudança vence
 */
export class ConflictResolver {
  static resolve(
    localData: Record<string, any>,
    serverData: Record<string, any>,
    localTimestamp: number,
    serverTimestamp: number
  ): Record<string, any> {
    // Última mudança vence (Last-Write-Wins)
    if (localTimestamp > serverTimestamp) {
      return localData;
    }
    return serverData;
  }

  static mergeChanges(local: SyncItem[], server: SyncItem[]): SyncItem[] {
    const map = new Map<string, SyncItem>();

    // Adiciona items do servidor
    server.forEach((item: SyncItem) => {
      map.set(item.entityId, item);
    });

    // Adiciona ou sobrescreve com items locais (se forem mais recentes)
    local.forEach((item: SyncItem) => {
      const existing = map.get(item.entityId);
      if (!existing || item.timestamp > existing.timestamp) {
        map.set(item.entityId, item);
      }
    });

    return Array.from(map.values());
  }
}

/**
 * Gerenciador de fila de sincronização
 */
export class SyncQueueManager {
  private queue: SyncItem[] = [];

  addItem(item: Omit<SyncItem, 'id' | 'timestamp'>) {
    const syncItem: SyncItem = {
      id: uuidv4(),
      ...item,
      timestamp: Date.now(),
    };
    this.queue.push(syncItem);
  }

  createBatch(userId: string, clientId: string): SyncBatch {
    const batch: SyncBatch = {
      userId,
      clientId,
      items: [...this.queue],
      batchId: uuidv4(),
    };
    this.queue = [];
    return batch;
  }

  getPendingItems(): SyncItem[] {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }
}

/**
 * Validador de dados para sincronização
 */
export class SyncValidator {
  static validateBatch(data: unknown): SyncBatch {
    try {
      return SyncBatchSchema.parse(data);
    } catch (error) {
      throw new Error(
        `Invalid batch data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static validateItem(data: unknown): SyncItem {
    try {
      return SyncItemSchema.parse(data);
    } catch (error) {
      throw new Error(
        `Invalid item data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static validateResponse(data: unknown): SyncResponse {
    try {
      return SyncResponseSchema.parse(data);
    } catch (error) {
      throw new Error(
        `Invalid response data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

/**
 * Construtor de respostas de sincronização
 */
export class SyncResponseBuilder {
  private syncedItems: SyncResponse['syncedItems'] = [];
  private serverData: SyncResponse['serverData'] = [];

  addSyncedItem(
    entityId: string,
    operation: SyncOperation,
    status: 'success' | 'error',
    error?: string,
    serverId?: string
  ) {
    this.syncedItems.push({
      entityId,
      operation,
      status,
      error,
      serverId,
    });
    return this;
  }

  addServerData(
    entityType: SyncEntityType,
    entityId: string,
    data: Record<string, any>,
    version?: number
  ) {
    this.serverData.push({
      entityType,
      entityId,
      data,
      version,
    });
    return this;
  }

  build(batchId: string): SyncResponse {
    return {
      success: this.syncedItems.every((item) => item.status === 'success'),
      batchId,
      syncedItems: this.syncedItems,
      serverData: this.serverData,
      timestamp: Date.now(),
    };
  }
}
