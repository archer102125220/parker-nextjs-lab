# Database Migration

Generate or modify database migrations following project standards.

## Usage

Use this command when you need to:
- Create new database tables
- Modify existing schema
- Add/remove columns
- Create indexes
- Seed data

## ⚠️ CRITICAL: Production Check

**BEFORE ANY schema change, you MUST ask**:
> "Is this project deployed to production?"

- **Not deployed**: May modify existing migrations, use `yarn initDB`
- **Deployed**: NEVER modify existing migrations, create NEW migration files

## Template

Please create a database migration for:

**Change Type**:
- [ ] Create new table
- [ ] Add column(s)
- [ ] Remove column(s)
- [ ] Modify column type
- [ ] Add index
- [ ] Create relationship

**Details**:
- **Table**: [table name]
- **Changes**: [describe changes]
- **Reason**: [why this change is needed]

**Migration Requirements**:
- ✅ Use Sequelize CLI format
- ✅ Include `up` and `down` methods
- ✅ Add proper TypeScript types
- ✅ Include rollback logic
- ✅ Test migration before committing

**Commands to Run**:
```bash
# Generate migration
yarn sequelize migration:generate --name [migration-name]

# Run migration
yarn migrate

# Rollback (if needed)
yarn migrate:undo
```

## Example

```
Please create a database migration for:

**Change Type**:
- [x] Add column(s)

**Details**:
- **Table**: users
- **Changes**: Add `role` column (enum: 'admin', 'user', 'guest')
- **Reason**: Implement role-based access control

**Additional Requirements**:
- Default value: 'user'
- NOT NULL constraint
- Add index on role column
```

## Migration Template

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn('table_name', 'column_name', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default',
    });
    
    // Add index if needed
    await queryInterface.addIndex('table_name', ['column_name']);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Rollback logic
    await queryInterface.removeColumn('table_name', 'column_name');
  },
};
```

## Common Migration Patterns

### Create Table
```typescript
await queryInterface.createTable('table_name', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
```

### Add Foreign Key
```typescript
await queryInterface.addColumn('posts', 'userId', {
  type: DataTypes.INTEGER,
  references: {
    model: 'users',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});
```

### Add Index
```typescript
await queryInterface.addIndex('table_name', ['column1', 'column2'], {
  name: 'index_name',
  unique: true,
});
```

## Workflow

### Development (Not Deployed)
1. Modify existing migration if just created
2. Run `yarn initDB` to reset database
3. Test thoroughly

### Production (Deployed)
1. **NEVER modify existing migrations**
2. Create NEW migration file
3. Test on staging first
4. Run `yarn migrate` on production
5. Keep rollback plan ready

## Related Skills

- [Database Migration Workflow](.agent/skills/database-migration-workflow/SKILL.md)
- [Backend ORM Best Practices](docs/guides/coding-standards.md#backend-orm-best-practices)
