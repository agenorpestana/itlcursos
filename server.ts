import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const useMysql = !!process.env.DB_HOST;
let pool: any;
let sqliteDb: any;

if (useMysql) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'itl_cursos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  sqliteDb = new Database('itl_cursos.db');
  sqliteDb.pragma('journal_mode = WAL');
}

// Helper to run queries on either DB
async function query(sql: string, params: any[] = []) {
  try {
    if (useMysql) {
      const [rows] = await pool.query(sql, params);
      return rows;
    } else {
      const stmt = sqliteDb.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(...params);
      } else {
        const result = stmt.run(...params);
        return { insertId: result.lastInsertRowid, affectedRows: result.changes };
      }
    }
  } catch (error) {
    console.error(`Database Error [${sql}]:`, error);
    throw error;
  }
}

// Initialize database
async function initDb() {
  const createTables = [
    `CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS user_courses (
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`
  ];

  // MySQL specific adjustments (AUTO_INCREMENT vs AUTOINCREMENT, VARCHAR vs TEXT)
  const mysqlTables = createTables.map(t => 
    t.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'INT PRIMARY KEY AUTO_INCREMENT')
     .replace(/TEXT NOT NULL/g, 'VARCHAR(255) NOT NULL')
     .replace(/TEXT/g, 'TEXT')
  );

  const tablesToUse = useMysql ? mysqlTables : createTables;

  for (const sql of tablesToUse) {
    if (useMysql) {
      const connection = await pool.getConnection();
      try {
        await connection.query(sql);
      } finally {
        connection.release();
      }
    } else {
      sqliteDb.exec(sql);
    }
  }

  // Create default admin if not exists
  const admins: any = await query("SELECT * FROM users WHERE role = 'admin'");
  if (admins.length === 0) {
    await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ['Admin ITL', 'admin@itl.com', 'admin123', 'admin']
    );
  }
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Auth Route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users: any = await query("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?", [email, password]);
    const user = users[0];
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // API Routes - Courses
  app.get("/api/courses", async (req, res) => {
    const rows = await query("SELECT * FROM courses ORDER BY created_at DESC");
    res.json(rows);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const courses: any = await query("SELECT * FROM courses WHERE id = ?", [req.params.id]);
    const course = courses[0];
    if (!course) return res.status(404).json({ error: "Course not found" });
    
    const modules: any = await query("SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC", [req.params.id]);
    
    const modulesWithLessons = await Promise.all(modules.map(async (mod: any) => {
      const lessons = await query("SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC", [mod.id]);
      return { ...mod, lessons };
    }));

    res.json({ ...course, modules: modulesWithLessons });
  });

  app.post("/api/courses", async (req, res) => {
    const { title, description, thumbnail } = req.body;
    const result: any = await query("INSERT INTO courses (title, description, thumbnail) VALUES (?, ?, ?)", [title, description, thumbnail]);
    res.json({ id: result.insertId });
  });

  app.delete("/api/courses/:id", async (req, res) => {
    await query("DELETE FROM courses WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  });

  // API Routes - Modules & Lessons
  app.post("/api/modules", async (req, res) => {
    const { course_id, title, order_index } = req.body;
    const result: any = await query("INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)", [course_id, title, order_index]);
    res.json({ id: result.insertId });
  });

  app.post("/api/lessons", async (req, res) => {
    const { module_id, title, youtube_url, order_index } = req.body;
    const result: any = await query("INSERT INTO lessons (module_id, title, youtube_url, order_index) VALUES (?, ?, ?)", [module_id, title, youtube_url, order_index]);
    res.json({ id: result.insertId });
  });

  // API Routes - Users (Members)
  app.get("/api/users", async (req, res) => {
    const rows = await query("SELECT id, name, email, role, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC");
    res.json(rows);
  });

  app.post("/api/users", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result: any = await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
      res.json({ id: result.insertId });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    await query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  });

  // API Routes - User Course Permissions
  app.get("/api/users/:id/courses", async (req, res) => {
    const rows = await query(`
      SELECT c.* FROM courses c
      JOIN user_courses uc ON c.id = uc.course_id
      WHERE uc.user_id = ?
    `, [req.params.id]);
    res.json(rows);
  });

  app.post("/api/users/:id/courses", async (req, res) => {
    const { course_id } = req.body;
    try {
      await query("INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)", [req.params.id, course_id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/users/:id/courses/:courseId", async (req, res) => {
    await query("DELETE FROM user_courses WHERE user_id = ? AND course_id = ?", [req.params.id, req.params.courseId]);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`-----------------------------------------`);
    console.log(`ITL CURSOS INICIADO COM SUCESSO`);
    console.log(`Porta: ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Banco: ${useMysql ? 'MySQL' : 'SQLite'}`);
    console.log(`-----------------------------------------`);
  });
}

startServer().catch(console.error);
