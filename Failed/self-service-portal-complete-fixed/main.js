const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const dataPath = path.join(__dirname, 'data', 'troubleshooting.json');

ipcMain.handle('load-data', () => {
    try {
        const rawData = fs.readFileSync(dataPath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error loading data:", error);
        return {};
    }
});

ipcMain.handle('save-data', (event, data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
        return { success: true };
    } catch (error) {
        console.error("Error saving data:", error);
        return { success: false, error: error.message };
    }
});