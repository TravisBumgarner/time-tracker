const { notarize } = require('@electron/notarize');
require('dotenv').config({path: './electron-builder.env'});

console.log('Notarizing')


exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }
  
  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.sillysideprojects.timetracker',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLETEAMID
  });
};