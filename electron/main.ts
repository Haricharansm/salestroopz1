import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import { GoogleGenAI } from "@google/genai";

const db = new Database('app.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS data (key TEXT PRIMARY KEY, value TEXT);
`);

async function runSequencingEngine() {
    const row = db.prepare('SELECT value FROM data WHERE key = ?').get('campaigns');
    if (!row) return;
    
    const campaigns = JSON.parse(row.value as string);
    const now = new Date().toISOString().split('T')[0];
    let updated = false;

    for (const campaign of campaigns) {
        for (const step of campaign.steps) {
            if (step.sendDate <= now && !step.sent) {
                console.log(`Sending step ${step.id} for campaign ${campaign.id}`);
                // In a real app, actually send the email here
                step.sent = true;
                updated = true;
            }
        }
    }

    if (updated) {
        db.prepare('INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)').run('campaigns', JSON.stringify(campaigns));
    }
}

// Run engine every minute
setInterval(runSequencingEngine, 60000);

ipcMain.handle('save-settings', (_, settings) => {
// ... existing save-settings ...
    for (const [key, value] of Object.entries(settings)) {
        db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
    }
});

ipcMain.handle('get-settings', () => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings: Record<string, any> = {};
    rows.forEach(row => settings[row.key as string] = JSON.parse(row.value as string));
    return settings;
});

ipcMain.handle('save-campaigns', (_, campaigns) => {
    db.prepare('INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)').run('campaigns', JSON.stringify(campaigns));
});

ipcMain.handle('get-campaigns', () => {
    const row = db.prepare('SELECT value FROM data WHERE key = ?').get('campaigns');
    return row ? JSON.parse(row.value as string) : [];
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
