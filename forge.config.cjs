const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,  
    extraResource: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'public')
    ],
    icon: path.resolve(__dirname, 'public', 'logo.ico')
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',      // ✅ 正确的 Wix Maker
      platforms: ['win32'],
      config: {
        appDirectory: path.join(__dirname, 'out', 'password-management-tool-win32-ia32'),
        outputDirectory: path.join(__dirname, 'out', 'msi'),
        files: [
          '**/*',
          '!**/node_modules/**/*',
          '!**/.git/**/*'
        ],
        name: 'password-management-tool',
        manufacturer: 'yzzob',
        description: 'password management tool',
        exe: 'password-management-tool.exe',
        icon: path.join(__dirname, 'public', 'logo.ico'),
        ui: {
          chooseDirectory: true
        },
        features: {
          autoUpdate: false
        }
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'yzzob',
          name: 'password-management-tool'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};
