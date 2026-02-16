---
name: Database Migration Workflow
description: Safe database schema modification workflow with production/development distinction
---

# Database Migration Workflow

## 🎯 When to Use This Skill

Use this skill **BEFORE** any database schema change:
- Creating new tables
- Adding/removing columns
- Changing column types or constraints
- Adding/removing indexes
- Modifying table structure
- Any schema modifications

## 📋 Critical Decision Tree

### Step 1: STOP and Ask

**BEFORE making ANY schema change, you MUST ask:**

> "Is this project deployed to production?"

**DO NOT PROCEED** until you receive a clear answer.

### Step 2: Choose Workflow Based on Answer

#### ✅ If NOT Deployed (Development Only)

**You MAY**:
- Modify existing migration files directly
- Add columns to original `createTable` migration
- Delete and recreate migrations
- Change migration order

**Then run**:
```bash
yarn initDB  # Complete database reset
# OR
yarn migrate:undo && yarn migrate  # Undo and reapply
```

**Example**:
```typescript
// ✅ Modify existing migration directly
// db/migrations/20240101-create-users.ts
export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },  // ✅ Added directly to existing migration
  });
}
```

#### ❌ If Deployed to Production

**You MUST NOT**:
- Modify existing executed migrations
- Delete migrations
- Change migration file names or order

**You MUST**:
- Create NEW migration files
- Use proper sequelize methods (`addColumn`, `removeColumn`, etc.)
- Test on staging environment first
- Plan rollback strategy

**Example**:
```typescript
// ✅ Create NEW migration file
// db/migrations/20240201-add-email-to-users.ts
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('users', 'email');
}
```

## ✅ Correct Examples

### Example 1: Development - Modify Existing Migration

**Scenario**: Project not deployed, need to add `email` field to users table.

```typescript
// ✅ CORRECT for development
// db/migrations/20240101-create-users.ts
export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {                           // ✅ Added directly
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
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
}
```

**Then run**:
```bash
yarn initDB  # Reset and recreate database
```

### Example 2: Production - Create New Migration

**Scenario**: Project deployed to production, need to add `email` field.

```typescript
// ✅ CORRECT for production
// db/migrations/20240201-add-email-to-users.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: true,  // Allow null for existing records
    unique: true,
  });
  
  // Optional: Add index
  await queryInterface.addIndex('users', ['email'], {
    name: 'users_email_idx',
  });
}

export async function down(queryInterface: QueryInterface) {
  // Remove index first
  await queryInterface.removeIndex('users', 'users_email_idx');
  
  // Then remove column
  await queryInterface.removeColumn('users', 'email');
}
```

### Example 3: Production - Complex Schema Change

**Scenario**: Change column type from VARCHAR to TEXT.

```typescript
// ✅ CORRECT for production
// db/migrations/20240301-change-description-type.ts
export async function up(queryInterface: QueryInterface) {
  // Step 1: Add new column with new type
  await queryInterface.addColumn('products', 'description_new', {
    type: DataTypes.TEXT,
    allowNull: true,
  });
  
  // Step 2: Copy data
  await queryInterface.sequelize.query(`
    UPDATE products SET description_new = description
  `);
  
  // Step 3: Remove old column
  await queryInterface.removeColumn('products', 'description');
  
  // Step 4: Rename new column
  await queryInterface.renameColumn('products', 'description_new', 'description');
}

export async function down(queryInterface: QueryInterface) {
  // Reverse the process
  await queryInterface.changeColumn('products', 'description', {
    type: DataTypes.STRING,
  });
}
```

## ❌ Common Mistakes

### Mistake 1: Modifying Production Migration

```typescript
// ❌ WRONG if deployed to production
// Modifying existing migration that has already been executed
export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },  // ❌ Added to executed migration
  });
}
```

**Why wrong**: This migration has already been executed on production. Modifying it won't affect production database and will cause inconsistency.

### Mistake 2: Not Asking About Production

```
// ❌ WRONG
AI: "I'll modify the migration directly..."
// Should have asked first!

// ✅ CORRECT
AI: "Is this project deployed to production?"
User: "Yes"
AI: "I'll create a new migration file instead."
```

### Mistake 3: Not Planning Rollback

```typescript
// ❌ WRONG - No down() method
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
  });
}
// Missing down() method!

// ✅ CORRECT
export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('users', 'email');
}
```

### Mistake 4: Breaking Changes Without Migration Strategy

```typescript
// ❌ WRONG - Making column NOT NULL immediately
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: false,  // ❌ Will fail for existing records!
  });
}

// ✅ CORRECT - Two-step migration
// Migration 1: Add column as nullable
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: true,  // ✅ Allow null initially
  });
}

// Migration 2 (later): Make it NOT NULL after data is populated
export async function up(queryInterface: QueryInterface) {
  await queryInterface.changeColumn('users', 'email', {
    type: DataTypes.STRING,
    allowNull: false,  // ✅ Now safe
  });
}
```

## 📝 Checklist

### Before ANY Schema Change

- [ ] **Asked**: "Is this project deployed to production?"
- [ ] Received clear answer from user
- [ ] Chosen correct workflow (modify vs create new)
- [ ] Planned rollback strategy (`down()` method)
- [ ] Considered impact on existing data

### For Development Changes (Not Deployed)

- [ ] Modified original migration file
- [ ] Updated corresponding model file (`models/*.ts`)
- [ ] Planned to run `yarn initDB` or `yarn migrate:undo && yarn migrate`
- [ ] Verified no data loss concerns
- [ ] Tested migration locally

### For Production Changes (Deployed)

- [ ] Created NEW migration file with timestamp
- [ ] Used proper sequelize methods (`addColumn`, `removeColumn`, etc.)
- [ ] Implemented `down()` method for rollback
- [ ] Tested on local environment
- [ ] Planned staging environment test
- [ ] Considered backward compatibility
- [ ] Documented breaking changes (if any)
- [ ] Planned deployment sequence

### For Breaking Changes

- [ ] Planned multi-step migration strategy
- [ ] Ensured existing data won't break
- [ ] Added default values or made columns nullable initially
- [ ] Planned data migration script (if needed)
- [ ] Communicated with team about deployment timing

## 🔗 Related Rules

- `.agent/rules/backend-orm.md`
- `.cursor/rules/backend-orm.mdc`
- `GEMINI.md` - Backend ORM Best Practices section
- `CLAUDE.md` - Backend ORM Best Practices section

## 💡 Pro Tips

### Tip 1: Always Ask, Even If You Think You Know

Even if the conversation context suggests the project status, **always ask explicitly**. It's better to ask twice than to make a wrong assumption.

### Tip 2: Use Descriptive Migration Names

```bash
# ✅ GOOD
20240201-add-email-to-users.ts
20240202-create-posts-table.ts
20240203-add-index-to-users-email.ts

# ❌ BAD
20240201-update.ts
20240202-fix.ts
```

### Tip 3: Test Migrations Both Ways

Always test both `up()` and `down()` methods:
```bash
yarn migrate        # Test up
yarn migrate:undo   # Test down
yarn migrate        # Test up again
```

### Tip 4: For Production, Think in Phases

Complex changes should be split into multiple migrations:
1. Add new column (nullable)
2. Populate data
3. Make column NOT NULL
4. Remove old column (if replacing)

This allows for safer deployment and easier rollback.
