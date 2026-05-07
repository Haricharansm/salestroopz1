import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveCampaigns: (campaigns: any) => ipcRenderer.invoke('save-campaigns', campaigns),
  getCampaigns: () => ipcRenderer.invoke('get-campaigns'),
});
