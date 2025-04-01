"use strict";
const electron = require("electron");
const fs = require("fs/promises");
electron.contextBridge.exposeInMainWorld("api", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  safeQuery: (sql, params = []) => electron.ipcRenderer.invoke("database:query", { sql, params }),
  showOpenDialog: (options) => electron.ipcRenderer.invoke("dialog:openFile", options),
  readFile: (filePath, encoding = "utf-8") => fs.readFile(filePath, encoding)
  // writeToClipboard: (text:string) => {
  //   return ipcRenderer.invoke('writeToClipboard', text);
  // }
});
