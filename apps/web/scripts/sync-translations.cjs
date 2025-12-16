const fs = require("fs");
const path = require("path");

const translationsDir = path.join(
  __dirname,
  "..",
  "client",
  "src",
  "translations"
);
const baseFile = path.join(translationsDir, "en.json");

function flatten(obj, prefix = "") {
  const res = {};
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(res, flatten(val, key));
    } else {
      res[key] = val;
    }
  }
  return res;
}

function unflatten(flat) {
  const res = {};
  for (const k of Object.keys(flat)) {
    const parts = k.split(".");
    let cur = res;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1) {
        cur[p] = flat[k];
      } else {
        cur[p] = cur[p] || {};
        cur = cur[p];
      }
    }
  }
  return res;
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function sync() {
  if (!fs.existsSync(baseFile)) {
    console.error("Base en.json not found at", baseFile);
    process.exit(1);
  }
  const base = readJSON(baseFile);
  const baseFlat = flatten(base);

  const files = fs
    .readdirSync(translationsDir)
    .filter((f) => f.endsWith(".json") && f !== "en.json");

  for (const file of files) {
    const full = path.join(translationsDir, file);
    const obj = readJSON(full);
    const flat = flatten(obj);
    let changed = false;

    // Add missing keys from base
    for (const k of Object.keys(baseFlat)) {
      if (!(k in flat)) {
        flat[k] = baseFlat[k];
        changed = true;
      }
    }

    // Optionally, remove keys not in base? We'll keep extras.

    if (changed) {
      const merged = unflatten(flat);
      writeJSON(full, merged);
      console.log(`Updated ${file} (added missing keys).`);
    } else {
      console.log(`${file} already in sync.`);
    }
  }
}

sync();
