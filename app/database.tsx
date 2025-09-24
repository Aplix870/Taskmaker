import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// Initialize the database
export const initDb = async () => {
  if (db) return db; // already initialized
  try {
    db = await SQLite.openDatabaseAsync('TasksDB');
    
    // Create new table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        textColour TEXT,
        backColour TEXT,
        dateTime TEXT,
        imageUri TEXT
      );
    `);

    console.log('Database initialized');
    return db;
  } catch (err) {
    console.error('Error initializing database', err);
    throw err;
  }
};

// Add a new task
export const addTaskDb = async (name: string,description: string, textColour:string, backColour:string, dateTime?: Date,imageUri?: string) => {
  try {
    const database = await initDb();
    await database.runAsync(
      'INSERT INTO Tasks (name, description, textColour, backColour, dateTime, imageUri) VALUES (?, ?, ?, ?, ?, ?);',
      [name, description, textColour, backColour, dateTime ? dateTime.toISOString() : null, imageUri ?? null]
    );
    console.log('Task added successfully');
  } catch (err) {
    console.error('Error adding task', err);
  }
};

// Get all tasks
export const getTasks = async () => {
  try {
    const database = await initDb();
    const tasks = await database.getAllAsync(
      'SELECT * FROM Tasks;'
    ) as {
      id: number;
      name: string;
      description: string;
      textColour: string;
      backColour: string;
      dateTime?: string;
      imageUri?: string;
    }[];
    return tasks;
  } catch (err) {
    console.error('Error fetching tasks', err);
    return [];
  }
};

// Delete a task
export const deleteTask = async (taskId: number) => {
  try {
    const database = await initDb();
    await database.runAsync('DELETE FROM Tasks WHERE id = ?;', [taskId]);
    console.log('Task deleted successfully');
  } catch (err) {
    console.error('Error deleting task', err);
    throw err;
  }
};

//Update/Edit a task
export const updateTask = async (
  id: number,
  name: string,
  description: string,
  textColour: string,
  backColour: string,
  dateTime?: Date,
  imageUri?: string
) => {
  const database = await initDb();
  await database.runAsync(
    `UPDATE Tasks SET name = ?, description = ?, textColour = ?, backColour = ?, dateTime = ?, imageUri = ? WHERE id = ?`,
    [name, description, textColour, backColour, dateTime?.toISOString() ?? null, imageUri ?? null, id]
  );
};
