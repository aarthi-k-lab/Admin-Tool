# CMOD UI

Things included out of the box:
 - React 16.4
 - Airbnb Style Guide with ESLint
 - Webpack Dev Server
 - Dynamic HTML Generation based on the assets

## Getting Started

### Prerequisites
- Install [Node.js](https://nodejs.org/en/) v8.11.4
  - Use [`nvm`](https://github.com/creationix/nvm), Node Version Manager, to install Node.js
  - Or download it directly from [official website](https://nodejs.org/en/download/)

### Development
1) Install the dependencies.
```
$ npm install
```
2) Run the dev server
```
$ npm start
```
3) Go to http://127.0.0.1:8080/ to see the project in action.
- _Please note that the webpack dev server proxies all requests, except the bundle files, to http://127.0.0.1:7400/. So run your server/ API gateway on this port to receive the proxied requests._

## Styling the components
The project uses `CSS Modules` for styling the components. Some resources to get started with it are given below:

1) [CSS Modules](https://github.com/css-modules/css-modules)

2) [CSS Modules Webpack Demo](https://github.com/css-modules/webpack-demo)

## Commit Message Guidelines
1) Install [Pivotal Git Scripts](https://github.com/pivotal-legacy/git_scripts) to use `git-pair` to commit as more than one author

2) Install [Commitizen](https://github.com/commitizen/cz-cli) to use the standard commit message format. Use `git cz` instead of `git commit` and you will find the `commitizen` prompt.
```
$ npm install -g commitizen
$ npm install -g cz-conventional-changelog
$ echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
``` 

## Debugging
1) Install [VS Code](https://code.visualstudio.com/download)

2) Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension in VS Code

3) Add `launch.json` configuration as shown below

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "sourceMaps": true,
            "breakOnLoad": true
        }
    ]
}
```

4) Use `npm start` to start the dev server

5) Start the debugger in VS Code, add breakpoints and debug straight from the editor

6) Constants to be added when creating a new persona :
    1.constants/groups.js
    2.constants/appGroupName.js
        i. `userGroupList` for usergroup toggle
        ii. `checklistGroupNames` for checklist
    3.lib/Auth.js (To add a new route)
        i. `homePage`
        ii. `failureMessages`
    4.lib/RouteAccess.js
        i. For checklist based ad group `checkListGroups`
        ii. For manager dashboard `managerDashboard`
    5. models/Dashboard/index
        i. GROUPS
        ii. Title
        iii. GROUP_INFO
    6. SearchLoan.jsx - for loan search