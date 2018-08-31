// // import * as R from 'ramda';
// const R = require('ramda');

function Global() {
  this.eventListeners = {
    change: [],
  };
  this.username = 'Clark Kent';
  const self = this;
  (function timer() {
    setTimeout(() => {
      console.log('beware mutation in place');
      self.setUsername(`${Math.random()}`);
      timer();
    }, 3000);
  }());
}


Global.prototype.addEventListener = function addEventListener(eventName, callback) {
  this.eventListeners[eventName].push(callback);
};

Global.prototype.dispatchEvent = function dispatchEvent(eventName, value) {
  this.eventListeners[eventName].forEach(callback => callback(value));
};

Global.prototype.setUsername = function setUsername(username) {
  // const newGlobal = R.merge(this, { username });
  // this.username = username;
  const newobj = Object.assign(Object.create(Global.prototype), { ...this }, { });
  this.dispatchEvent('change', { username });
};

Global.prototype.setPassword = function setPassword() {
  this.dispatchEvent();
};

export default Global;

// const global = new Global();
// console.log(global instanceof Global);
// global.addEventListener('change', (value) => {
//   console.log(value);
//   console.log(value instanceof Global);
// });

// global.setUsername('Bruce Wayne');

// const obj = {
//   a: 1,
//   b: '2',
//   c: {
//     d: '3',
//   }
// };

// const proxy = new Proxy(obj, {
//   set(obj, prop, value) {
//     console.log('obj', obj);
//     console.log('prop', prop);
//     console.log('value', value);
//     Reflect.set(...arguments);
//   }
// })

// proxy.a = 3;
// console.log(obj);
// console.log(proxy);
// proxy.c.d = '23';
// console.log(obj);
// console.log(proxy);
