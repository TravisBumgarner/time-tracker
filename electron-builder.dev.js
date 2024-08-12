require('dotenv').config({path: './electron-builder.env'});

const config = {
  "productName": "dev", // Needs to be unique for each environment or else can't open both at once.
  "appId": "dev.dev.dev",
  "asar": true,
  "directories": {
    "output": "release/${version}"
  },
  "files": [
    "dist-electron",
    "dist"
  ],
  "mac": {
    "artifactName": "${productName}_${version}.${ext}",
    "entitlements": "build/mac/entitlements.plist",
    "hardenedRuntime" : true,
    "gatekeeperAssess": false,
    "target": "default"
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64"
        ]
      }
    ],
    "artifactName": "${productName}_${version}.${ext}"
  },
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "deleteAppDataOnUninstall": false
  },
  "publish": {
    "provider": "github",
    "token": process.env.GITHUB_TOKEN
  }
}

module.exports = config;
