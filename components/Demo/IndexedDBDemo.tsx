'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import IndexedDBORM, { type Model, type ModelInstance } from '@/utils/indexeddb/IndexedDBORM';
import style from '@/app/[locale]/indexeddb-demo/page.module.scss';

interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
}

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export default function IndexedDBDemo() {
  const t = useTranslations('pages.indexedDBDemo');

  // Database setup
  const dbName = 'indexeddb_demo';
  const dbVersion = 1;
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data state
  const [users, setUsers] = useState<ModelInstance[]>([]);
  const [newUser, setNewUser] = useState<User>({ name: '', email: '', age: 25 });
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ORM references
  const [UserModel, setUserModel] = useState<Model | null>(null);

  // Logging helper
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const newLogs = [{ time, message, type }, ...prev];
      return newLogs.slice(0, 20);
    });
  }, []);

  // Load all users
  const handleLoadAll = useCallback(async () => {
    if (!UserModel) return;
    setIsLoading(true);
    try {
      const result = await UserModel.findAll();
      setUsers(result);
      addLog(`Loaded ${result.length} users`, 'info');
    } catch (error) {
      addLog(`Error loading users: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [UserModel, addLog]);

  // Initialize database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const ormInstance = new IndexedDBORM(dbName, { version: dbVersion });

        const userModel = ormInstance.define(
          'users',
          {
            id: { type: 'number', primaryKey: true, autoIncrement: true },
            name: { type: 'string', allowNull: false },
            email: { type: 'string', unique: true },
            age: { type: 'number', defaultValue: 0 }
          },
          {
            indexes: [{ fields: ['age'] }]
          }
        );

        await ormInstance._initDatabase();

        setUserModel(userModel);
        setIsInitialized(true);
        addLog('Database initialized successfully', 'success');
      } catch (error) {
        setIsInitialized(false);
        addLog(`Error initializing database: ${(error as Error).message}`, 'error');
        console.error('IndexedDB initialization error:', error);
      }
    };

    initDatabase();
  }, [addLog]);

  // Load users after UserModel is set
  useEffect(() => {
    if (UserModel && isInitialized) {
      handleLoadAll();
    }
  }, [UserModel, isInitialized, handleLoadAll]);

  // CRUD Operations
  const handleCreate = async () => {
    if (!UserModel) return;
    if (!newUser.name || !newUser.email) {
      addLog('Name and email are required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const created = await UserModel.create({
        name: newUser.name,
        email: newUser.email,
        age: newUser.age || 0
      });
      addLog(`Created user: ${created.name} (ID: ${created.id})`, 'success');
      setNewUser({ name: '', email: '', age: 25 });
      await handleLoadAll();
    } catch (error) {
      addLog(`Error creating user: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!UserModel) return;
    setIsLoading(true);
    try {
      const result = await UserModel.findAll({
        where: {
          age: { $gte: minAge, $lte: maxAge }
        },
        order: [['age', 'ASC']]
      });
      setUsers(result);
      addLog(
        `Found ${result.length} users with age between ${minAge} and ${maxAge}`,
        'info'
      );
    } catch (error) {
      addLog(`Error querying users: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!UserModel) return;
    setIsLoading(true);
    try {
      await UserModel.destroy({ where: { id } });
      addLog(`Deleted user with ID: ${id}`, 'success');
      await handleLoadAll();
    } catch (error) {
      addLog(`Error deleting user: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    if (!UserModel) return;
    setIsLoading(true);
    try {
      const sampleUsers = [
        { name: 'Alice', email: `alice_${Date.now()}@example.com`, age: 28 },
        { name: 'Bob', email: `bob_${Date.now()}@example.com`, age: 35 },
        { name: 'Charlie', email: `charlie_${Date.now()}@example.com`, age: 22 }
      ];
      await UserModel.bulkCreate(sampleUsers);
      addLog(`Added ${sampleUsers.length} sample users`, 'success');
      await handleLoadAll();
    } catch (error) {
      addLog(`Error adding sample users: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!UserModel) return;
    setIsLoading(true);
    try {
      await UserModel.clear();
      setUsers([]);
      addLog('Cleared all users', 'success');
    } catch (error) {
      addLog(`Error clearing users: ${(error as Error).message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className={style['indexeddb_demo_page-hero']}>
        <div className={style['indexeddb_demo_page-hero-background']}>
          <div className={style['indexeddb_demo_page-hero-background-overlay']} />
        </div>

        <div className={style['indexeddb_demo_page-hero-content']}>
          <h1 className={style['indexeddb_demo_page-hero-content-title']}>
            {t('hero.title')}
          </h1>
          <p className={style['indexeddb_demo_page-hero-content-subtitle']}>
            {t('hero.subtitle')}
          </p>
          <p className={style['indexeddb_demo_page-hero-content-description']}>
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={style['indexeddb_demo_page-section']}>
        {/* Status Card */}
        <div className={style['indexeddb_demo_page-section-status']}>
          <div
            className={style['indexeddb_demo_page-section-status-indicator']}
            data-connected={isInitialized}
          >
            {isInitialized ? t('status.connected') : t('status.disconnected')}
          </div>
          <span className={style['indexeddb_demo_page-section-status-text']}>
            {t('status.label')}: {dbName} v{dbVersion}
          </span>
        </div>

        {/* Add User Form */}
        <div className={style['indexeddb_demo_page-section-form']}>
          <h2 className={style['indexeddb_demo_page-section-form-title']}>
            {t('form.title')}
          </h2>
          <div className={style['indexeddb_demo_page-section-form-fields']}>
            <TextField
              label={t('form.name')}
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              variant="outlined"
              size="small"
            />
            <TextField
              label={t('form.email')}
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              variant="outlined"
              size="small"
            />
            <TextField
              label={t('form.age')}
              type="number"
              value={newUser.age}
              onChange={(e) =>
                setNewUser({ ...newUser, age: parseInt(e.target.value) || 0 })
              }
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isLoading}
              onClick={handleCreate}
            >
              {t('form.add')}
            </Button>
          </div>
        </div>

        {/* Query Section */}
        <div className={style['indexeddb_demo_page-section-query']}>
          <h2 className={style['indexeddb_demo_page-section-query-title']}>
            {t('query.title')}
          </h2>
          <div className={style['indexeddb_demo_page-section-query-fields']}>
            <TextField
              label={t('query.min_age')}
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(parseInt(e.target.value) || 0)}
              variant="outlined"
              size="small"
            />
            <TextField
              label={t('query.max_age')}
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(parseInt(e.target.value) || 100)}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              color="secondary"
              disabled={isLoading}
              onClick={handleQuery}
            >
              {t('query.search')}
            </Button>
            <Button variant="outlined" disabled={isLoading} onClick={handleLoadAll}>
              {t('query.load_all')}
            </Button>
          </div>
        </div>

        {/* Users List */}
        <div className={style['indexeddb_demo_page-section-list']}>
          <h2 className={style['indexeddb_demo_page-section-list-title']}>
            {t('list.title')} ({users.length})
          </h2>

          {users.length === 0 ? (
            <div className={style['indexeddb_demo_page-section-list-empty']}>
              {t('list.empty')}
            </div>
          ) : (
            <div className={style['indexeddb_demo_page-section-list-items']}>
              {users.map((user) => (
                <div
                  key={user.id as number}
                  className={style['indexeddb_demo_page-section-list-items-item']}
                >
                  <div
                    className={style['indexeddb_demo_page-section-list-items-item-info']}
                  >
                    <span
                      className={
                        style['indexeddb_demo_page-section-list-items-item-info-id']
                      }
                    >
                      #{user.id as number}
                    </span>
                    <span
                      className={
                        style['indexeddb_demo_page-section-list-items-item-info-name']
                      }
                    >
                      {user.name as string}
                    </span>
                    <span
                      className={
                        style['indexeddb_demo_page-section-list-items-item-info-email']
                      }
                    >
                      {user.email as string}
                    </span>
                    <span
                      className={
                        style['indexeddb_demo_page-section-list-items-item-info-age']
                      }
                    >
                      {user.age as number} {t('list.years')}
                    </span>
                  </div>
                  <div
                    className={
                      style['indexeddb_demo_page-section-list-items-item-actions']
                    }
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id as number)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Operations */}
        <div className={style['indexeddb_demo_page-section-bulk']}>
          <h2 className={style['indexeddb_demo_page-section-bulk-title']}>
            {t('bulk.title')}
          </h2>
          <div className={style['indexeddb_demo_page-section-bulk-actions']}>
            <Button
              variant="outlined"
              color="primary"
              disabled={isLoading}
              onClick={handleBulkAdd}
            >
              {t('bulk.add_sample')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={isLoading}
              onClick={handleClearAll}
            >
              {t('bulk.clear_all')}
            </Button>
          </div>
        </div>

        {/* Log Section */}
        <div className={style['indexeddb_demo_page-section-log']}>
          <h2 className={style['indexeddb_demo_page-section-log-title']}>
            {t('log.title')}
          </h2>
          <div className={style['indexeddb_demo_page-section-log-content']}>
            {logs.map((log, index) => (
              <div
                key={index}
                className={style['indexeddb_demo_page-section-log-content-item']}
                data-type={log.type}
              >
                <span
                  className={style['indexeddb_demo_page-section-log-content-item-time']}
                >
                  {log.time}
                </span>
                <span
                  className={
                    style['indexeddb_demo_page-section-log-content-item-message']
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
