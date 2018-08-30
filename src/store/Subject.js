class Subject {
  constructor() {
    this[Subject.EVENTS] = {
    };
  }

  addEventListener(eventName, callback) {
    this.removeEventListener(eventName, callback);
    if (this[Subject.EVENTS][eventName] === undefined) {
      this[Subject.EVENTS][eventName] = [];
    }
    this[Subject.EVENTS][eventName].push(callback);
  }

  removeEventListener(eventName, callback) {
    const eventListeners = this[Subject.EVENTS][eventName] || Subject.EMPTY;
    const index = eventListeners.findIndex(cb => cb === callback);
    if (index !== -1) {
      this[Subject.EVENTS][eventName].splice(index, 1);
    }
  }

  dispatchEvent(eventName, value) {
    const eventListeners = this[Subject.EVENTS][eventName] || Subject.EMPTY;
    eventListeners.forEach(callback => callback(value));
  }
}

Subject.EVENTS = Symbol('events');
Subject.EMPTY = [];

module.exports = Subject;
// export default Subject;

// const s = new Subject();
// function handleChange() { console.log('handleChange'); }
// s.addEventListener('change', handleChange);
// s.addEventListener('change', handleChange);
// console.log(s);
// s.dispatchEvent('change', 5);
// console.log(s);
// s.removeEventListener('change', handleChange);
// console.log(s);
// s.dispatchEvent('change', 5);
// console.log(s);
// const EventEmitter = require('events');

// class MyEmitter extends EventEmitter {}

// const myEmitter = new MyEmitter();
// const f = () => {
//   console.log('an event occurred!');
// };
// myEmitter.on('event', f);
// myEmitter.on('event', f);
// myEmitter.emit('event');
// myEmitter.removeListener('event', f);
// myEmitter.emit('event');
// myEmitter.removeListener('event', f);
// myEmitter.emit('event');
