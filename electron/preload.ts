import { ipcRenderer, contextBridge } from 'electron'
import fs from 'fs/promises'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  safeQuery: (sql: string, params: any[] = []) => ipcRenderer.invoke('database:query', { sql, params }),
  showOpenDialog: (options: Electron.OpenDialogOptions) => 
    ipcRenderer.invoke('dialog:openFile', options),
  readFile: (filePath: string, encoding: BufferEncoding = 'utf-8') => 
    fs.readFile(filePath, encoding),
  writeFile: (filePath: string, data: string | NodeJS.ArrayBufferView, encoding: BufferEncoding = 'utf-8') =>
    fs.writeFile(filePath, data, encoding),
  showSaveDialog: (options: Electron.SaveDialogOptions) =>
    ipcRenderer.invoke('dialog:saveFile', options),
  writeToClipboard: (text: string) =>
    ipcRenderer.invoke('clipboard:writeText', text),
  openNewWindow: () => ipcRenderer.send('open-new-window'),
  readFromClipboard: () => ipcRenderer.invoke('clipboard:readText'),
})
