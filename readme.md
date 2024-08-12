# Building & Deploying

Note - Cannot deploy Mac from Windows. Can deploy windows from Mac.

## Windows

Note - Windows build will fail if app is open.

## Mac

0. Set local credentials
   - `./electron-builder.env`
   - Get a new token from https://github.com/settings/personal-access-tokens/new
      - Need fine grained details for releases
1. Bump version in `package.json`
2. Update Changelog in Todo-Today-Website repo and deploy website
3. `yarn run deploy-electron-mac-prod`
4. (TO IMPLEMENT STILL) Visit https://github.com/TravisBumgarner/Todo-Today-Releases/releases and publish release
5. (TO IMPLEMENT STILL)  Logs for the app can be found in `~/Library/Logs/Todo\ Today/main.log`
