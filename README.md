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
    7. getStagerGroup - For stager access. 
        i. stagerGroups - Add additional AD group to get Stager tiles access. 
        ii. postModGroups - Add  additional AD group to get  POSTMOD tiles access

7) The above changes mentioned in point (6) pertains to CMOD.UI. The other dependent service changes are as follows.
    `(NOTE: The referral PRs are authored from Second look PBIs and are shared in order. The groupName used in all these repositories should be inline with the AD group's lastname. For Example: In **cmod-dev-RPSstager** AD group, **RPSstager** can be the derived groupName and it will be used across UI/BPM/ODM/Microservice changes)`
    1. CMOD.Disposition.Service: Adding Disposition validations.
        i. The mentioned dispositions from the AC needs to be created as an object in src->models->validations.js file.
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.Disposition.Service/pullrequest/129049)
    2. CMOD.APIScheduler: Adding a build bucket scheduler to refresh/pick new tasks as per userSkill.
        i. Add the scheduler configuration in Data->BuildBuckets.task
        ii. The `Body` with `appFilterName, appGroupName, appName` is given as per the configuration in BPM/ODM/AD group.
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.APIScheduler/pullrequest/130672)
    3. CMOD.UserSkills.Cache: Adding groupName to cache skill groups in redis.
        i. Under src->main->java->com->mrcooper->cmod->users->models->SkillGroup.java, Add the groupName to `groups` array.
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.UserSkills.Cache/pullrequest/130671)
    4. AUDIT.BPM.Events: Adding the enum and Assign User name to bucket and pick unassigned tasks.
        i. Under src->main->resources->application.yml, add groupName to `ASGN_USR_NM` list in `unAssignedTasks` query.
        ii. In src->main->java->com->mrcooper->audit->enums->GroupToTaskNameMap.java, Add the enum mapper for the persona.
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/AUDIT.BPM.Events/pullrequest/131345)
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/AUDIT.BPM.Events/pullrequest/131020)
    5. Adding AD groups to CMOD.AD.Authentication.Service
        i. Under deployment/appregistration/azuread.yaml file, add the AD groups in all environments
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.AD.Authentication.Service/pullrequest/129204)
    6. CMOD.WorkAssignment.Service: Adding groupName to pick skill based task; Changes for disposition details
        i. Under src->models->app-group-name.js, add the groupName constant and refer the same in `checklistGroupNames` array.
        ii. In the same file add the groupName to `appGroupNameToUserPersonaMap` object.
        iii. Under src->models->bpmRequest.js file, create a new object with groupName and add the disposition validations.
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.WorkAssignment.Service/pullrequest/129208)
        (Refer PR - https://mrcooper.visualstudio.com/CMOD/_git/CMOD.WorkAssignment.Service/pullrequest/129050)

