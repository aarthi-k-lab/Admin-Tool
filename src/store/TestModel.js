// import Model from './Model';
const Model = require('./Model');

class TestModel extends Model {
  constructor() {
    super();
    this.name = 'John Snow';
  }

  get name() {
    return this._name;// ['_name'];
  }

  set name(name) {
    this.setProperty('_name', name);
  }

  makeApiCall() {
    console.log('makeApiCall', this);
  }
}

TestModel.NAME = Symbol('name');


const t = new TestModel();
t.addEventListener('change', (value) => {
  console.log(value.name);
});
t.name = 'Tony Stark';
t.name = ''
// console.log(t.name);
