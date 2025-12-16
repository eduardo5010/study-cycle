# 🔄 @studycycle/db-sync

Módulo compartilhado para gerenciar sincronização offline/online entre SQLite (mobile) e PostgreSQL (API).

## 📦 Instalação

```bash
# Já está incluído como workspace
npm install

# Ou instalar especificamente
npm install -w packages/db-sync
```

## 🎯 O que faz

- **Fila de Sincronização:** Agrupa mudanças offline
- **Validação:** Valida dados de sincronização
- **Resolução de Conflitos:** Last-Write-Wins (LWW)
- **Batching:** Agrupa operações em lotes
- **Retry:** Reexecuta sincronizações falhadas

## 🚀 Uso Rápido

### 1. Criar Fila de Sincronização

```typescript
import { SyncQueueManager } from '@studycycle/db-sync';

const queue = new SyncQueueManager();

// Adicionar operação
queue.addItem({
  entityType: 'study_cycle',
  entityId: 'uuid-do-ciclo',
  operation: 'create',
  data: {
    name: 'Novo ciclo',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-06-30T23:59:59Z',
  },
});

// Verificar quantos itens na fila
console.log(queue.size()); // 1
```

### 2. Criar Batch para Envio

```typescript
// Criar batch com tudo na fila
const batch = queue.createBatch(
  userId, // id do usuário
  clientId // id do dispositivo
);

// Batch agora contém:
// {
//   userId: "...",
//   clientId: "...",
//   batchId: "uuid gerado automaticamente",
//   items: [{ ... }]
// }

// Enviar para API
const response = await fetch('http://api:3001/api/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(batch),
});
```

### 3. Processar Resposta

```typescript
import { SyncValidator } from '@studycycle/db-sync';

const data = await response.json();
const syncResponse = SyncValidator.validateResponse(data);

if (syncResponse.success) {
  console.log('✅ Sincronização bem-sucedida');

  // Aplicar dados do servidor ao SQLite
  for (const item of syncResponse.syncedItems) {
    if (item.status === 'success') {
      console.log(`✅ ${item.entityId} sincronizado`);
    } else {
      console.log(`❌ ${item.entityId}: ${item.error}`);
    }
  }

  // Atualizar dados locais com responses do servidor
  for (const data of syncResponse.serverData) {
    await updateLocalDatabase(data.entityType, data);
  }
}
```

## 📚 API Completa

### SyncQueueManager

Gerencia fila de sincronização.

```typescript
import { SyncQueueManager } from '@studycycle/db-sync';

const queue = new SyncQueueManager();

// Adicionar item
queue.addItem({
  entityType: 'study_cycle',
  entityId: 'uuid',
  operation: 'create',
  data: { ... }
});

// Obter todos os itens pendentes
const items = queue.getPendingItems();

// Criar batch
const batch = queue.createBatch(userId, clientId);

// Limpar fila
queue.clear();

// Tamanho da fila
queue.size(); // retorna number
```

### ConflictResolver

Resolve conflitos entre dados locais e servidor.

```typescript
import { ConflictResolver } from '@studycycle/db-sync';

// Last-Write-Wins: última mudança prevalece
const resolved = ConflictResolver.resolve(
  { name: 'Ciclo A' }, // dados locais
  { name: 'Ciclo B' }, // dados servidor
  1704067200000, // timestamp local
  1704067300000 // timestamp servidor (mais recente)
);

console.log(resolved); // { name: 'Ciclo B' } ✅

// Mesclar arrays de mudanças
const merged = ConflictResolver.mergeChanges(localChanges, serverChanges);
```

### SyncValidator

Valida dados de sincronização com Zod.

```typescript
import { SyncValidator } from '@studycycle/db-sync';

// Validar item individual
const item = SyncValidator.validateItem({
  entityType: 'study_cycle',
  entityId: 'uuid',
  operation: 'create',
  data: { ... },
  timestamp: Date.now()
});

// Validar batch completo
const batch = SyncValidator.validateBatch({
  userId: 'uuid',
  clientId: 'device-id',
  items: [ ... ]
});

// Validar resposta da API
const response = SyncValidator.validateResponse({
  success: true,
  batchId: 'uuid',
  syncedItems: [ ... ],
  serverData: [ ... ],
  timestamp: Date.now()
});
```

### SyncResponseBuilder

Constrói respostas de sincronização no servidor.

```typescript
import { SyncResponseBuilder } from '@studycycle/db-sync';

const builder = new SyncResponseBuilder();

// Adicionar item sincronizado
builder.addSyncedItem(entityId, 'create', 'success', undefined, serverId);

// Adicionar erro
builder.addSyncedItem(entityId, 'update', 'error', 'Entity not found');

// Adicionar dados do servidor para o cliente
builder.addServerData(
  'study_cycle',
  entityId,
  { name: '...', createdAt: '...' },
  1 // version opcional
);

// Construir resposta final
const response = builder.build(batchId);
```

## 🔄 Fluxo Completo de Sincronização

### Mobile (Cliente)

```typescript
// 1. Usuário faz mudanças offline
class OfflineManager {
  async saveStudyCycle(cycle: StudyCycle) {
    // Salvar no SQLite
    await database.insert('study_cycles', cycle);

    // Adicionar à fila de sincronização
    this.syncQueue.addItem({
      entityType: 'study_cycle',
      entityId: cycle.id,
      operation: 'create',
      data: cycle,
    });
  }

  async sync() {
    // Quando online
    if (navigator.onLine) {
      // Criar batch
      const batch = this.syncQueue.createBatch(userId, deviceId);

      // Enviar para API
      const response = await api.post('/sync', batch);

      // Processar resposta
      await this.processSyncResponse(response);
    }
  }
}
```

### API (Servidor)

```typescript
// routes/sync.ts
app.post('/api/sync', async (req, res) => {
  const batch = SyncValidator.validateBatch(req.body);

  const builder = new SyncResponseBuilder();

  for (const item of batch.items) {
    try {
      // Processar cada operação
      switch (item.operation) {
        case 'create':
          const created = await createEntity(item);
          builder.addSyncedItem(item.entityId, 'create', 'success', undefined, created.id);
          builder.addServerData(item.entityType, created.id, created);
          break;

        case 'update':
          const updated = await updateEntity(item);
          builder.addSyncedItem(item.entityId, 'update', 'success', undefined, updated.id);
          builder.addServerData(item.entityType, updated.id, updated);
          break;

        case 'delete':
          await deleteEntity(item);
          builder.addSyncedItem(item.entityId, 'delete', 'success');
          break;
      }

      // Log de sincronização
      await logSync(batch.userId, item, 'success');
    } catch (error) {
      builder.addSyncedItem(item.entityId, item.operation, 'error', error.message);
      await logSync(batch.userId, item, 'error', error.message);
    }
  }

  res.json(builder.build(batch.batchId));
});
```

## 🛡️ Tratamento de Conflitos

### Cenário: Offline edita, Servidor deleta

```typescript
// Mobile tenta sincronizar edição
const localChange = {
  entityId: 'subject-123',
  operation: 'update',
  data: { name: 'Nova nome' },
  timestamp: 1704067200000,
};

// Servidor já deletou
const serverState = null; // deletado em T=1704067300000

// Estratégia: Recriar entidade
if (!serverEntity) {
  // Converter UPDATE em CREATE
  operation = 'create';
}
```

### Cenário: Dois dispositivos editam ao mesmo tempo

```typescript
// Device A edita em T=100
// Device B edita em T=150
// Ambos sincronizam

const conflict = {
  entityId: 'cycle-123',
  deviceA: { name: 'Ciclo A', timestamp: 100 },
  deviceB: { name: 'Ciclo B', timestamp: 150 },
};

// Resolver: timestamp vence
const resolved = { name: 'Ciclo B' }; // T=150 é mais recente
```

## ⏱️ Configuração de Sincronização

No `.env.local` da API:

```env
# Tamanho máximo de batch
SYNC_BATCH_SIZE=50

# Timeout de sincronização (ms)
SYNC_TIMEOUT=30000

# Máximo de retries
SYNC_MAX_RETRIES=3

# Intervalo de retry exponencial (ms)
SYNC_RETRY_INTERVAL=1000
```

## 📊 Monitorar Sincronizações

### Via PGAdmin

```sql
-- Ver logs de sincronização
SELECT * FROM sync_logs
WHERE user_id = 'uuid'
ORDER BY created_at DESC
LIMIT 20;

-- Ver itens pendentes
SELECT * FROM sync_queue
WHERE user_id = 'uuid'
ORDER BY created_at ASC;

-- Conflitos detectados
SELECT * FROM sync_logs
WHERE synced = false AND changes IS NOT NULL
ORDER BY created_at DESC;
```

### Via Drizzle Studio

```bash
npm run db:studio
# Abrir http://localhost:3001
# Navegar até sync_logs e sync_queue
```

## 🚨 Tratamento de Erros

```typescript
import { ZodError } from 'zod';

try {
  const batch = SyncValidator.validateBatch(data);
} catch (error) {
  if (error instanceof ZodError) {
    console.error('Validação falhou:', error.errors);
    // Notificar usuário sobre dados inválidos
  }
}

// Retry automático
async function syncWithRetry(batch: SyncBatch, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sync(batch);
    } catch (error) {
      if (i < maxRetries - 1) {
        // Esperar com backoff exponencial
        await sleep(Math.pow(2, i) * 1000);
      } else {
        throw error; // Falha final
      }
    }
  }
}
```

## 🔗 Integração com Mobile

No React Native, usar com React Query:

```typescript
import { useMutation } from '@tanstack/react-query';
import { SyncQueueManager } from '@studycycle/db-sync';

const syncQueue = new SyncQueueManager();

const useSyncMutation = () => {
  return useMutation(async () => {
    const batch = syncQueue.createBatch(userId, deviceId);
    return await api.post('/sync', batch);
  });
};

// No componente
const { mutate: sync, isLoading } = useSyncMutation();

return (
  <Button
    onPress={() => sync()}
    disabled={isLoading}
  >
    {isLoading ? 'Sincronizando...' : 'Sincronizar'}
  </Button>
);
```

## 📖 Tipos TypeScript

```typescript
type SyncOperation = 'create' | 'update' | 'delete';
type SyncEntityType = 'study_cycle' | 'subject' | 'course';

interface SyncItem {
  id?: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  data: Record<string, any>;
  timestamp: number;
}

interface SyncBatch {
  userId: string;
  clientId: string;
  items: SyncItem[];
  batchId?: string;
}

interface SyncResponse {
  success: boolean;
  batchId: string;
  syncedItems: Array<{
    entityId: string;
    operation: SyncOperation;
    status: 'success' | 'error';
    error?: string;
    serverId?: string;
  }>;
  serverData: Array<{
    entityType: SyncEntityType;
    entityId: string;
    data: Record<string, any>;
    version?: number;
  }>;
  timestamp: number;
}
```

## 🧪 Testes

```bash
# Testes unitários
npm test -w packages/db-sync

# Coverage
npm test --coverage -w packages/db-sync
```

## 📚 Referências

- [README principal](../../README.md)
- [API docs](../api/README.md)
- [Core package](../core/README.md)

---

**Construído com TypeScript e Zod**
