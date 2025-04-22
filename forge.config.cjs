const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,  // 如果不想 asar，就设为 false
    extraResource: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'public')
      // path.resolve(__dirname, 'userData')
    ],
    icon: path.resolve(__dirname, 'public', 'logo.ico')
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',      // ✅ 正确的 Wix Maker
      platforms: ['win32'],
      config: {
        appDirectory: path.join(__dirname, 'out', 'electron-0331-win32-x64'),
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
          name: 'electron-y'   /* 仓库名不要带 https:// 前缀 */
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};
