import initSqlJs from "sql.js";

let db;

export async function initDB() {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js/dist/${file}`
  });

  const saved = localStorage.getItem("3dcalc-db");
  if (saved) {
    const uInt8Array = Uint8Array.from(JSON.parse(saved));
    db = new SQL.Database(uInt8Array);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      final_price REAL,
      created_at TEXT
    );
  `);
}

function persist() {
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem("3dcalc-db", JSON.stringify(arr));
}

export function saveProject(name, price) {
  const stmt = db.prepare(
    "INSERT INTO projects (name, final_price, created_at) VALUES (?, ?, ?)"
  );
  stmt.run([name, price, new Date().toISOString()]);
  stmt.free();
  persist();
}

export function getProjects() {
  const res = db.exec("SELECT * FROM projects ORDER BY id DESC");
  if (res.length === 0) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) =>
    Object.fromEntries(cols.map((c, i) => [c, row[i]]))
  );
}

export function deleteProject(id) {
  db.run("DELETE FROM projects WHERE id = " + id);
  persist();
}
