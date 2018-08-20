# React Boilerplate

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
3) Go to http://127.0.0.1:8100/ to see the project in action.
- _Please note that the webpack dev server proxies all requests, except the bundle files, to http://127.0.0.1:7400/. So run your server/ API gateway on this port to receive the proxied requests._
