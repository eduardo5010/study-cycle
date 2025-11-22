# Migração para SQLite

Este documento descreve a migração do banco de dados de PostgreSQL para SQLite.

## Mudanças Realizadas

### 1. Configuração do Drizzle
- ✅ `drizzle.config.ts` atualizado para usar `dialect: "sqlite"`
- ✅ `DATABASE_URL` agora aponta para um arquivo SQLite (padrão: `./database.sqlite`)

### 2. Schemas do Banco de Dados
- ✅ Todos os schemas convertidos de `pgTable` para `sqliteTable`
- ✅ Tipos atualizados:
  - `varchar` → `text`
  - `boolean` → `integer` com `mode: "boolean"`
  - `timestamp` → `text` com `default(sql\`(datetime('now'))\`)`
  - `jsonb` → `text` com `mode: "json"`
- ✅ UUIDs gerados usando `sql\`(lower(hex(randomblob(16))))\`` ao invés de `gen_random_uuid()`

### 3. Conexão com o Banco
- ✅ `server/db.ts` atualizado para usar `better-sqlite3`
- ✅ Removida dependência do `pg` (PostgreSQL client)
- ✅ Adicionada dependência `better-sqlite3`

### 4. Arquivos Atualizados
- `drizzle.config.ts`
- `server/db.ts`
- `server/db/schema.ts`
- `shared/schema.ts`
- `shared/schema/content.ts`
- `shared/types/tables.ts`
- `server/storage.ts` (comentários atualizados)
- `package.json` (dependências atualizadas)
- `README.md` (documentação atualizada)

### 5. Dependências
**Removidas:**
- `pg` (PostgreSQL client)
- `connect-pg-simple` (PostgreSQL session store)
- `@types/connect-pg-simple`
- `@types/pg`

**Adicionadas:**
- `better-sqlite3` (SQLite client)
- `@types/better-sqlite3`

## Como Usar

### Instalação
```bash
npm install
```

### Configuração
O banco de dados SQLite será criado automaticamente no primeiro uso. Por padrão, o arquivo será criado em `./database.sqlite`.

Você pode configurar um caminho diferente usando a variável de ambiente:
```env
DATABASE_URL=./path/to/your/database.sqlite
```

### Migrações
Para gerar migrações:
```bash
npm run db:push
```

## Vantagens do SQLite

1. **Simplicidade**: Não requer servidor de banco de dados separado
2. **Portabilidade**: Arquivo único que pode ser facilmente copiado/backup
3. **Desenvolvimento**: Ideal para desenvolvimento local e prototipagem
4. **Zero Configuração**: Funciona imediatamente sem setup adicional

## Limitações

1. **Concorrência**: SQLite tem limitações de escrita concorrente (adequado para a maioria dos casos de uso)
2. **Escalabilidade**: Não é ideal para aplicações de alta escala com muitas escritas simultâneas
3. **Recursos Avançados**: Alguns recursos avançados do PostgreSQL não estão disponíveis

## Notas Importantes

- O banco de dados SQLite é criado automaticamente na primeira execução
- Todas as tabelas são criadas automaticamente via Drizzle
- O arquivo `database.sqlite` deve ser adicionado ao `.gitignore` (já está)
- Para produção, considere fazer backups regulares do arquivo SQLite

## Migração de Dados (se necessário)

Se você tinha dados no PostgreSQL e precisa migrá-los:

1. Exporte os dados do PostgreSQL para CSV/JSON
2. Crie scripts de importação para SQLite
3. Execute as migrações do Drizzle para criar as tabelas
4. Importe os dados

**Nota**: Esta migração assume um banco de dados novo. Se você precisa migrar dados existentes, será necessário criar scripts de migração específicos.

